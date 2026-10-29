import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Sparkles, ArrowRight, Compass, SlidersHorizontal, Sun, Calendar, Wallet } from 'lucide-react';
import { destinationsData, DestinationItem } from '@/data/staticDiscoveryData';
import DestinationModal from '@/components/trip/DestinationModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { planningLogic } from '@/lib/planningLogic';

export const Destinations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const highlightActivityIds = location.state?.selectedActivityIds as string[] | undefined;

  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'cost-asc' | 'cost-desc' | 'name'>('featured');
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);

  useEffect(() => {
    if (highlightActivityIds && highlightActivityIds.length > 0) {
      setFilter('Recommended');
    }
  }, [highlightActivityIds]);

  const categories = ['All', 'Recommended', 'Mountains', 'Beaches', 'Heritage', 'Spiritual', 'Nature', 'Urban'];
  const activeCategories = highlightActivityIds ? categories : categories.filter((c) => c !== 'Recommended');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: destinationsData.length };
    destinationsData.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    if (highlightActivityIds) {
      counts['Recommended'] = planningLogic.getBestDestinationsForActivities(highlightActivityIds).length;
    }
    return counts;
  }, [highlightActivityIds]);

  const filteredDestinations = useMemo(() => {
    let data = [...destinationsData];

    if (highlightActivityIds && highlightActivityIds.length > 0) {
      data = planningLogic.getBestDestinationsForActivities(highlightActivityIds);

      if (filter === 'Recommended') {
        data = data.filter(
          (dest) =>
            dest.name.toLowerCase().includes(search.toLowerCase()) ||
            dest.state.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    let result = data.filter((dest) => {
      const matchesCategory =
        filter === 'All' || dest.category === filter || (filter === 'Recommended' && highlightActivityIds);
      const matchesSearch =
        dest.name.toLowerCase().includes(search.toLowerCase()) ||
        dest.state.toLowerCase().includes(search.toLowerCase()) ||
        dest.category.toLowerCase().includes(search.toLowerCase()) ||
        dest.famousFor.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (sortBy === 'cost-asc') {
      result.sort((a, b) => a.averageDailyCost - b.averageDailyCost);
    } else if (sortBy === 'cost-desc') {
      result.sort((a, b) => b.averageDailyCost - a.averageDailyCost);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [filter, search, sortBy, highlightActivityIds]);

  const handleStartPlan = (dest: DestinationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/plan', {
      state: {
        destination: { name: dest.name },
        destinationId: dest.id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 font-sans text-foreground selection:bg-primary/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <Compass size={13} className="text-primary" />
            <span>Curated Geography • {destinationsData.length} Road-Tested Regions</span>
          </div>
          <h1 className="font-serif-display text-fluid-h1 font-bold text-foreground mb-4 tracking-tight leading-[1.12]">
            Explore Destinations Across India
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Discover places by mood, landscape, and pace. From high Himalayan passes and pine valleys to southern spice hills and tropical backwaters.
          </p>
        </div>

        {/* AI Concierge Matchmaker Feature Card */}
        <div className="mb-10 bg-gradient-to-r from-stone-900 via-[#131D28] to-stone-900 text-white rounded-3xl p-6 md:p-8 border border-white/10 shadow-warm-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/90 font-medium mb-3">
              <Sparkles size={12} className="text-accent" />
              <span>Artisanal Travel Concierge • 24/7 Live Assistant</span>
            </div>
            <h3 className="font-serif-display text-2xl font-bold tracking-tight mb-2">
              Unsure which corner of India fits your tempo?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              Tell our live AI Concierge about your traveling group, preferred tempo, or seasonal window, and receive tailored dispatches with real timing advice.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-concierge', { detail: { destination: selectedDestination?.name } }))}
            className="relative z-10 bg-primary hover:brightness-105 active:scale-95 text-primary-foreground font-semibold px-6 py-3.5 rounded-2xl shadow-warm flex items-center gap-2.5 transition-all shrink-0 text-sm cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Ask AI Concierge</span>
            <ArrowRight size={16} />
          </button>

          {/* Decorative atmospheric glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Filters & Search Sticky Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 sticky top-20 z-30 bg-background/95 backdrop-blur-md p-3.5 md:p-4 rounded-3xl border border-border/70 shadow-warm-sm">
          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {activeCategories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-warm-sm'
                      : cat === 'Recommended'
                      ? 'bg-accent/15 text-accent-text border-accent/30 hover:bg-accent/20'
                      : 'bg-muted/60 text-foreground/80 border-border/60 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat === 'Recommended' && <Sparkles size={12} className="text-accent" />}
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-background/80 text-muted-foreground'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search mountains, forts, states..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-border/80 bg-background text-xs md:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-full border border-border/80 bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer shrink-0"
            >
              <option value="featured">Featured</option>
              <option value="cost-asc">Budget: Low to High</option>
              <option value="cost-desc">Budget: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 px-1">
          <span>Showing <strong className="text-foreground">{filteredDestinations.length}</strong> authentic destinations</span>
          <span className="hidden sm:inline">Click any card to inspect stops or tap Plan to draft</span>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.3, index * 0.03) }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer flex flex-col"
              onClick={() => setSelectedDestination(dest)}
            >
              <div className="bg-card rounded-3xl overflow-hidden border border-border/80 shadow-warm hover:shadow-warm-xl transition-all duration-300 h-full flex flex-col relative">
                {/* Image & Badges */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10" />
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-editorial"
                  />
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                      {dest.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                    <h3 className="font-serif-display text-2xl font-bold leading-tight mb-0.5">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-white/85 flex items-center gap-1">
                      <MapPin size={12} className="text-accent" /> {dest.state}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-primary uppercase tracking-wider text-[11px]">
                        Curated Highlights
                      </span>
                      <span className="text-foreground font-semibold bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/50 text-[11px]">
                        ~₹{dest.averageDailyCost.toLocaleString('en-IN')}/day
                      </span>
                    </div>

                    <p className="text-foreground/90 text-sm font-medium">
                      {dest.places.slice(0, 2).map((p) => p.name).join(', ')}...
                    </p>

                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                      {dest.famousFor}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/60 mb-4">
                    {dest.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-muted/80 text-muted-foreground px-2.5 py-1 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDestination(dest);
                      }}
                      className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border/60 transition-colors"
                    >
                      Field Notes
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleStartPlan(dest, e)}
                      className="flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl bg-primary text-primary-foreground hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-warm-sm"
                    >
                      <span>Plan Trip</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border/80 max-w-md mx-auto p-8">
            <Compass size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-serif-display text-xl font-bold mb-2">No matching destinations</p>
            <p className="text-sm text-muted-foreground mb-4">Try clearing your search term or selecting 'All'.</p>
            <button
              onClick={() => {
                setFilter('All');
                setSearch('');
              }}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-bold"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>

      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </div>
  );
};

export default Destinations;
