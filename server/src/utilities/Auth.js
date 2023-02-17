import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_EXPIRY = parseInt(process.env.JWT_ACCESS_EXPIRY, 10) || 900;
const JWT_REFRESH_EXPIRY = parseInt(process.env.JWT_REFRESH_EXPIRY, 10) || 1800;

const JWT_ACCESS_SIGN_OPTION = {
  expiresIn: JWT_ACCESS_EXPIRY,
};

const JWT_REFRESH_SIGN_OPTION = {
  expiresIn: JWT_REFRESH_EXPIRY,
};

const JWT_VERIFY_OPTIONS = {
  complete: true,
};

class Auth {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(plainText, password) {
    return await bcrypt.compare(plainText, password);
  }

  static encodeToken(payload) {
    const signPayload = {
      ...payload,
      iss: "ESHOP",
      appName: "ESHOP",
      createdAt: new Date().getTime(),
    };
    const access_token = jwt.sign(
      signPayload,
      JWT_ACCESS_SECRET,
      JWT_ACCESS_SIGN_OPTION
    );
    return {
      access_token,
      expires_in: JWT_ACCESS_EXPIRY,
      token_type: "Bearer",
    };
  }

  static encodeRefreshToken(payload) {
    const signPayload = {
      ...payload,
      iss: "ESHOP",
      appName: "ESHOP",
      createdAt: new Date().getTime(),
    };
    return jwt.sign(signPayload, JWT_REFRESH_SECRET, JWT_REFRESH_SIGN_OPTION);
  }

  static decodeToken(jwtToken) {
    try {
      if (jwtToken) {
        return jwt.verify(jwtToken, JWT_ACCESS_SECRET, JWT_VERIFY_OPTIONS);
      }
      return null;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid Token");
      }
    }
  }

  static decodeRefreshToken(refreshToken) {
    try {
      if (refreshToken) {
        return jwt.verify(refreshToken, JWT_REFRESH_SECRET, JWT_VERIFY_OPTIONS);
      }
      return null;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid Token");
      }
    }
  }
}

export default Auth;
