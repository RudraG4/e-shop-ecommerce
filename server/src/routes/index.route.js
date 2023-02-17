import { fileURLToPath } from "url";
import { marked } from "marked";
import express from "express";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexRouteHandler = async (req, res) => {
  const readmePath = path.resolve(__dirname, "../../README.md");
  fs.readFile(readmePath, (err, data) => {
    if (err) {
      err.message = err.message.replace(
        path.resolve(__dirname, "../../"),
        ".."
      );
      return res
        .status(500)
        .send(`<h1>500 Internal Server Error</h1><p>${err}</p>`);
    }
    return res.status(200).send(marked.parse(data.toString()));
  });
};

const index = express.Router();
index.get("/", indexRouteHandler);

export default index;
