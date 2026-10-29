import { describe, it, expect } from 'vitest';
const { scorePlace, orderPlacesNearestNeighbour, isPlaceOpen } = require('../logic/recommend.logic');
const cache = require('../utils/cache');
const http = require('../utils/http');

describe('Recommendation Engine Rule Logic', () => {
  const basePlace = {
    name: 'Amber Fort',
    category: 'Historic Palace',
    rating: 9.0,
    cost: 500,
    openHours: '09:00 - 18:00',
    isIndoor: false,
    weatherSensitivity: 'high',
    coordinates: { lat: 26.9855, lon: 75.8513 }
  };

  const indoorMuseum = {
    name: 'Albert Hall Museum',
    category: 'Museum & Heritage',
    rating: 8.8,
    cost: 300,
    openHours: '09:00 - 17:00',
    isIndoor: true,
    weatherSensitivity: 'low',
    coordinates: { lat: 26.9116, lon: 75.8195 }
  };

  const steepTrek = {
    name: 'Nahargarh Trek Path',
    category: 'Steep Mountain Trek',
    rating: 8.9,
    cost: 0,
    openHours: '06:00 - 18:00',
    isIndoor: false,
    weatherSensitivity: 'high',
    coordinates: { lat: 26.9388, lon: 75.8155 }
  };

  it('1. Rain test: penalizes outdoor venues and rewards indoor venues during rain', () => {
    const rainCtx = {
      weather: { temp: 24, rain: true, description: 'Heavy monsoon downpour' },
      timeOfDay: '11:00'
    };

    const outdoorScore = scorePlace(basePlace, { mood: 'heritage' }, rainCtx);
    const indoorScore = scorePlace(indoorMuseum, { mood: 'heritage' }, rainCtx);

    expect(outdoorScore.reasons.some(r => r.toLowerCase().includes('rain'))).toBe(true);
    expect(indoorScore.reasons.some(r => r.toLowerCase().includes('indoor') || r.toLowerCase().includes('weather'))).toBe(true);
    expect(indoorScore.score).toBeGreaterThan(outdoorScore.score);
  });

  it('2. Heat test: penalizes outdoor activities in extreme heat (>35°C) during afternoon', () => {
    const heatCtx = {
      weather: { temp: 38, rain: false, description: 'Extreme heat' },
      timeOfDay: '14:30 Afternoon'
    };

    const res = scorePlace(basePlace, { mood: 'heritage' }, heatCtx);
    expect(res.reasons.some(r => r.toLowerCase().includes('heat'))).toBe(true);
  });

  it('3. Over-budget test: detects when venue exceeds daily budget guard', () => {
    const expensivePlace = {
      ...basePlace,
      name: 'Luxury Royal Helicopter Tour',
      cost: 15000
    };

    const prefs = {
      budget: 20000,
      dailyBudget: 4000
    };

    const ctx = {
      currentCostSoFar: 2000,
      weather: { temp: 25, rain: false }
    };

    const res = scorePlace(expensivePlace, prefs, ctx);
    expect(res.reasons.some(r => r.toLowerCase().includes('budget'))).toBe(true);
    expect(res.score).toBeLessThan(40);
  });

  it('4. Closed place test: flags venue when planned visit time falls outside opening hours', () => {
    // Venue open 09:00 - 18:00, visiting at 21:00
    const ctx = {
      weather: { temp: 22, rain: false },
      timeOfDay: '21:00'
    };

    const res = scorePlace(basePlace, { mood: 'heritage' }, ctx);
    expect(isPlaceOpen(basePlace.openHours, '21:00')).toBe(false);
    expect(isPlaceOpen(basePlace.openHours, '11:00')).toBe(true);
    expect(res.reasons.some(r => r.toLowerCase().includes('closed'))).toBe(true);
  });

  it('5. Elders test: prioritizes calm accessible places over steep physical treks', () => {
    const elderPrefs = {
      travelers: 'elders',
      mood: 'heritage'
    };
    const ctx = { weather: { temp: 24, rain: false }, timeOfDay: '10:00' };

    const trekScore = scorePlace(steepTrek, elderPrefs, ctx);
    const museumScore = scorePlace(indoorMuseum, elderPrefs, ctx);

    expect(trekScore.reasons.some(r => r.toLowerCase().includes('strenuous') || r.toLowerCase().includes('seniors'))).toBe(true);
    expect(museumScore.reasons.some(r => r.toLowerCase().includes('senior-friendly'))).toBe(true);
    expect(museumScore.score).toBeGreaterThan(trekScore.score);
  });

  it('6. Nearest-neighbour ordering test: sorts places to minimize travel distances', () => {
    const places = [
      { name: 'A', coordinates: { lat: 26.90, lon: 75.80 } },
      { name: 'C (Far)', coordinates: { lat: 27.50, lon: 76.50 } },
      { name: 'B (Close to A)', coordinates: { lat: 26.91, lon: 75.81 } }
    ];

    const ordered = orderPlacesNearestNeighbour(places, { lat: 26.89, lon: 75.79 });
    expect(ordered[0].name).toBe('A');
    expect(ordered[1].name).toBe('B (Close to A)');
    expect(ordered[2].name).toBe('C (Far)');
  });
});

describe('Cache & Circuit Breaker Utilities', () => {
  it('Normalizes keys and caches values with TTL', () => {
    cache.set('test', ' Jaipur ', { weather: 'Sunny' }, 60);
    const retrieved = cache.get('test', 'jaipur');
    expect(retrieved).toEqual({ weather: 'Sunny' });
  });

  it('Circuit breaker tracks status and failure state', () => {
    const initialStatus = http.getCircuitStatus('custom-provider');
    expect(initialStatus.state).toBe('CLOSED');
  });
});
