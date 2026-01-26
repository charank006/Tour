
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Check, ChevronRight, Star, ExternalLink } from 'lucide-react';
import { ActivityItem, destinationsData, PlaceItem } from '@/data/staticDiscoveryData';
import { useState, useMemo } from 'react';

interface ActivityModalProps {
    activity: ActivityItem | null;
    onClose: () => void;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

const ActivityModal = ({ activity, onClose, isSelected, onToggle }: ActivityModalProps) => {
    if (!activity) return null;

    // Filter relevant places
    const relevantPlaces = useMemo(() => {
        const allPlaces: { place: PlaceItem, destinationName: string }[] = [];

        destinationsData.forEach(dest => {
            // Check if destination is known for this activity
            // Or if destination has places matching activity category
            const matchingPlaces = dest.places.filter(p =>
                p.type === activity.category ||
                activity.bestPlaces.includes(dest.name) && p.type === 'Nature' // Fallback for specific mappings if needed
            );

            matchingPlaces.forEach(p => {
                allPlaces.push({ place: p, destinationName: dest.name });
            });
        });

        // Grouping
        const famous = allPlaces.filter(p => p.place.popularityScore >= 9.0);
        const balanced = allPlaces.filter(p => p.place.popularityScore >= 8.0 && p.place.popularityScore < 9.0 && p.place.crowdLevel !== 'High');
        const hidden = allPlaces.filter(p => p.place.popularityScore < 8.0 || p.place.crowdLevel === 'Low');

        return { famous, balanced, hidden };
    }, [activity]);


    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background w-full max-w-3xl max-h-[90vh] rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                >
                    {/* Header Image Area */}
                    <div className="relative h-64 md:h-72 shrink-0">
                        <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                        <div className="absolute top-4 right-4">
                            <button
                                onClick={onClose}
                                className="bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="absolute bottom-4 left-6 right-6">
                            <div className="flex gap-2 mb-2">
                                <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                                    {activity.category}
                                </span>
                                {activity.difficulty && (
                                    <span className="bg-black/40 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                                        {activity.difficulty}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{activity.name}</h2>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                {activity.duration && (
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {activity.duration}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} /> Popular in {activity.bestPlaces.slice(0, 2).join(', ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Scrollable Area */}
                    <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        <div className="prose prose-sm max-w-none text-muted-foreground mb-8">
                            <p className="text-base leading-relaxed">{activity.description}</p>
                        </div>

                        {/* Places Sections */}
                        <div className="space-y-8">
                            {/* Famous */}
                            {relevantPlaces.famous.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                        <Star className="text-yellow-500 fill-yellow-500" size={18} />
                                        Most Famous Spots
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {relevantPlaces.famous.slice(0, 4).map((item, idx) => (
                                            <PlaceCard key={idx} item={item} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Balanced */}
                            {relevantPlaces.balanced.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-foreground mb-4">Popular & Balanced</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {relevantPlaces.balanced.slice(0, 4).map((item, idx) => (
                                            <PlaceCard key={idx} item={item} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Hidden Gems */}
                            {relevantPlaces.hidden.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-foreground mb-4">Less Crowded / Local Favorites</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {relevantPlaces.hidden.slice(0, 4).map((item, idx) => (
                                            <PlaceCard key={idx} item={item} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-border bg-background/50 backdrop-blur-xl flex justify-between items-center shrink-0">
                        <div className="text-sm text-muted-foreground hidden md:block">
                            Select to add to your plan
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => { onToggle(activity.id); onClose(); }}
                                className={`flex-1 md:flex-none px-8 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${isSelected
                                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        : 'btn-primary shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isSelected ? (
                                    <> <Check size={18} /> Added </>
                                ) : (
                                    <> Add Activity </>
                                )}
                            </button>
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const PlaceCard = ({ item }: { item: { place: PlaceItem, destinationName: string } }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
            <MapPin size={20} />
        </div>
        <div className="min-w-0">
            <h4 className="font-semibold text-foreground text-sm truncate">{item.place.name}</h4>
            <p className="text-xs text-muted-foreground">{item.destinationName} • {item.place.bestSeason}</p>
        </div>
    </div>
);

export default ActivityModal;
