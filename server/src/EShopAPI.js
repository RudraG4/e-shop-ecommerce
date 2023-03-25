import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import { readdir } from "node:fs/promises";
import { config } from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  exposedHeaders: "currency",
  credentials: true,
  maxAge: 24 * 60 * 60 * 1000,
};
const loggerFormat = "[REQUEST] [:date[iso]] [:method] :url HTTP/:http-version :status :response-time ms";

const sessionStore = (db) => {
  const store = MongoStore.create({
    client: db,
    stringify: false,
    autoRemove: "interval",
    autoRemoveInterval: 60,
    ttl: 24 * 24 * 60 * 60,
  });
  return store;
};

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
    this.app.use(
      session({
        secret: "keyboard cat",
        name: "session",
        resave: false,
        saveUninitialized: false,
        cookie: {
          sameSite: "strict",
        },
        store: sessionStore(this.db),
      })
    );
    this.app.use((req, res, next) => {
      req.session.sessionid = req.session.id;
      req.session.currency = req.session.currency || "USD";

      next();
    });
    await this.loadRoutes();
    return this.launch();
  }

  async loadRoutes() {
    try {
      const routes = await readdir(path.join(__dirname, "routes"));
      for (const route of routes) {
        try {
          if (!route.endsWith(".route.js")) continue;
          let routeBase = "/" + route.split(".")[0];
          const { default: router } = await import(`./routes/${route}`);
          if (router) {
            if (routeBase === "/index") {
              routeBase = "/";
            }
            this.app.use(routeBase, router);
            console.log(`[Router] registered route ${routeBase}`);
          }
        } catch (error) {
          console.log(`[Router] Error registering route ${route} : ${error.message}`);
        }
      }
      this.app.use((req, res) => {
        return res.status(404).json({ error: "Not Found" });
      });
    } catch (error) {
      console.log(`[Router] Error reading routes directory ${error.message}`);
    }
  }

  async launch() {
    try {
      const server = this.app.listen(this.PORT, () => {
        console.log("[Server] Successfully started on port " + server.address().port);
      });
      return server;
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
  }
}
