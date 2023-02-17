import express from "express";
import CartController from "../controller/CartController.js";
import isAuthorized, { verifyAuth } from "../middlewares/Auth.js";

const cart = express.Router();

cart.get("/", isAuthorized, CartController.getCart);
cart.get("/count", isAuthorized, CartController.getCartCount);
cart.post("/add", isAuthorized, CartController.addToCart);
cart.post("/remove", isAuthorized, CartController.removeFromCart);
cart.post("/clear", isAuthorized, CartController.clearCart);
cart.post("/summary", isAuthorized, CartController.calculateSummary);

export default cart;
