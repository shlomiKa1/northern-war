import { ObjectId } from "mongodb";
import { schemaNewGame, schemaReinforce } from "../modules/game.js";
import { createGame, reinforcement } from "../utils/helper.js";

function errMessage(message, statusCode) {
  const objMessage = typeof message === "object" ? message.error : message;
  return { message, statusCode };
}

export default function createeGameService(gameRepo) {
  async function createNewGame(playerName) {
    const parsed = schemaNewGame.safeParse(playerName);

    if (!parsed.success) {
      throw new errMessage(parsed.error.issues, 400);
    }

    const game = await createGame(parsed.data);
    const create = await gameRepo.create(game);

    game.id = create.insertedId;
    delete game._id;

    return { game, playerEvent: null, computerEvents: [] };
  }

  async function getGame(id) {
    const game = await gameRepo.findOne({ _id: new ObjectId(id) });

    if (!game) {
      throw new errMessage("Game Not Found", 404);
    }
    return game;
  }

  async function reinforce(territoryId, playerId) {
    const parsed = schemaReinforce.safeParse(territoryId);
    if (!parsed.success) {
      throw new errMessage(parsed.error.issues, 400);
    }

    const player = await getGame(playerId);

    if (player.phase !== "reinforce") {
      throw new errMessage("Phase must be 'reinforce'", 422);
    }

    territoryId = parsed.data.territoryId;

    reinforcement(territoryId, player);

    await gameRepo.update(playerId, player);
    return {
      player,
      playerEvent: `Add three soldiers to ${territoryId}`,
      computerEvents: [],
    };
  }

  return { createNewGame, getGame, reinforce };
}
