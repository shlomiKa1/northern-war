import express from "express";
import cors from "cors";
import { MONGO_DB, PORT } from "./config.js";
import { connectToMongo } from "./connection/mongo.js";
import createGameRepository from "./repository/game.repository.js";
import createeGameService from "./services/game.service.js";
import createGameRouter from "./routers/game.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const db = await connectToMongo();
const collection = db.collection(MONGO_DB);
const gameRepository = createGameRepository(collection);
const gameService = createeGameService(gameRepository);
const gameRouter = createGameRouter(gameService);

const app = express();

app.use(express.json());
app.use(cors());

app.use("/games", gameRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listning on port: ${PORT}`);
});
