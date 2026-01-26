import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Sparkles } from 'lucide-react';
import { destinationsData, DestinationItem } from '@/data/staticDiscoveryData';
import SectionCard from '@/components/ui/SectionCard';
import DestinationModal from '@/components/trip/DestinationModal';
import { useLocation } from 'react-router-dom';
import { planningLogic } from '@/lib/planningLogic';

const Destinations = () => {
    const location = useLocation();
    const highlightActivityIds = location.state?.selectedActivityIds as string[] | undefined;

    const [filter, setFilter] = useState<string>('All');
    const [search, setSearch] = useState<string>('');
    const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);

    // If coming from activities, show a specific filter state or just "Recommended"
    useEffect(() => {
        if (highlightActivityIds && highlightActivityIds.length > 0) {
            setFilter('Recommended');
        }
    }, [highlightActivityIds]);

    const categories = ['All', 'Recommended', 'Mountains', 'Beaches', 'Heritage', 'Spiritual', 'Nature', 'Urban'];

    // Remove "Recommended" if not relevant
    const activeCategories = highlightActivityIds ? categories : categories.filter(c => c !== 'Recommended');

    const filteredDestinations = useMemo(() => {
        let data = [...destinationsData];

        // 1. If we have activity based highlights, sort by relevance first
        if (highlightActivityIds && highlightActivityIds.length > 0) {
            data = planningLogic.getBestDestinationsForActivities(highlightActivityIds);

            // If filter is Recommended, we just return this sorted list (filtered by search if any)
            if (filter === 'Recommended') {
                return data.filter(dest =>
                    dest.name.toLowerCase().includes(search.toLowerCase()) ||
                    dest.state.toLowerCase().includes(search.toLowerCase())
                );
            }
        }

        // 2. Standard Filter
        return data.filter((dest) => {
            const matchesCategory = filter === 'All' || dest.category === filter || (filter === 'Recommended' && highlightActivityIds); // Fallback for Recommended
            const matchesSearch = dest.name.toLowerCase().includes(search.toLowerCase()) ||
                dest.state.toLowerCase().includes(search.toLowerCase()) ||
                dest.category.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [filter, search, highlightActivityIds]);

    return (
        <div className="h-screen w-full bg-background pt-24 pb-12 font-sans overflow-y-auto text-foreground">
            <div className="container mx-auto px-4">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                        Explore Destinations in India
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Discover places by mood, landscape, and experience. From the snowy peaks of the Himalayas to the tropical beaches of the south.
                    </p>
                </motion.div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 sticky top-20 z-30 bg-background/80 backdrop-blur-lg p-4 rounded-3xl border border-border/50 shadow-sm">
                    {/* Categories - Scrollable on mobile */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        {activeCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${filter === cat
                                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                    : cat === 'Recommended'
                                        ? 'bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20'
                                        : 'bg-transparent text-foreground border-border hover:border-primary/50 hover:bg-muted'
                                    }`}
                            >
                                {cat === 'Recommended' && <Sparkles size={14} className="inline mr-1" />}
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search places..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDestinations.map((dest, index) => (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="group cursor-pointer"
                            onClick={() => setSelectedDestination(dest)}
                        >
                            <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                            {dest.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 z-20 text-white">
                                        <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                                        <p className="text-sm text-white/80 flex items-center gap-1">
                                            <MapPin size={14} /> {dest.state}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Highlights</span>
                                            <span className="text-xs text-muted-foreground">~₹{dest.averageDailyCost}/day</span>
                                        </div>
                                        <p className="text-foreground/80 text-sm font-medium">
                                            {dest.places.slice(0, 2).map(p => p.name).join(', ')}...
                                        </p>
                                    </div>

                                    <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">
                                        Famous for <span className="text-foreground font-medium">{dest.famousFor}</span>
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {dest.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredDestinations.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No destinations found matching your criteria.</p>
                        <button onClick={() => { setFilter('All'); setSearch('') }} className="mt-4 text-primary font-medium hover:underline">
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
