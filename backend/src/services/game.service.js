import { schemaNewGame } from "../modules/game.js";
import { createGame } from "../utils/helper.js";

function errMessage(message, statusCode) {
  const objMessage = typeof message === "object" ? message.error : message;
  return { message, statusCode };
}

export default function createeGameService(gameRepo) {
    async function createNewGame(playerName) {
      const parsed = schemaNewGame.safeParse(playerName);

    if (!parsed.success ) {
      throw new errMessage(parsed.error.issues, 400 );
    }

    
    const game = await createGame(parsed.data);
    const create = await gameRepo.create(game);

    game.id = create.insertedId;

    return { game, playerEvent: null, computerEvents: [] };
  }

  return { createNewGame };
}
