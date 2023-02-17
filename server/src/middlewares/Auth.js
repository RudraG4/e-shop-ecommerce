import Auth from "../utilities/Auth.js";
import UserDAO from "../dao/UserDAO.js";

const fields = [
  "name",
  "email",
  "mobile",
  "status",
  "_id",
  "isVerified",
  "admin",
  "preference",
];

const getUserByAccessToken = async (token) => {
  const tokenInfo = await Auth.decodeToken(token);
  if (tokenInfo?.payload) {
    const { email } = tokenInfo.payload;
    return await UserDAO.findUserByEmail(email, fields);
  }
};

const getUserByRefreshToken = async (refreshToken) => {
  const tokenInfo = await Auth.decodeRefreshToken(refreshToken);
  if (tokenInfo?.payload) {
    const { email, name } = tokenInfo.payload;
    const user = await UserDAO.findOne({ refresh_token: refreshToken }, fields);
    if (user && user.name === name && user.email === email) {
      return user;
    }
  }
};

const isAuthorized = async (authorization) => {
  if (
    authorization &&
    authorization.startsWith("Bearer") &&
    authorization.split(" ")?.length === 2
  ) {
    try {
      const token = authorization.split(" ")[1];
      const user = await getUserByAccessToken(token);
      if (user) {
        return { authorized: true, user };
      }
    } catch (error) {
      if (error.message === "Invalid Token") {
        return { authorized: false, error: error.message };
      }
    }
  }
  return { authorized: false, error: "Unauthorized" };
};

export const verifyAuth = async (request, response, next) => {
  try {
    const { authorization } = request.headers;
    const isAuth = await isAuthorized(authorization);
    if (isAuth.authorized) {
      request.user = { ...isAuth.user, userId: isAuth.user._id.toString() };
      return next();
    }
    return response.status(401).send();
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export const verifyRefresh = async (request, response, next) => {
  try {
    const refreshToken = request.body["refresh_token"];
    const user = await getUserByRefreshToken(refreshToken);
    if (user) {
      request.user = { ...user, userId: user._id.toString() };
      return next();
    }
    return response.status(401).send();
  } catch (error) {
    if (error.message === "Invalid Token") {
      return response.status(401).send();
    }
    return response.status(500).json({ error: error.message });
  }
};

export const isAdmin = async (request, response, next) => {
  try {
    const { authorization } = request.headers;
    const isAuth = await isAuthorized(authorization);
    if (isAuth.authorized && isAuth.user.admin) {
      request.user = { ...isAuth.user, userId: isAuth.user._id.toString() };
      return next();
    }
    return response.status(401).send();
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
};

export default async (request, response, next) => {
  try {
    const { authorization } = request.headers;
    if (authorization) {
      const isAuth = await isAuthorized(authorization);
      if (isAuth.authorized) {
        request.user = { ...isAuth.user, userId: isAuth.user._id.toString() };
        return next();
      }
      return response.status(401).send();
    }
    return next();
  } catch (error) {
    if (error.message === "Invalid Token") {
      return response.status(401).send();
    }
    return response.status(500).json({ error: error.message });
  }
};
