import express from "express";

export default function createGameRouter(gameService) {
  const router = express.Router();

  router.post("/games", async (req, res) => {
    const playerName = req.body;
    const game = await gameService.createNewGame(playerName);

    res.status(201).send(game);
  });

  return router;
}
