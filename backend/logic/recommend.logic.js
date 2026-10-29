/**
 * Deterministic Recommendation Engine
 * Weights:
 * interest*3 + budgetFit*2 + seasonFit*2 + weatherFit*2 + crowd*1.5 + popularity*0.5
 * - distancePenalty - overBudgetPenalty
 */

const WEIGHTS = {
  interest: 3.0,
  budgetFit: 2.0,
  seasonFit: 2.0,
  weatherFit: 2.0,
  crowd: 1.5,
  popularity: 0.5,
  distancePenalty: 1.0,
  overBudgetPenalty: 3.0
};

const MAX_POSSIBLE_SCORE =
  10 * WEIGHTS.interest +
  10 * WEIGHTS.budgetFit +
  10 * WEIGHTS.seasonFit +
  10 * WEIGHTS.weatherFit +
  10 * WEIGHTS.crowd +
  10 * WEIGHTS.popularity; // 110.0

function haversine(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseHourToMinutes(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function isPlaceOpen(openHoursStr, visitTimeStr = '11:00') {
  if (!openHoursStr || !openHoursStr.includes('-')) return true; // Default open
  try {
    const [openPart, closePart] = openHoursStr.split('-').map(s => s.trim());
    const openMins = parseHourToMinutes(openPart);
    const closeMins = parseHourToMinutes(closePart);
    const visitMins = parseHourToMinutes(visitTimeStr);

    if (openMins === null || closeMins === null || visitMins === null) return true;
    return visitMins >= openMins && visitMins <= closeMins;
  } catch {
    return true;
  }
}

/**
 * Score a single place against preferences and context
 */
function scorePlace(place = {}, prefs = {}, ctx = {}) {
  const reasons = [];

  // 1. Interest Fit (0 - 10)
  const category = (place.category || '').toLowerCase();
  const name = (place.name || '').toLowerCase();
  const mood = (prefs.mood || '').toLowerCase();
  const interests = Array.isArray(prefs.interests) ? prefs.interests.map(i => i.toLowerCase()) : [];

  let interestScore = 6.0; // Baseline
  let matchedInterest = false;

  const moodKeywords = {
    mountains: ['mountain', 'hike', 'trail', 'viewpoint', 'valley', 'nature', 'pass'],
    beach: ['beach', 'coastal', 'sea', 'lagoon', 'waterfall', 'flea', 'cruise'],
    heritage: ['palace', 'fort', 'heritage', 'monument', 'museum', 'temple', 'unesco'],
    nature: ['wildlife', 'garden', 'backwater', 'park', 'forest', 'meadow'],
    chill: ['cafe', 'promenade', 'walk', 'orchard', 'lake', 'tea'],
    adventure: ['trek', 'rafting', 'safari', 'waterfall', 'climb']
  };

  const targetKeywords = [...interests, ...(moodKeywords[mood] || [])];
  for (const kw of targetKeywords) {
    if (category.includes(kw) || name.includes(kw)) {
      interestScore = 9.5;
      matchedInterest = true;
      reasons.push(`Matches your interest in ${kw}`);
      break;
    }
  }

  if (!matchedInterest) {
    if (category.includes('unesco') || category.includes('heritage')) {
      interestScore = 8.0;
      reasons.push('Renowned cultural highlight');
    }
  }

  // 2. Budget Fit (0 - 10) & Over-Budget Penalty
  const cost = Number(place.cost) || 0;
  const dailyBudget = Number(prefs.dailyBudget) || (Number(prefs.budget) ? Number(prefs.budget) / 3 : 5000);
  const currentCost = Number(ctx.currentCostSoFar) || 0;

  let budgetFit = 8.0;
  let overBudgetPenalty = 0;

  if (cost === 0) {
    budgetFit = 10.0;
    reasons.push('Free public access highlight');
  } else if (cost <= dailyBudget * 0.15) {
    budgetFit = 9.0;
  } else if (cost <= dailyBudget * 0.35) {
    budgetFit = 7.0;
  } else {
    budgetFit = 4.0;
  }

  if (currentCost + cost > dailyBudget && cost > 0) {
    overBudgetPenalty = 15.0; // Significant penalty
    reasons.push(`Exceeds daily budget allowance (₹${cost} vs ₹${Math.round(dailyBudget - currentCost)} remaining)`);
  }

  // 3. Season Fit (0 - 10)
  const seasonFit = ctx.seasonFit ? Math.min(10, Math.max(0, Number(ctx.seasonFit))) : 8.5;

  // 4. Weather Fit (0 - 10)
  const weather = ctx.weather || {};
  let weatherFit = 8.5;

  if (weather.rain && !place.isIndoor && place.weatherSensitivity === 'high') {
    weatherFit = 1.0;
    reasons.push('Heavy rain impact: outdoor activity not recommended');
  } else if (weather.temp > 35 && !place.isIndoor && (ctx.timeOfDay || '').toLowerCase().includes('afternoon')) {
    weatherFit = 2.0;
    reasons.push('High afternoon heat warning (>35°C)');
  } else if (weather.rain && place.isIndoor) {
    weatherFit = 10.0;
    reasons.push('Weather-shielded indoor venue during rain');
  }

  // 5. Crowd & Group Suitability (0 - 10)
  let crowdScore = 8.0;
  const travelers = String(prefs.travelers || '').toLowerCase();
  const isElders = travelers === 'elders' || travelers.includes('elder') || travelers.includes('senior');

  if (isElders) {
    if (category.includes('trek') || category.includes('hike') || category.includes('climb')) {
      crowdScore = 2.0;
      reasons.push('Steep climb; strenuous for seniors');
    } else if (category.includes('temple') || category.includes('garden') || category.includes('museum')) {
      crowdScore = 9.5;
      reasons.push('Senior-friendly: level walking and comfortable seating');
    }
  }

  // 6. Popularity (0 - 10)
  const rawRating = Number(place.rating) || 8.0;
  const popularity = Math.min(10, Math.max(0, rawRating));

  // 7. Opening Hours Check
  if (place.openHours && ctx.timeOfDay) {
    const open = isPlaceOpen(place.openHours, ctx.timeOfDay);
    if (!open) {
      overBudgetPenalty += 20.0; // Treat closed venues with severe penalty
      reasons.push(`Venue closed during planned slot (${place.openHours})`);
    }
  }

  // 8. Distance Penalty
  let distancePenalty = 0;
  if (ctx.prevLocation && place.coordinates && ctx.prevLocation.lat && place.coordinates.lat) {
    const distKm = haversine(
      ctx.prevLocation.lat,
      ctx.prevLocation.lon,
      place.coordinates.lat,
      place.coordinates.lon
    );
    if (distKm > 15) {
      distancePenalty = Math.min(20, (distKm - 15) * 0.8);
      reasons.push(`Transit distance from previous spot: ${distKm.toFixed(1)} km`);
    }
  }

  // Final Weighted Formula
  const rawScore =
    interestScore * WEIGHTS.interest +
    budgetFit * WEIGHTS.budgetFit +
    seasonFit * WEIGHTS.seasonFit +
    weatherFit * WEIGHTS.weatherFit +
    crowdScore * WEIGHTS.crowd +
    popularity * WEIGHTS.popularity -
    distancePenalty * WEIGHTS.distancePenalty -
    overBudgetPenalty * WEIGHTS.overBudgetPenalty;

  const score = Math.max(0, Math.round(rawScore * 10) / 10);
  const matchPercent = Math.max(5, Math.min(99, Math.round((rawScore / MAX_POSSIBLE_SCORE) * 100)));

  return {
    score,
    matchPercent,
    reasons: reasons.slice(0, 3)
  };
}

/**
 * Nearest-neighbour route ordering to minimize transit fatigue
 */
function orderPlacesNearestNeighbour(places = [], startCoords = null) {
  if (!places || places.length <= 1) return places;

  const unvisited = [...places];
  const ordered = [];
  let currentPoint = startCoords || (unvisited[0].coordinates ? unvisited[0].coordinates : null);

  while (unvisited.length > 0) {
    if (!currentPoint || !currentPoint.lat) {
      ordered.push(unvisited.shift());
      continue;
    }

    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const p = unvisited[i];
      const coords = p.coordinates;
      if (!coords || !coords.lat) {
        nearestIdx = i;
        break;
      }
      const dist = haversine(currentPoint.lat, currentPoint.lon, coords.lat, coords.lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    const nextPlace = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(nextPlace);
    if (nextPlace.coordinates && nextPlace.coordinates.lat) {
      currentPoint = nextPlace.coordinates;
    }
  }

  return ordered;
}

/**
 * Rank a list of destinations based on user preferences
 */
function rankDestinations(destinations = [], prefs = {}) {
  const scored = destinations.map(dest => {
    let match = 85;
    const reasons = [];

    // Mood match
    if (prefs.mood && dest.mood && dest.mood.toLowerCase() === prefs.mood.toLowerCase()) {
      match += 8;
      reasons.push(`Matches your ${prefs.mood} mood`);
    }

    // Budget match
    if (prefs.budget && dest.budgetRange) {
      const budgetNum = Number(prefs.budget);
      if (budgetNum >= dest.budgetRange.min && budgetNum <= dest.budgetRange.max) {
        match += 5;
        reasons.push('Comfortably within your target budget');
      }
    }

    return {
      ...dest,
      match: Math.min(98, Math.max(70, match)),
      reasons: reasons.length > 0 ? reasons : ['Curated destination highlight']
    };
  });

  return scored.sort((a, b) => b.match - a.match);
}

module.exports = {
  WEIGHTS,
  scorePlace,
  orderPlacesNearestNeighbour,
  rankDestinations,
  haversine,
  isPlaceOpen
};
