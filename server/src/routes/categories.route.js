import express from "express";
import CategoryController from "../controller/CategoryController.js";
import { isAdmin } from "../middlewares/Auth.js";
const category = express.Router();

category.get("/", CategoryController.queryCategories);
category.post("/add", isAdmin, CategoryController.addCategory);
category.delete("/remove/:_id", isAdmin, CategoryController.removeCategory);
category.get("/:_id", isAdmin, CategoryController.queryCategory);

export default category;
