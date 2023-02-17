import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import { fileURLToPath } from "url";
import path from "path";
import { readdir } from "node:fs/promises";
import { config } from "dotenv";

config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  exposedHeaders: "session-id,currency",
  credentials: true,
  maxAge: 24 * 60 * 60 * 1000,
};
const loggerFormat = "[REQUEST] :method :url   :status :response-time ms";

export default class EShopAPI {
  constructor(options) {
    this.db = options.db;
    this.app = express();
    this.PORT = process.env.PORT || options.PORT;
  }

  async start() {
    this.app.use(logger(loggerFormat));
    this.app.use(cors(corsOptions));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use((req, res, next) => {
      const genUniqueId = () => {
        return Buffer.from(new ObjectId().toString()).toString("base64");
      };
      const decodeUniqueId = (id) => {
        return Buffer.from(id, "base64").toString("ascii");
      };
      if (req.method !== "OPTIONS") {
        const sessionid = req.headers["session-id"] || genUniqueId();
        const currency = req.headers["currency"] || "USD";
        req.session = req.session || {};
        req.session.sessionid = decodeUniqueId(sessionid);
        req.header("currency", currency);
        res.header("session-id", sessionid);
        res.header("currency", currency);
      }
      next();
    });
    await this.loadRoutes();
    this.app.use((req, res) => {
      return res.status(404).json({ error: "Not Found" });
    });
    return this.launch();
  }

  async launch() {
    try {
      var server = this.app.listen(this.PORT, () => {
        console.log(
          "[Server] Successfully started on port " + server.address().port
        );
      });
      return server;
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
  }

  async loadRoutes() {
    try {
      const routes = await readdir(path.join(__dirname, "routes"));
      for (const route of routes) {
        try {
          if (!route.endsWith(".route.js")) continue;
          let routeBase = "/" + route.split(".")[0];
          const { default: router } = await import(
            path.join(__dirname, "routes", route)
          );
          if (router) {
            if (routeBase === "/index") {
              routeBase = "/";
            }
            this.app.use(routeBase, router);
            console.log(`[Router] registered route ${routeBase}`);
          }
        } catch (error) {
          console.log(
            `[Router] Error registering route ${route} : ${error.message}`
          );
        }
      }
    } catch (error) {
      console.log(`[Router] Error reading routes directory ${error.message}`);
    }
  }
}
