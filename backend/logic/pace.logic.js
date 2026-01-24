exports.apply = (pace, travelers) => {
  let maxSpots = 5;

  if (pace === 'relaxed') maxSpots = 3;
  if (pace === 'packed') maxSpots = 7;

  if (travelers === 'family') maxSpots -= 1;
  if (travelers === 'elders') maxSpots -= 2;

  return { maxSpotsPerDay: maxSpots };
};
