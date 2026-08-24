import { loadJson } from "./data.js";
import path from "path";

const filePath = path.join(process.cwd(), "map.js");

async function getTerritories() {
  const territories = await loadJson(filePath);

  for (const territorie of territories) {
    territorie.soldiers = territorie.headquarters ? 8 : 4;
    territorie.owner = territorie.startOwner;
  }
  return territories;
}

export async function createGame(playerName) {
  const territories = await getTerritories();

  const player = {
    playerName,
    round: 1,
    phase: "reinforce",
    status: "playing",
    winner: null,
    territories: territories,
  };

  return player;
}

export function endPlayerRound(player) {
  if (player.phase === "end-turn" || player.phase === "move") {
    player.round++;
    player.phase = "reinforce";
  }
}

export function reinforcement(territorieId, game) {
  let player = { ...game };
  player = getPlayerTerritories(player, "player");

  const territorie = player.find((terr) => terr.id === territorieId);

  if (territorie) {
    territorie.soldiers += 3;
    game.phase = "attack";
  }
}

export function playerAttack(game, player, computer, source, destenation) {
  const sourceBelongPlayer = checkTerrtorie(source, player);
  const destBelongComputer = checkTerrtorie(destenation, computer);
  const sourceContainDest = checkNeighborsTerr(source.neighbors, destenation);

  if (sourceBelongPlayer && destBelongComputer && sourceContainDest) {
    game.phase = "move";
    return true;
  }
  return false;
}

function checkTerrtorie(territorie, player) {
  return player.some((terr) => terr.id === territorie.id);
}

export function checkNeighborsTerr(sourceTerr, destTerr) {
  return sourceTerr.some((n) => n === destTerr.id);
}

export function calculateFight(
  territoriesAttack,
  territoriesDefendes,
  numSoldiers,
) {
  const attackLuck = 0.6 + Math.random() * 0.4;
  const defenseLuck = 0.6 + Math.random() * 0.4;

  const attackPower = numSoldiers * attackLuck;
  const defensePower = territoriesDefendes.soldiers * defenseLuck;

  territoriesAttack.soldiers -= numSoldiers;

  if (attackPower > defensePower) {
    const survivors = Math.max(
      1,
      Math.ceil((numSoldiers * (attackPower - defensePower)) / attackPower),
    );

    territoriesDefendes.soldiers = survivors;
    territoriesDefendes.owner = "player";
  } else {
    const survivors = Math.max(
      1,
      Math.ceil(
        (territoriesDefendes * (defensePower - attackPower)) / defensePower,
      ),
    );

    territoriesDefendes.soldiers = territoriesDefendes.soldiers || survivors;
  }
  return {
    attack: territoriesAttack.soldiers,
    soldiers: territoriesDefendes,
  };
}

export function validSendSoldiers(soldiers, send) {
  return soldiers - send >= 1 && send >= 1;
}

export function getPlayerTerritories(game, owner) {
  return game.territories.filter((terr) => terr.owner === owner);
}
