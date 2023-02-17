import express from "express";
import OrderController from "../controller/OrderController.js";
import { verifyAuth } from "../middlewares/Auth.js";
const order = express.Router();

order.get("/", verifyAuth, OrderController.queryOrders);

export default order;
