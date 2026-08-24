export function reinforceComputer(player, computer) {
  const minDistanceComputer = Math.min(
    player.map((terr) => terr.distanceFromComputerHQ),
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
    const minSoldiers = Math.min(player.map((terr) => terr.soldiers));
    const minsOfSoldiers = player
      .map((terr) => terr.distanceFromComputerHQ)
      .filter((terr) => terr === minSoldiers);

    if (minsOfSoldiers.length === 1) return minsOfSoldiers[0];

    if (minsOfSoldiers.length > 1) {
      const minId = Math.min(player.map((terr) => terr.id));
      return player.find((terr) => terr.id === minId);
    }
  }
}

function highDistance(player, minDistanceComputer) {
  const minPlayerDistances = player
    .map((terr) => terr.distanceFromPlayerHQ)
    .filter((terr) => terr === minDistanceComputer);
  if (minPlayerDistances.length === 1) return minComputerDistances[0];

  if (minPlayerDistances.length > 1) {
    const maxSoldiers = Math.max(player.map((terr) => terr.soldiers));
    const maxsOfSoldiers = player
      .map((terr) => terr.distanceFromPlayerHQ)
      .filter((terr) => terr === maxsOfSoldiers);

    if (maxsOfSoldiers.length === 1) return maxsOfSoldiers[0];

    if (maxsOfSoldiers.length > 1) {
      const minId = Math.min(player.map((terr) => terr.id));
      return player.find((terr) => terr.id === minId);
    }
  }
}
