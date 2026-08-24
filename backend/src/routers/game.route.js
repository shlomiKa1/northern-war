import express from "express";

export default function createGameRouter(gameService) {
  const router = express.Router();

  router.get("/:id", async (req, res) => {
    const id = req.params.id;

    const game = await gameService.getGame(id);

    res.send(game);
  });

  router.post("/", async (req, res) => {
    const playerName = req.body;
    const game = await gameService.createNewGame(playerName);

    res.status(201).send(game);
  });

  router.post("/:id/reinforce", async (req, res) => {
    const gameId = req.params.id;
    const territorieId = req.body;
    const game = await gameService.reinforce(territorieId, gameId);

    res.send(game);
  });

  return router;
}
