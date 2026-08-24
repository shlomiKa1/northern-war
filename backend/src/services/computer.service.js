import { checkNeighborsTerr, getPlayerTerritories } from "../utils/helper.js";

export function reinforceComputer(player, computer) {
  const minDistanceComputer = Math.min(
    ...player.map((terr) => terr.distanceFromComputerHQ),
  );

  let territorie = null;
  if (minDistanceComputer <= 2) {
    territorie = lowDistance(player, minDistanceComputer);
  } else {
    territorie = highDistance(player, minDistanceComputer);
  }
  territorie.soldiers += 3;
}

function lowDistance(player, minDistanceComputer) {
  const minComputerDistances = player
    .map((terr) => terr.distanceFromComputerHQ)
    .filter((terr) => terr === minDistanceComputer);
  if (minComputerDistances.length === 1) return minComputerDistances[0];

  if (minComputerDistances.length > 1) {
    const minSoldiers = Math.min(...player.map((terr) => terr.soldiers));
    const minsOfSoldiers = player
      .map((terr) => terr.distanceFromComputerHQ)
      .filter((terr) => terr === minSoldiers);

    if (minsOfSoldiers.length === 1) return minsOfSoldiers[0];

    if (minsOfSoldiers.length > 1) {
      const minId = Math.min(...player.map((terr) => terr.id));
      return player.find((terr) => terr.id === minId);
    }
  }
}

function highDistance(player, minDistanceComputer) {
  const minPlayerDistances = player
    .map((terr) => terr.distanceFromPlayerHQ)
    .filter((terr) => terr === minDistanceComputer);
  if (minPlayerDistances.length === 1) return minPlayerDistances[0];

  if (minPlayerDistances.length > 1) {
    const maxSoldiers = Math.max(...player.map((terr) => terr.soldiers));
    const maxsOfSoldiers = player
      .map((terr) => terr.distanceFromPlayerHQ)
      .filter((terr) => terr === maxsOfSoldiers);

    if (maxsOfSoldiers.length === 1) return maxsOfSoldiers[0];

    if (maxsOfSoldiers.length > 1) {
      const minId = Math.min(...player.map((terr) => terr.id));
      return player.find((terr) => terr.id === minId);
    }
  }
}

export function attackComputer(game) {
  const playerTerritories = getPlayerTerritories(game, "player");
  const computerTerritories = getPlayerTerritories(game, "computer");

  const attacingScoure = [];
  for (const computerTerr of computerTerritories) {
    for (const playerTerr of playerTerritories) {
      attacingScoure.push({
        fromId: computerTerr.id,
        toId: playerTerr.id,
        scoure: attackAlgorithm(computerTerr, playerTerr),
      });
    }
  }

  const maxScoure = Math.max(...attacingScoure.map((attack) => attack.scoure));
  const doplicateMaxScoure = attacingScoure.filter(
    (attack) => attack.scoure === maxScoure,
  );

  if (doplicateMaxScoure.length === 1) return doplicateMaxScoure[0];

  if (doplicateMaxScoure.length > 1) {
    const minFromId = Math.min(
      ...doplicateMaxScoure.map((attack) => attack.fromId),
    );
    const minToId = Math.min(
      ...doplicateMaxScoure
        .filter((attack) => attack.fromId === minFromId)
        .map((attack) => attack.toId),
    );

    return {};
  }
}

function progress(fromComputer, toPlayer) {
  return fromComputer.distanceFromPlayerHQ - toPlayer.distanceFromPlayerHQ;
}

function soldierAdvantage(sentSoldiers, toPlayer) {
  return sentSoldiers - toPlayer.soldiers;
}

function attackAlgorithm(fromComputer, toPlayer) {
  const sentSoldiers = fromComputer.soldiers - 1;
  const advantageRatio = sentSoldiers / toPlayer.soldiers;

  if (toPlayer.headquarters === true) {
    if (sentSoldiers > toPlayer.soldiers) {
      fromComputer.soldiers - sentSoldiers;
    }
  } else {
    if (advantageRatio >= 1.35) {
      fromComputer.soldiers - sentSoldiers;
    } else {
      return 0;
    }
  }

  let source = 0;
  if (fromComputer.headquarters && checkNeighborsTerr(fromComputer, toPlayer)) {
    source += Math.max(0, 3 - toPlayer.distanceFromComputerHQ) * 25;
  }

  if (progress(fromComputer, toPlayer) === 1) {
    source += progress(fromComputer, toPlayer) * 10;
  }

  const headquartersScore = toPlayer.headquarters ? 1000 : 0;

  source +=
    soldierAdvantage +
    headquartersScore +
    soldierAdvantage(sentSoldiers, toPlayer);
  return source;
}
