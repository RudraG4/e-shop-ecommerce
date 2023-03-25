import { MongoClient, ServerApiVersion } from "mongodb";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeDAO = async (client) => {
  const daos = await readdir(path.resolve(__dirname, "../dao"));
  for (const dao of daos) {
    try {
      if (!dao.endsWith("DAO.js")) continue;
      const { default: DAO } = await import(`../dao/${dao}`);
      if (DAO) {
        if ("injectClient" in DAO && typeof DAO.injectClient === "function") {
          await DAO.injectClient(client);
          console.log(`[DAO] injected client to DAO ${dao}`);
        }
      }
    } catch (err) {
      console.log(`[DAO] Error registering DAO ${dao}: ${err.message}`);
    }
  }
};

const connect = async () => {

  if (!process.env.ESHOP_DB_URI) { throw new Error("Database connectivity info not provided!! Check your connection string"); }

  const options = {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    w: "majority",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  };
  const client = await MongoClient.connect(process.env.ESHOP_DB_URI, options);
  if (client) {
    await initializeDAO(client);
  }
  return client;
};

export default { connect };
