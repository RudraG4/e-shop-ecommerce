import express from "express";
import isAuthorized from "../middlewares/Auth.js";
import CheckoutController from "../controller/CheckoutController.js";

const checkout = express.Router();

checkout.post("/create", isAuthorized, CheckoutController.createPaymentIntent);

checkout.post("/cancel", isAuthorized, CheckoutController.cancelPaymentIntent);

checkout.post(
  "/webhook",
  express.json({ type: "application/json" }),
  CheckoutController.webHook
);

export default checkout;
