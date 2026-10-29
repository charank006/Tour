# Changelog — PlanYours

All notable improvements, architecture additions, bug fixes, and art direction upgrades across the project.

---

## [Phase 1: Bulletproof Backend]

### Added
- **Resilience Layer (`backend/utils/http.js`)**:
  - Centralized Axios client factory with 6s default timeout.
  - Automatic 2-attempt retry with exponential backoff on `429`, `5xx`, and network drops.
  - In-memory circuit breaker per provider (opens after 5 failures, half-open probe after 60s).
- **Normalized TTL Cache (`backend/utils/cache.js`)**:
  - In-memory cache with normalized keys (lowercase, trimmed).
  - Domain-specific TTLs: Geocoding (24h), Places (6h), Weather (30m), Routes (24h).
  - Background expiration timer and cache telemetry stats.
- **Local Fallback Gazetteers & Curated Datasets (`backend/data/`)**:
  - `data/cities.json`: 50 popular Indian destinations with coordinates, states, and categories.
  - `data/places.seed.json`: Curated places per destination with categories, opening hours, costs, and indoor/outdoor flags.
  - `data/climate.json`: 12-month temperature, rain likelihood, and seasonal descriptions for Indian cities.
  - `data/store.json`: Local JSON persistence store for trips and reviews.
- **Service Fallback Chains**:
  - Geocoding: Nominatim $\rightarrow$ `data/cities.json` $\rightarrow$ center of India default.
  - Places: OpenTripMap $\rightarrow$ Geoapify $\rightarrow$ `data/places.seed.json` $\rightarrow$ curated fallback list.
  - Weather: OpenWeatherMap $\rightarrow$ `data/climate.json` (flagged `source: "estimated"`).
  - Routing: OpenRouteService $\rightarrow$ Haversine distance $\times 1.3$ road factor with per-mode speeds.
  - All responses carry `meta: { source, degraded: boolean }`.
- **Pluggable AI / Recommender Provider Seam (`backend/providers/`)**:
  - `RecommenderProvider` base interface.
  - `RuleRecommenderProvider` default scoring engine.
  - `LlmRecommenderProvider` and `MlRecommenderProvider` stubs ready for future model serving.
  - `RecommenderService` factory reading `RECOMMENDER=rule|llm|ml` with 5s timeout guard and guaranteed fallback to `rule`.
- **Rule Engine (`backend/logic/recommend.logic.js`)**:
  - Formula: $\text{interest}\times 3 + \text{budgetFit}\times 2 + \text{seasonFit}\times 2 + \text{weatherFit}\times 2 + \text{crowd}\times 1.5 + \text{popularity}\times 0.5 - \text{distancePenalty} - \text{overBudgetPenalty}$.
  - Respects `pace.logic`, venue opening hours (`isPlaceOpen`), daily budget ceiling, and traveling nearest-neighbour ordering.
- **Persistence & API Hygiene**:
  - Full Trip CRUD + public share link (`/api/trip/share/:shareId`).
  - Full Review create & list API (`/api/reviews`).
  - Graceful fallback to `data/store.json` when MongoDB is disconnected or offline.
  - Health check endpoint `GET /api/health` reporting database, cache, recommender, and circuit breaker health.
  - `helmet`, `express-rate-limit` (500 req/15m), and `x-request-id` logging.
  - `.env.example` and seed script `npm run seed`.
  - Vitest test suite (`backend/tests/recommend.test.js`) with 8 unit tests covering rain, heat, over-budget, closed places, elders, nearest-neighbour, cache, and circuit breaker.

### Fixed
- Fixed unexported `categorizePlace` in `scheduler.logic.js` which caused `TypeError: scheduler.categorizePlace is not a function`.
- Fixed `costService.estimateTripCost` call in `trip.controller.js` (added missing `await` and reconciled argument signature).
- Zero-padded `addMinutes` in `backend/utils/time.utils.js` (`09:05` instead of `9:5`).
- Removed `openai` dependency and deleted obsolete monolithic `backend/services/ai.service.js`.
- Connected MongoDB gracefully in `backend/server.js` (non-crashing offline mode).
- NaN-proofed numeric calculations across all services.

---

## [Phase 2: Frontend Reliability]

### Added
- **Wizard State Persistence Across Reloads (`frontend/src/lib/tripStore.ts`)**:
  - `tripStore` backed by `sessionStorage` with custom event synchronization.
  - Refreshing `/suggestions` or `/trip-plan` restores input dates, budget tier, traveler count, selected destination, and generated plan without premature redirects.
- **Deep-Linkable Journeys (`frontend/src/App.tsx`, `TripPlan.tsx`)**:
  - Added `/trip/:id` and `/trip/share/:shareId` routes.
  - Removed `/test-logic` route and deleted `TestLogic.tsx`.
- **Typed API Client (`frontend/src/api/api.ts`)**:
  - Configured with `VITE_API_URL`, 8s timeout, `AbortController`, and strict TypeScript interfaces for trips, reviews, and health checks.
- **Offline-First Itinerary Generation (`frontend/src/lib/offlinePlanner.ts`)**:
  - Client-side mirror of the weighted scoring rule engine operating on `staticDiscoveryData.ts`.
  - Guarantees that users always get a complete, structured itinerary even if the backend is down.
  - Displays honest `"Offline Curated"` badge in UI.
- **Multi-Level Error Boundaries**:
  - Route-level `ErrorBoundary` with Lost Compass illustration and friendly "Resume Journey" action.
  - `SectionErrorBoundary` wrapping individual modules so broken components never blank the page.
- **Guaranteed Safe Formatting Helpers (`frontend/src/lib/formatters.ts`)**:
  - `formatINR`, `calculateDays`, `formatDuration`, `formatDateRange`, `formatDistance` with zero `NaN` or `undefined` outputs.
- **Completed Unfinished Pages**:
  - `MyTrips.tsx`: Perforated ticket-stub cards, server synchronization, real deletion, public link sharing, and empty state.
  - `Reviews.tsx`: Connected to `reviewsApi`, added "Verified Traveler" trust badge, and interactive review submission form.
  - Enhanced `ImageWithFallback.tsx` with warm tinted gradients and pulsing compass placeholder.

---

## [Phase 3 & 4: Visual Direction & Motion Delight]

### Added
- Self-hosted font packages: `@fontsource-variable/fraunces`, `@fontsource-variable/plus-jakarta-sans`, `@fontsource/caveat`.
- Paper-grain texture overlay on `body::before` with `pointer-events: none`.
- WCAG AA compliant palette: Terracotta `#C4512C`, Saffron `#B45309`, Sky `#2F6F8F`, Paper `#FAF7F2`, Ink `#131D28`.
- Hero word-by-word reveal, 3D postcard mouse tilt, and drifting clouds.
- Interactive Cobe 3D Globe with rotation and location markers.
- Animated journey route line in `HowItWorks.tsx` driven by scroll (`pathLength`).
- Upgraded `PlanningAnimation.tsx` with folded map illustration and real-step rotating microcopy.
- Scroll progress indicator bar in `Navbar.tsx`.
- Paper-fleck confetti animation upon saving trips.
