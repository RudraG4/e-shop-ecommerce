import express from "express";
import ProductController from "../controller/ProductController.js";
import isAuthorized from "../middlewares/Auth.js";

const productRoute = express.Router();

productRoute.get("/", ProductController.queryProducts);
productRoute.get("/suggest", isAuthorized, ProductController.suggests);
productRoute.get("/featured", async (req, res) => {});
productRoute.get("/:_id", isAuthorized, ProductController.queryProductById);

export default productRoute;
