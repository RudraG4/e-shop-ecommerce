import express from "express";
import HistoryController from "../controller/HistoryController.js";
import isAuthorized from "../middlewares/Auth.js";

const history = express.Router();

history.get("/pbhistory", isAuthorized, HistoryController.getBrowsingHistory);

export default history;
