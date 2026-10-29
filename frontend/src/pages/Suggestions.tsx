import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Thermometer,
  Wallet,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Heart,
  Sparkles,
  SlidersHorizontal,
  X,
  Users,
  Check,
} from 'lucide-react';
import { fetchDestinations, Destination } from '@/api/mockData';
import { tripStore } from '@/lib/tripStore';
import { motion, AnimatePresence } from 'framer-motion';

// Mock enhanced data for suggestions
const destinationMeta: Record<
  string,
  {
    match: number;
    crowd: 'Quiet' | 'Moderate' | 'Popular';
    whyThis: string;
    season: string;
    mood: string;
  }
> = {
  goa: {
    match: 96,
    crowd: 'Moderate',
    whyThis: 'Best beach shacks open without high-season surge pricing',
    season: 'Nov – Feb',
    mood: 'Coastal',
  },
  manali: {
    match: 98,
    crowd: 'Quiet',
    whyThis: 'Misty pine walks & fresh apple harvests; peaceful trails',
    season: 'Oct – May',
    mood: 'Mountains',
  },
  jaipur: {
    match: 94,
    crowd: 'Popular',
    whyThis: 'Cool royal palace courtyards and vibrant craft bazaars',
    season: 'Oct – Mar',
    mood: 'Heritage',
  },
  kerala: {
    match: 95,
    crowd: 'Quiet',
    whyThis: 'Post-monsoon lush hills and unhurried backwater canals',
    season: 'Sep – Mar',
    mood: 'Nature',
  },
};

