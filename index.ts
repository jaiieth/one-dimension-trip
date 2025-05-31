const calEnergyToNearestStation = (target: number, stations: number[]) => {
  const minEnergy = stations.reduce(
    (min, station) => Math.min(min, Math.abs(target - station)),
    Infinity
  );

  return minEnergy;
};

const isAtStation = (position: number, stations: number[]) => {
  return stations.includes(position);
};

function minEnergy(
  start: number,
  shops: number[],
  stations: number[],
  target: number
) {
  shops.sort((a, b) => a - b);
  stations.sort((a, b) => a - b);

  let energy = 0;
  let current = start;
  shops.forEach((shop) => {
    // Already at a station
    if (isAtStation(current, stations)) {
      if (!isAtStation(shop, stations)) {
        // Walk from the station to the shop
        const energyToStation = calEnergyToNearestStation(shop, stations);
        energy += energyToStation;
      }
      current = shop;
      return;
    }

    // Walk to shop or walk to station
    const energyToStation = calEnergyToNearestStation(current, stations);
    const directWalkDiff = Math.abs(shop - current);
    if (isAtStation(shop, stations)) {
      if (directWalkDiff < energyToStation) {
        // Walk directly to the shop
        energy += directWalkDiff;
        current = shop;
        return;
      }
      // Walk to the station and then to the shop
      energy += energyToStation;
      current = shop;
      return;
    }

    if (directWalkDiff < energyToStation) {
      // Walk directly to the shop
      energy += directWalkDiff;
      current = shop;
      return;
    }

    const energyToShop = calEnergyToNearestStation(shop, stations);
    energy += energyToStation + energyToShop;
    current = shop;
    return;
  });

  if (
    current === target ||
    (isAtStation(target, stations) && isAtStation(current, stations))
  ) {
    return energy;
  }

  // target is at a station, walk to nearest station
  if (isAtStation(target, stations)) {
    const energyToStation = calEnergyToNearestStation(current, stations);
    energy += energyToStation;
    current = target;
  }

  // current is at a station, walk from target's nearest station to target
  if (isAtStation(current, stations)) {
    const energyToStation = calEnergyToNearestStation(target, stations);
    energy += energyToStation;
    current = target;
  }

  const directEnergyToTarget = Math.abs(target - current);
  const energyFromCurrentToStation = calEnergyToNearestStation(
    current,
    stations
  );
  const energyFromStationToTarget = calEnergyToNearestStation(target, stations);

  if (
    energyFromCurrentToStation + energyFromStationToTarget <
    directEnergyToTarget
  ) {
    energy += energyFromCurrentToStation + energyFromStationToTarget;
  } else {
    energy += directEnergyToTarget;
  }

  return energy;
}
