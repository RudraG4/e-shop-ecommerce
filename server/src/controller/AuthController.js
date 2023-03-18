import { config } from "dotenv";
import { nanoid } from "nanoid";
import Mailer from "../mailer/mailer.js";
import Cache from "../db/cache.js";
import EventEmitter from "events";
import Auth from "../utilities/Auth.js";
import UserDAO from "../dao/UserDAO.js";
import CartDAO from "../dao/CartDAO.js";

config();

const eventemitter = new EventEmitter();

const isEmail = (content) => {
  const regexp = new RegExp(/^[\w-\.]+[\w-\.]*@([\w-]+\.)+[\w-]{2,}$/g);
  return regexp.test(content);
};

const generateOTP = () => {
  return Array(3)
    .fill(1)
    .reduce((accum, curr) => {
      return accum + String(Math.ceil(Math.random() * 100));
    }, "");
};

const generateAccessToken = (payload) => {
  return Auth.encodeToken(payload);
};

const generateRefreshToken = (payload) => {
  return Auth.encodeRefreshToken(payload);
};

const register = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!email) {
      return res.status(400).json({
        error: "email address is required to register",
      });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "password is required" });
    }

    const newUser = { name, email, mobile };
    newUser["password"] = await Auth.hashPassword(password);

    const createResp = await UserDAO.createUser(newUser);
    if (createResp.error) {
      return res.status(400).json(createResp);
    }

    const otp = generateOTP();
    Cache.otpCache.set(email, otp);
    eventemitter.emit("otp-generated", { email, otp, name });

    return res.status(200).json(createResp);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { sessionid } = req.session;

    const user = await UserDAO.findUserWithPassword(email);
    if (!user) {
      return res.status(404).json({
        error: "User with this email address is not found",
      });
    }
    const isMatch = await Auth.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Your password is incorrect",
      });
    }

    const payload = {
      email: user.email,
      mobile: user.mobile,
      name: user.name,
    };
    const tokenInfo = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const updateInfo = {
      access_token: tokenInfo.access_token,
      refresh_token: refreshToken,
      status: "Active",
    };
    await UserDAO.updateUserByEmail(email, updateInfo);
    await CartDAO.associateCartToUser(user._id.toString(), sessionid);

    const respBody = {
      success: true,
      ...tokenInfo,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        admin: user.admin,
        preference: user.preference,
      },
      refresh_token: refreshToken,
    };
    return res.status(200).json(respBody);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const signout = async (req, res) => {
  try {
    const userJwt = req.get("Authorization").slice("Bearer ".length);
    const tokenInfo = Auth.decodeToken(userJwt);
    if (!tokenInfo.payload) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    const { email } = tokenInfo.payload;
    const updateInfo = {
      access_token: undefined,
      refresh_token: undefined,
      status: "InActive",
    };
    const updateResp = await UserDAO.updateUserByEmail(email, updateInfo);
    if (updateResp?.success) {
      req.session.destroy();
      return res.status(200).json(updateResp);
    }
    return res
      .status(401)
      .json(updateResp || "Error occurred while signing out");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { email, mobile, name } = req.user;
    const { refresh_token } = req.body;
    const payload = { email, mobile, name };
    const tokenInfo = generateAccessToken(payload);
    const updateInfo = {
      access_token: tokenInfo.access_token,
      status: "Active",
    };
    await UserDAO.updateUserByEmail(email, updateInfo);
    return res.status(200).json({
      success: true,
      access_token: tokenInfo.access_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const verify = async (req, res) => {
  try {
    const { code, email, action } = req.body;
    if (!["send", "resend", "code"].includes(action))
      return res.status(200).json({ error: "Invalid action" });

    if (action === "send" || action === "resend") {
      const userInfo = await UserDAO.findUserByEmail(email);
      if (!userInfo) {
        return res.status(404).json({ error: "User not found" });
      }
      const otp = generateOTP();
      Cache.otpCache.set(email, otp);
      eventemitter.emit("otp-generated", { email, otp, name: userInfo.name });
      return res.status(200).json({ success: true });
    }

    if (action === "code") {
      const storedCode = Cache.otpCache.take(email);
      if (storedCode === code + "") {
        await UserDAO.updateUserByEmail(email, {
          isVerified: true,
          isDraft: false,
        });
        return res.status(200).json({ success: true });
      }
      return res.status(200).json({ error: "Invalid or expired otp" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "email address is required" });
    }
    const userInfo = await UserDAO.findUserByEmail(email);
    if (!userInfo) {
      return res.status(400).json({ error: "User not found" });
    }
    const otp = generateOTP();
    Cache.otpCache.set(email, otp);
    eventemitter.emit("pwd-reset-init", { email, otp, name: userInfo.name });
    const verifyToken = [nanoid(), nanoid(), nanoid()].join(".");
    Cache.pwdResetCache.set(email, verifyToken);
    return res.status(200).json({ success: true, verify_token: verifyToken });
  } catch (error) {
    return res.status(500).json({ error: err.message });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { email, verify_token, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "email address is required" });
    }
    const userInfo = await UserDAO.findUserByEmail(email);
    if (!userInfo) {
      return res.status(400).json({ error: "User not found" });
    }

    const storedVerifyToken = Cache.pwdResetCache.take(email);
    if (!storedVerifyToken || storedVerifyToken !== verify_token) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    await UserDAO.updateUserByEmail(email, { password });
    eventemitter.emit("pwd-reset-done", { email, name: userInfo.name });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

eventemitter.on("otp-generated", ({ email, otp, name }) => {
  try {
    Mailer.sendTemplatedMail(email, "OTP_MAIL", { name, otp });
  } catch (e) {
    console.error("Error sending OTP Mail");
  }
});

eventemitter.on("pwd-reset-init", ({ email, otp, name }) => {
  try {
    Mailer.sendTemplatedMail(email, "PWD_RST_INIT_MAIL", { name, otp });
  } catch (e) {
    console.error("Error sending OTP Mail");
  }
});

eventemitter.on("pwd-reset-done", ({ email, name }) => {
  try {
    Mailer.sendTemplatedMail(email, "PWD_RST_DONE_MAIL", { name });
  } catch (e) {
    console.error("Error sending OTP Mail");
  }
});

export default {
  register,
  signin,
  signout,
  refresh,
  verify,
  forgotpassword,
  resetpassword,
};
