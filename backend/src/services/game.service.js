import { ObjectId } from "mongodb";
import {
  schemaAttack,
  schemaMove,
  schemaNewGame,
  schemaReinforce,
} from "../modules/game.js";
import {
  calculateFight,
  createGame,
  endPlayerRound,
  getPlayerTerritories,
  playerAttack,
  reinforcement,
  validSendSoldiers,
} from "../utils/helper.js";
import { attackComputer, reinforceComputer } from "./computer.service.js";

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

    let game = await createGame(parsed.data.playerName);
    const create = await gameRepo.create(game);

    game = { id: create.insertedId, ...game };
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

  async function reinforce(territoryId, gameId) {
    const parsed = schemaReinforce.safeParse(territoryId);
    if (!parsed.success) {
      throw new errMessage(parsed.error.issues, 400);
    }

    const game = await getGame(gameId);
    if (game.phase !== "reinforce") {
      throw new errMessage("Phase must be 'reinforce'", 422);
    }

    territoryId = parsed.data.territoryId;

    reinforcement(territoryId, game);

    await gameRepo.update(gameId, game);
    return {
      game,
      playerEvent: `Add three soldiers to ${territoryId}`,
      computerEvents: [],
    };
  }

  async function attack(gameId, data) {
    const parsedAttack = schemaAttack.optional().safeParse(data);

    if (!parsedAttack.success) {
      throw new errMessage(parsedAttack.error.issues, 400);
    }

    const game = await getGame(gameId);

    if (game.phase !== "attack") {
      throw new errMessage("Phase must be 'attack'", 422);
    }

    const { fromId, toId, soldiers, skip } = parsedAttack.data;

    if (skip === true) {
      game.phase = "move";
      return { game, playerEvent: null, computerEvents: [] };
    }

    if (skip === false && fromId === null) {
      throw new errMessage("You have to skip or to attack", 400);
    }

    const player = getPlayerTerritories(game, "player");
    const computer = getPlayerTerritories(game, "computer");
    const source = player.find((terr) => terr.id === parsedAttack.data.fromId);
    const destenation = computer.find(
      (terr) => terr.id === parsedAttack.data.toId,
    );

    if (playerAttack(game, player, computer, source, destenation)) {
      if (!validSendSoldiers(source.soldiers, parsedAttack.data.soldiers))
        throw new errMessage("soldiers not valid", 422);

      const att = calculateFight(
        source,
        destenation,
        parsedAttack.data.soldiers,
      );

      console.log(att.soldiers);

      if (att.soldiers.owner === "player") {
        if (att.soldiers.headquarters === true) {
          game.status = "finished";
          game.winner = "player";
        } else {
          game.phase = "move";
        }
      }
    }

    await gameRepo.update(gameId, game);
    return {
      game,
      playerEvent: `Attack from ${parsedAttack.data.fromId} to ${parsedAttack.data.toId} with ${parsedAttack.data.soldiers} soldiers`,
      computerEvents: [],
    };
  }

  async function move(gameId, data) {
    const parsed = schemaMove.safeParse(data);

    if (!parsed.success) {
      throw new errMessage(parsed.error.issues, 400);
    }

    const game = await getGame(gameId);

    if (game.phase !== "move") return;

    const player = getPlayerTerritories(game, "player");
    const source = player.find((terr) => terr.id === parsed.data.fromId);
    const dest = player.find((terr) => terr.id === parsed.data.toId);

    if (source && dest) {
      if (!validSendSoldiers(source.soldiers, parsed.data.soldiers))
        throw new errMessage("Sent soldiers is not valid", 422);

      const computer = getPlayerTerritories(game, "computer");
      reinforceComputer(player);
      const attacking = attackComputer(game, computer, player);
      await update(gameId, attacking);
      return { game, playerEvent: source, computerEvents: attacking };
    }
  }

  async function endTurn(gameId) {
    const game = await getGame(gameId);

    if (game.phase === "move") {
      if (game.status !== "finished") {
        endPlayerRound(game);
      }
      const computer = getPlayerTerritories(game, "computer");
      const player = getPlayerTerritories(game, "player");
      reinforceComputer(player);
      const attacking = attackComputer(game, computer, player);
      await update(gameId, attacking);
      return { game, playerEvent: null, computerEvents: attacking };
    }
  }
  return { createNewGame, getGame, reinforce, attack, endTurn };
}
