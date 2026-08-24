import { Db, MongoClient } from "mongodb";
import { MONGO_DB, MONGO_URI } from "../config.js";

const client = new MongoClient(MONGO_URI);
let /**@type {Db} */ db;

export async function connectToMongo() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(MONGO_DB);
      console.log("Connected to mongo...");
    } catch (error) {
      console.log(error.message);
    }
  }
  return db;
}
