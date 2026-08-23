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

export function endPlayerRound(player) {
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

export function playerAttack(player, computer, source, destenation) {
  const sourceBelongPlayer = checkTerrtorie(source, player);
  const destBelongComputer = checkTerrtorie(destenation, computer);
  const sourceContainDest = checkNeighborsTerr(source, destenation);

  if (sourceBelongPlayer && destBelongComputer && sourceContainDest) {
    player.phase = "move";
  }
}

function checkTerrtorie(territorie, player) {
  return player.territories.some((terr) => terr.id === territorie.id);
}

function checkNeighborsTerr(sourceTerr, destTerr) {
  return sourceTerr.neighbors.some((terr) => terr.id === destTerr.id);
}

export function calculateFight(
  territoriesAttack,
  territoriesDefendes,
  numSoldiers,
) {
  const { sentSoldiers, defendingSoldiers } = calculatePowers(
    numSoldiers,
    territoriesDefendes.soldiers,
  );

  territoriesAttack.soldiers -= numSoldiers;

  if (attackPower > defensePower) {
    const survivors = Math.max(
      1,
      Math.ceil((sentSoldiers * (attackPower - defensePower)) / attackPower),
    );

    territoriesAttack.soldiers = survivors;
    territoriesAttack.owner =
      territoriesAttack.owner === "player" ? "computer" : "player";
  } else {
    territoriesDefendes.soldiers = Math.max(
      1,
      Math.ceil(
        (defendingSoldiers * (defensePower - attackPower)) / defensePower,
      ),
    );
  }
}

export function calculatePowers(sentSoldiers, defendingSoldiers) {
  const attackLuck = 0.6 + Math.random() * 0.4;
  const defenseLuck = 0.6 + Math.random() * 0.4;

  const attackPower = sentSoldiers * attackLuck;
  const defensePower = defendingSoldiers * defenseLuck;
  return { attackPower, defensePower };
}

function validSendSoldiers(soldiers, send) {
  return soldiers - send >= 1 && send >= 1 && Number.isInteger(send);
}
