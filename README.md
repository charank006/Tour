# PlanYours — Artisanal Travel Itinerary Engine

A resilient, magazine-aesthetic full-stack travel planner designed for slow wanderers, cultural explorers, and thoughtful travelers.

Built with **Express + Mongoose** on the backend and **React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui + framer-motion** on the frontend.

---

## Core Guarantees & Philosophy

1. **Zero-Crash Resilience**: Every screen has a working path even when external APIs, keys, MongoDB, or network fail.
   - **Geocoding**: Nominatim $\rightarrow$ Local Indian Gazetteer (`data/cities.json`, ~50 cities).
   - **Places**: OpenTripMap $\rightarrow$ Geoapify $\rightarrow$ Curated Seed Dataset (`data/places.seed.json`).
   - **Weather**: OpenWeatherMap $\rightarrow$ 12-Month Climatology Table (`data/climate.json`).
   - **Routing**: OpenRouteService $\rightarrow$ Haversine distance $\times 1.3$ road factor with modal speeds (car, train, flight, bus).
   - **Persistence**: MongoDB $\rightarrow$ Local JSON store (`data/store.json`). Saving and listing trips never fails.
   - **Offline-First Frontend**: If the backend is unreachable, the client runs the mirror rule engine on `staticDiscoveryData.ts` and delivers a complete, structured itinerary with an honest `"Offline Curated"` badge.
2. **Art Direction & Design System**:
   - Palette: Paper `#FAF7F2`, Deep Ink `#131D28`, Terracotta `#C4512C` (WCAG AA 4.63:1 contrast with white text), Saffron `#B45309`, Sky `#2F6F8F`, Sage `#355E53`.
   - Typography: Fraunces (display serif), Plus Jakarta Sans (UI body), Caveat (handwritten accents). Self-hosted font packages.
   - Tactile Details: Fixed paper-grain overlay (`pointer-events: none`), wax-seal match badges, ticket-stub perforated borders, polaroid reviews, and animated journey routes.
3. **Clean Seams for Future AI**: Recommender interface allowing drop-in LLM or ML models without refactoring business logic.

---

## Quickstart

### Prerequisites
- Node.js `v18+` (Tested on `v20.20.2`)
- npm `v9+`

### 1. Backend Setup
```bash
cd backend
npm install

# (Optional) Seed sample trips and reviews to data/store.json
npm run seed

# Run unit tests
npm test

# Start backend development server (Port 5001)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start frontend development server (Port 8080)
npm run dev
```

Visit **`http://localhost:8080`** in your browser.

---

## Environment Variables

All environment variables are **strictly optional**. The application operates fully offline with deterministic fallbacks when keys/db are absent.

Create `backend/.env` (see `backend/.env.example`):

| Variable | Description | Default | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend server port | `5001` | Runs on `5001` |
| `CLIENT_URL` | Allowed CORS origins | `http://localhost:8080,...` | Accepts local dev hosts |
| `RECOMMENDER` | Active recommender engine: `rule` \| `llm` \| `ml` | `rule` | Falls back to `rule` on failure/timeout |
| `MONGO_URI` | MongoDB connection URI | None | Uses `backend/data/store.json` |
| `JWT_SECRET` | Secret key for auth tokens | None | Injects guest user in dev |
| `OPENWEATHER_KEY` | OpenWeatherMap API key | None | Uses `backend/data/climate.json` |
| `OPENROUTE_KEY` | OpenRouteService API key | None | Uses Haversine distance $\times 1.3$ |
| `OPENTRIPMAP_KEY` | OpenTripMap API key | None | Falls back to Geoapify $\rightarrow$ seed dataset |
| `GEOAPIFY_KEY` | Geoapify Places API key | None | Falls back to `backend/data/places.seed.json` |
| `FOURSQUARE_API_KEY` | Foursquare v3 API key | None | Uses curated culinary/culture fallbacks |

---

## How to Plug in an LLM or ML Recommender

The provider interface seam is located in `backend/providers/`:

```
backend/providers/
├── recommender.interface.js   # Base contract
├── recommender.service.js     # Factory & fallback orchestration
├── rule.provider.js           # Deterministic rule engine (Default)
├── llm.provider.js            # LLM provider stub (OpenAI / Anthropic / vLLM)
└── ml.provider.js             # ML provider stub (Vector search / Embeddings)
```

### Provider Contract (`recommender.interface.js`)

Any new provider must extend `RecommenderProvider` and implement:
1. `rankDestinations(destinations, prefs)`:
   - **Input**: `destinations` array, `prefs` object (`mood`, `budget`, `travelers`).
   - **Output**: Array of destinations with `{ ...dest, match: number (0-100), reasons: string[] }`.
2. `scorePlaces(places, prefs, ctx)`:
   - **Input**: `places` array, `prefs` (`mood`, `budget`, `pace`), `ctx` (`weather`, `timeOfDay`).
   - **Output**: Array of places sorted descending by `score` with `{ ...place, score: number, matchPercent: number, reasons: string[] }`.
3. `explain(item)`:
   - **Input**: Trip plan or place object.
   - **Output**: Human-readable editorial sentence explaining the match.

### Activating an LLM Model
1. Edit `backend/providers/llm.provider.js` to call your LLM endpoint (e.g. OpenAI GPT-4o, Claude 3.5, Gemini, or local vLLM).
2. Set `RECOMMENDER=llm` in `backend/.env`.
3. **Safety Guarantee**: `recommender.service.js` enforces a 5-second execution timeout. If your LLM endpoint times out, encounters a rate limit (429), or throws an error, the system **automatically falls back to `rule.provider.js`**, ensuring users always receive their itinerary seamlessly.

---

## Running Quality Gates & Tests

### Backend Unit Tests (Vitest)
```bash
cd backend
npm test
```
Tests cover:
- Rain impact: Penalizes outdoor activities, promotes indoor venues.
- Heat impact: Warns against outdoor spots in $>35^\circ\text{C}$ afternoon sun.
- Over-budget guard: Penalizes spots exceeding daily budget allowance.
- Closed venues: Flags places outside opening hours.
- Elder-friendly pacing: Demotes steep climbs, promotes level walking sanctuaries.
- Nearest-neighbour ordering: Optimizes transit distance.
- TTL cache normalization and circuit breaker state transitions.

### Frontend Production Build & Lint
```bash
cd frontend
npm run lint
npm run build
```
Builds cleanly with zero errors.
