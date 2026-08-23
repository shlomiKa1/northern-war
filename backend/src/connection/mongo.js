import { Db, MongoClient } from "mongodb";
import { MONGO_DB, MONGO_URI } from "../config.js";

let /**@type {Db} */ db;

export async function connectToMongo() {
  if (!db) {
    try {
      const client = new MongoClient(MONGO_URI);
      db = await client.connect(MONGO_DB);
      console.log("Connected to mongo...");
    } catch (error) {
      console.log(error.message);
    }
  }
  return db;
}
