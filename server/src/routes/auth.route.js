import express from "express";
import AuthController from "../controller/AuthController.js";
import { verifyAuth, verifyRefresh } from "../middlewares/Auth.js";

const authRoute = express.Router();

authRoute.post("/register", AuthController.register);
authRoute.post("/signin", AuthController.signin);
authRoute.post("/signout", verifyAuth, AuthController.signout);
authRoute.post("/token/refresh", verifyRefresh, AuthController.refresh);
authRoute.post("/verify", AuthController.verify);
authRoute.post("/forgot-password", AuthController.forgotpassword);
authRoute.post("/reset-password", AuthController.resetpassword);

export default authRoute;
