import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Search, Calendar, ArrowRight, Sparkles, Check } from 'lucide-react';
import { activitiesData, ActivityItem } from '@/data/staticDiscoveryData';
import ActivityModal from '@/components/trip/ActivityModal';
import { useNavigate } from 'react-router-dom';
import EmptyState from '@/components/ui/EmptyState';

export const Activities = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedActivityForModal, setSelectedActivityForModal] = useState<ActivityItem | null>(null);

  const categories = ['All', 'Adventure', 'Nature', 'Spiritual', 'Culture', 'Food'];

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleFindDestinations = () => {
    navigate('/destinations', { state: { selectedActivityIds: selectedActivities } });
  };

  const filteredActivities = activitiesData.filter((act) => {
    const matchesCategory = filter === 'All' || act.category === filter;
    const matchesSearch =
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase()) ||
      act.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 font-sans relative selection:bg-primary/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles size={13} />
            <span>Curated Experiences</span>
          </div>
          <h1 className="font-serif-display text-fluid-h1 font-bold text-foreground mb-4 tracking-tight leading-[1.12]">
            Unforgettable Local Experiences
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Things to do, places to feel, moments to remember. Hand-picked adventures across India.
          </p>
        </motion.div>

        {/* Filters & Search Sticky Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 sticky top-20 z-30 bg-background/95 backdrop-blur-md p-4 rounded-3xl border border-border/70 shadow-warm-sm">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground border-primary shadow-warm-sm'
                    : 'bg-muted/60 text-foreground/80 border-border/60 hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search rafting, cooking, forts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((act, index) => {
            const isSelected = selectedActivities.includes(act.id);
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="group cursor-pointer"
                onClick={() => setSelectedActivityForModal(act)}
              >
                <div
                  className={`bg-card rounded-3xl overflow-hidden border shadow-warm hover:shadow-warm-xl transition-all duration-300 h-full flex flex-col relative ${
                    isSelected ? 'ring-2 ring-primary border-primary' : 'border-border/80'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={act.image}
                      alt={act.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-editorial"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                        {act.category}
                      </span>
                    </div>

                    {/* Toggle checkmark button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActivity(act.id);
                      }}
                      className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-warm'
                          : 'bg-black/40 text-white/80 hover:bg-black/60 border border-white/20'
                      }`}
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4 z-20 text-white flex justify-between items-end">
                      <span className="text-xs font-semibold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                        {act.duration}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif-display text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {act.name}
                        </h3>
                        {act.difficulty && (
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${
                              act.difficulty === 'Easy'
                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : act.difficulty === 'Moderate'
                                ? 'border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300'
                                : 'border-rose-200 text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300'
                            }`}
                          >
                            {act.difficulty}
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-xs leading-relaxed mb-6 font-light line-clamp-3">
                        {act.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground border-t border-border/60 pt-4">
                      <div className="flex items-center gap-1.5">
                        <Compass size={14} className="text-primary" />
                        <span className="truncate">
                          <span className="font-semibold text-foreground">Best in: </span>
                          {act.bestPlaces[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        <span className="truncate">{act.bestSeason}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Bottom Bar when activities are selected */}
        {selectedActivities.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-card text-foreground border border-border/80 px-6 py-3.5 rounded-full shadow-warm-xl flex items-center gap-4 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            onClick={handleFindDestinations}
          >
            <span className="font-bold text-sm text-primary">
              {selectedActivities.length} experience(s) selected
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5 font-semibold text-sm">
              <span>Find Matching Destinations</span>
              <ArrowRight size={15} />
            </span>
          </motion.div>
        )}

        {filteredActivities.length === 0 && (
          <EmptyState
            icon={Search}
            title="No experiences found"
            description="We couldn't find any activities matching your filter. Try clearing your search term."
            action={
              <button
                onClick={() => {
                  setFilter('All');
                  setSearch('');
                }}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs font-bold"
              >
                Clear all filters
              </button>
            }
            className="mt-12"
          />
        )}
      </div>

      <ActivityModal
        activity={selectedActivityForModal}
        onClose={() => setSelectedActivityForModal(null)}
        isSelected={selectedActivityForModal ? selectedActivities.includes(selectedActivityForModal.id) : false}
        onToggle={toggleActivity}
      />
    </div>
  );
};

export default Activities;