export const Suggestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedCrowd, setSelectedCrowd] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'temp'>('match');

  // Wishlist heart animation state
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Compare drawer state (up to 3 destinations)
  const [compared, setCompared] = useState<Destination[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Restore from router state or tripStore (persists across page reloads!)
  const storedInputs = tripStore.getState().inputs;
  const tripData = location.state || storedInputs;

  useEffect(() => {
    // If incoming state existed, synchronize it to tripStore
    if (location.state) {
      tripStore.saveInputs(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    const loadDestinations = async () => {
      setLoading(true);
      try {
        const budgetRange = tripData?.budgetRange || { min: 15000, max: 30000 };
        const data = await fetchDestinations(budgetRange);
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, [tripData?.budgetRange]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCompare = (dest: Destination, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompared((prev) => {
      const exists = prev.some((d) => d.id === dest.id);
      if (exists) {
        return prev.filter((d) => d.id !== dest.id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], dest];
      }
      return [...prev, dest];
    });
    setDrawerOpen(true);
  };

  const handleSelectDestination = (destination: Destination) => {
    tripStore.saveDestination(destination);
    navigate('/trip-plan', {
      state: {
        ...tripData,
        destination,
      },
    });
  };

  // Filtered and sorted destinations
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        const meta = destinationMeta[dest.id] || { mood: 'Nature', crowd: 'Moderate' };
        if (selectedMood !== 'all' && meta.mood.toLowerCase() !== selectedMood.toLowerCase()) return false;
        if (selectedCrowd !== 'all' && meta.crowd.toLowerCase() !== selectedCrowd.toLowerCase()) return false;
        return true;
      })
      .sort((a, b) => {
        const metaA = destinationMeta[a.id] || { match: 90 };
        const metaB = destinationMeta[b.id] || { match: 90 };
        if (sortBy === 'match') return metaB.match - metaA.match;
        if (sortBy === 'price') return a.budgetRange.min - b.budgetRange.min;
        if (sortBy === 'temp') return parseInt(a.temperature) - parseInt(b.temperature);
        return 0;
      });
  }, [destinations, selectedMood, selectedCrowd, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-28 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 animate-spin-slow">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-foreground mb-2">
            Curating Destination Matches
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Comparing weather forecasts, road conditions, and comfort levels from {tripData?.startLocation}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-32 selection:bg-primary/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Back Link & Header */}
        <div className="mb-8">
          <Link
            to="/plan"
            state={tripData}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Modify departure & preferences</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles size={12} />
                <span>Step 2 of 3 • Curated Matches</span>
              </div>
              <h1 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
                Choose your destination
              </h1>
              <p className="text-muted-foreground text-base mt-2">
                Hand-picked based on your {tripData?.budget || 'moderate'} budget from {tripData?.startLocation} for {tripData?.travelers || 2} traveler(s).
              </p>
            </div>

            {/* Compare Drawer Indicator */}
            {compared.length > 0 && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="self-start md:self-auto inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-xs font-bold shadow-warm-sm hover:brightness-105 transition-all"
              >
                <span>Compare {compared.length} of 3</span>
              </button>
            )}
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-md py-4 mb-8 border-b border-border/60 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mr-1">
                <SlidersHorizontal size={13} />
                Filters:
              </span>

              {/* Mood Filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-full border border-border/60 text-xs">
                {['All', 'Mountains', 'Coastal', 'Heritage', 'Nature'].map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood.toLowerCase())}
                    className={`px-3 py-1 rounded-full font-medium transition-all ${
                      selectedMood === mood.toLowerCase()
                        ? 'bg-card text-foreground shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>

              {/* Crowd Filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-full border border-border/60 text-xs">
                {['All', 'Quiet', 'Moderate', 'Popular'].map((crowd) => (
                  <button
                    key={crowd}
                    type="button"
                    onClick={() => setSelectedCrowd(crowd.toLowerCase())}
                    className={`px-3 py-1 rounded-full font-medium transition-all ${
                      selectedCrowd === crowd.toLowerCase()
                        ? 'bg-card text-foreground shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {crowd}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'match' | 'price' | 'temp')}
                className="bg-muted/80 border border-border/60 rounded-full px-3 py-1.5 text-xs text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="match">Highest Match %</option>
                <option value="price">Lowest Estimated Budget</option>
                <option value="temp">Coolest Temperature</option>
              </select>
            </div>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDestinations.map((destination) => {
            const meta = destinationMeta[destination.id] || {
              match: 92,
              crowd: 'Quiet' as const,
              whyThis: 'Exceptional morning light & peaceful trails',
              season: destination.bestTime,
            };
            const isWishlisted = !!wishlist[destination.id];
            const isCompared = compared.some((d) => d.id === destination.id);

            return (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl overflow-hidden border border-border/80 shadow-warm hover:shadow-warm-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => handleSelectDestination(destination)}
              >
                <div>
                  {/* Image Container with Zoom and Scrim */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-editorial"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Top Row: Wax seal match & Wishlist heart button */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <div className="wax-seal px-3 py-1 text-xs font-bold shadow-warm">
                        {meta.match}% Match
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Compare Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => toggleCompare(destination, e)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition-all ${
                            isCompared
                              ? 'bg-secondary text-secondary-foreground shadow-sm'
                              : 'bg-black/40 text-white/90 hover:bg-black/60'
                          }`}
                        >
                          {isCompared ? '✓ Compared' : '+ Compare'}
                        </button>

                        {/* Wishlist Heart with Pop */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(destination.id, e)}
                          aria-label="Save to wishlist"
                          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-transform active:scale-125"
                        >
                          <motion.div
                            animate={isWishlisted ? { scale: [1, 1.35, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart
                              size={16}
                              className={isWishlisted ? 'text-[#C4512C] fill-[#C4512C]' : 'text-white'}
                            />
                          </motion.div>
                        </button>
                      </div>
                    </div>

                    {/* Bottom overlay: Temperature & Season */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                        <Thermometer size={13} className="text-accent" />
                        <span>{destination.temperature} • {destination.weather}</span>
                      </div>
                      <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px]">
                        Best: {meta.season}
                      </span>
                    </div>
                  </div>

                  {/* Destination Info Content */}
                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                          {destination.state}
                        </span>
                        <h3 className="font-serif-display text-2xl font-bold text-foreground mt-0.5">
                          {destination.name}
                        </h3>
                      </div>

                      {/* Crowd Badge */}
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-muted text-foreground border border-border/60">
                        {meta.crowd} Footfall
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {destination.description}
                    </p>

                    {/* "Why This?" Insight Chip */}
                    <div className="p-3 rounded-2xl bg-muted/60 border border-border/50 text-xs mb-4">
                      <span className="font-bold text-primary mr-1">Why this fits:</span>
                      <span className="text-foreground/90">{meta.whyThis}</span>
                    </div>

                    {/* Highlights Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {destination.highlights.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Price & Action Button */}
                <div className="px-6 md:px-7 py-4 border-t border-border/60 flex items-center justify-between bg-muted/20">
                  <div className="flex items-center gap-1.5">
                    <Wallet size={16} className="text-primary" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Est. Budget
                      </div>
                      <div className="font-serif-display text-base font-bold text-foreground">
                        {destination.budgetEstimate}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-full text-xs shadow-warm hover:brightness-105 active:scale-95 transition-all"
                  >
                    <span>Build Itinerary</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-16 bg-card rounded-3xl border border-border/80 p-8 max-w-md mx-auto">
            <p className="font-serif-display text-xl font-bold mb-2">No matches for these filters</p>
            <p className="text-sm text-muted-foreground mb-6">
              Try switching your crowd filter or mood preference to see all curated options.
            </p>
            <button
              onClick={() => {
                setSelectedMood('all');
                setSelectedCrowd('all');
              }}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Slide-Up Comparison Drawer (Up to 3 Destinations) */}
      <AnimatePresence>
        {drawerOpen && compared.length > 0 && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-card/98 backdrop-blur-xl border-t border-border shadow-warm-xl p-4 sm:p-6"
          >
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-serif-display text-lg font-bold text-foreground">
                    Destination Comparison ({compared.length} of 3)
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    • Compare weather, pacing & estimated costs
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {compared.map((dest) => (
                  <div
                    key={dest.id}
                    className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{dest.name}</h4>
                        <p className="text-xs text-muted-foreground">{dest.temperature} • {dest.budgetEstimate}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectDestination(dest)}
                      className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Suggestions;
