import EShopAPI from "./src/EShopAPI.js";
import db from "./src/db/db.js";
import Mailer from "./src/mailer/mailer.js";
import { config } from "dotenv";

config();

const setup = async () => {
  let client;
  try {
    client = await db.connect();
    console.log(`[Database] Successfully connected to ${client.options.srvHost}`);
    await Mailer.init();
    const server = new EShopAPI({ db: client }).start();
  } catch (e) {
    console.error("[EShopAPI] Failed to start server. ", e);
    if (client) {
      client.close();
    }
  }
};

setup();
