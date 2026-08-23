import { loadJson } from "./data.js";
import path from "path";

const filePath = path.join(process.cwd(), "", "map.js");
async function getTerritories() {
  const territories = await loadJson(filePath);

  for (const territorie of territories) {
    territorie.soldiers = territorie.headquarters ? 8 : 4;
    territorie.owner = territorie.startOwner;
  }
  return territories;
}

async function createGame(name) {
  const territories = await getTerritories();

  const player = {
    name,
    round: 1,
    phase: "reinforce",
    status: "playing",
    winner: null,
    territories: territories.filter((terr) => terr.owner === "player"),
  };

  return player;
}

console.log(await createGame("Momo"));

function endPlayerRound(player) {
  if (player.phase === "end-turn" || player.phase === "move") {
    player.round++;
    player.phase = "reinforce";
  }
}

export function reinforcement(territorie, player) {
  if (player.territories.include((terr) => terr.id === territorie.id)) {
    territorie.soldiers += 3;
    player.phase = "attack";
  }
}

export function playerAttack(
  player,
  computer,
  source,
  destenation,
  sentSoldiers,
) {
  const sourceBelongPlayer = checkTerrtorie(source, player);
  const destBelongComputer = checkTerrtorie(destenation, computer);
  const sourceContainDest = checkNeighborsTerr(source, destenation);

  if (sourceBelongPlayer && destBelongComputer && sourceContainDest) {
    const currentTerr = player.territories.find(
      (terr) => terr.id === source.id,
    );
    currentTerr.soldiers -= sentSoldiers;
    player.phase = "move";
  }
}

function checkTerrtorie(territorie, player) {
  return player.territories.some((terr) => terr.id === territorie.id);
}

function checkNeighborsTerr(sourceTerr, destTerr) {
  return sourceTerr.neighbors.some((terr) => terr.id === destTerr.id);
}
