import { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Search, Calendar, BarChart, ArrowRight } from 'lucide-react';
import { activitiesData, ActivityItem } from '@/data/staticDiscoveryData';
import StepIndicator from '@/components/ui/StepIndicator';
import ActivityModal from '@/components/trip/ActivityModal';
import { useNavigate } from 'react-router-dom';

const Activities = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<string>('All');
    const [search, setSearch] = useState<string>('');
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [selectedActivityForModal, setSelectedActivityForModal] = useState<ActivityItem | null>(null);

    const categories = ['All', 'Adventure', 'Nature', 'Spiritual', 'Culture', 'Food'];

    const toggleActivity = (id: string) => {
        setSelectedActivities(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleFindDestinations = () => {
        navigate('/destinations', { state: { selectedActivityIds: selectedActivities } });
    };

    const filteredActivities = activitiesData.filter((act) => {
        const matchesCategory = filter === 'All' || act.category === filter;
        const matchesSearch = act.name.toLowerCase().includes(search.toLowerCase()) ||
            act.description.toLowerCase().includes(search.toLowerCase()) ||
            act.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 font-sans relative">
            <div className="container mx-auto px-4">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                        Unforgettable Experiences
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Things to do, places to feel, moments to remember. Curated activities for every traveler.
                    </p>
                </motion.div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 sticky top-20 z-30 bg-background/80 backdrop-blur-lg p-4 rounded-3xl border border-border/50 shadow-sm">
                    {/* Categories - Scrollable on mobile */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${filter === cat
                                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                    : 'bg-transparent text-foreground border-border hover:border-primary/50 hover:bg-muted'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Find activities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {filteredActivities.map((act, index) => {
                        const isSelected = selectedActivities.includes(act.id);
                        return (
                            <motion.div
                                key={act.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                                onClick={() => setSelectedActivityForModal(act)}
                                className={`group cursor-pointer relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-3xl' : ''}`}
                            >
                                <div className={`bg-card rounded-3xl overflow-hidden border shadow-soft hover:shadow-xl transition-all duration-300 h-full flex flex-col ${isSelected ? 'border-primary' : 'border-border'}`}>
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                                        <img
                                            src={act.image}
                                            alt={act.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-accent/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                                                {act.category}
                                            </span>
                                        </div>
                                        {/* Selection Check */}
                                        <div className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white scale-110' : 'bg-black/30 text-transparent border border-white/30'}`}>
                                            <div className="w-2.5 h-2.5 bg-current rounded-full" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{act.name}</h3>
                                            {act.difficulty && (
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${act.difficulty === 'Easy' ? 'border-green-200 text-green-600 bg-green-50' :
                                                    act.difficulty === 'Moderate' ? 'border-orange-200 text-orange-600 bg-orange-50' :
                                                        'border-red-200 text-red-600 bg-red-50'
                                                    }`}>
                                                    {act.difficulty}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed">
                                            {act.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                                            <div className="flex items-center gap-2">
                                                <Compass size={14} className="text-primary" />
                                                <span>
                                                    <span className="font-semibold text-foreground">Best in: </span>
                                                    {act.bestPlaces[0]}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-primary" />
                                                <span>
                                                    {act.bestSeason}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {selectedActivities.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
                        onClick={handleFindDestinations}
                    >
                        <span className="font-bold">{selectedActivities.length} selected</span>
                        <span className="h-4 w-px bg-background/20" />
                        <span className="flex items-center gap-2 font-medium">Find Destinations <ArrowRight size={16} /></span>
                    </motion.div>
                )}

                {filteredActivities.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">No activities found matching your criteria.</p>
                        <button onClick={() => { setFilter('All'); setSearch('') }} className="mt-4 text-primary font-medium hover:underline">
                            Clear filters
                        </button>
                    </div>
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
