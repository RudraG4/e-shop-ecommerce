import express from "express";
import UserController from "../controller/UserController.js";
import isAuthorized, { verifyAuth, isAdmin } from "../middlewares/Auth.js";

const userRoute = express.Router();

userRoute.get("/", isAdmin, UserController.queryusers);
userRoute.get("/find", UserController.finduser);
userRoute.get("/info", isAuthorized, UserController.queryUserInfo);
userRoute.post("/make-admin", isAdmin, UserController.makeAdmin);
userRoute.post("/revoke-admin", isAdmin, UserController.revokeAdmin);

userRoute.post(
  "/update-preference",
  verifyAuth,
  UserController.updatePreference
);
userRoute.get("/get-addresses", verifyAuth, UserController.getUserAddresses);
userRoute.post("/address-change", verifyAuth, UserController.addressChange);

export default userRoute;
