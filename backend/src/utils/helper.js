import { loadJson } from "./data.js";
import path from "path";

const filePath = path.join(process.cwd(), "../../", "map.js");
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
