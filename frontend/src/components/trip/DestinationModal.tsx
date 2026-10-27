import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, ArrowRight, Check, Star, Users } from 'lucide-react';
import { DestinationItem, PlaceItem } from '@/data/staticDiscoveryData';
import { useNavigate } from 'react-router-dom';

interface DestinationModalProps {
    destination: DestinationItem | null;
    onClose: () => void;
}

const DestinationModal = ({ destination, onClose }: DestinationModalProps) => {
    const navigate = useNavigate();
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
    const [imageError, setImageError] = useState<Record<string, boolean>>({});

    // Lock body scroll when modal is open
    useEffect(() => {
        if (destination) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [destination]);

    const togglePlace = (id: string) => {
        setSelectedPlaces(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handlePlanTrip = () => {
        if (!destination) return;
        navigate('/plan', {
            state: {
                destination: { name: destination.name },
                destinationId: destination.id,
                selectedPlaceIds: selectedPlaces,
            }
        });
    };

    const getGroupedPlaces = useMemo(() => {
        if (!destination) return { iconic: [], local: [], quiet: [], balanced: [] };

        const iconic = destination.places.filter(p => p.popularityScore >= 9.5 || (destination.places.indexOf(p) < 2 && p.popularityScore > 9));
        const rest = destination.places.filter(p => !iconic.includes(p));

        const local = rest.filter(p =>
            p.type === 'Culture' || p.type === 'Food' || p.type === 'Spiritual' || p.type === 'Heritage'
        );

        // Remove local from rest to avoid duplicates
        const remaining = rest.filter(p => !local.includes(p));

        const quiet = remaining.filter(p => p.crowdLevel === 'Low' || p.popularityScore < 8.5);
        const balanced = remaining.filter(p => !quiet.includes(p)); // Everything else is balanced

        return { iconic, local, quiet, balanced };
    }, [destination]);

    if (!destination) return null;

    const handleImageError = (id: string) => {
        setImageError(prev => ({ ...prev, [id]: true }));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background w-full max-w-5xl h-[85vh] md:h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                    {/* Image Side (Desktop) / Header (Mobile) */}
                    <div className="md:w-1/3 relative h-48 md:h-auto md:min-h-full shrink-0">
                        <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />

                        <div className="absolute bottom-6 left-6 text-white z-10">
                            <h2 className="text-4xl font-bold mb-2">{destination.name}</h2>
                            <p className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                <MapPin size={16} /> {destination.state}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {destination.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/40 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Side */}
                    {/* Content Side */}
                    <div className="md:w-2/3 flex flex-col h-full bg-background min-h-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-foreground mb-2">Explore {destination.name}</h3>
                                <p className="text-muted-foreground">Select the places you'd like to visit to build your perfect itinerary.</p>
                            </div>

                            <div className="space-y-10 pb-4">
                                {/* Customizable Sections */}
                                <PlaceGroup
                                    title="Iconic Sights"
                                    icon={<Star className="text-yellow-500 fill-yellow-500" size={18} />}
                                    places={getGroupedPlaces.iconic}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                />

                                <PlaceGroup
                                    title="Local Experiences"
                                    icon={<Users className="text-blue-500" size={18} />}
                                    places={getGroupedPlaces.local}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                />

                                <PlaceGroup
                                    title="Quiet & Relaxing"
                                    icon={<Clock className="text-green-500" size={18} />}
                                    places={getGroupedPlaces.quiet}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                />

                                <PlaceGroup
                                    title="More to Explore"
                                    places={getGroupedPlaces.balanced}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                />
                            </div>
                        </div>

                        {/* Footer - Fixed at bottom of panel */}
                        <div className="p-6 border-t border-border bg-background/50 backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
                            <div className="text-sm font-medium">
                                <span className="text-primary text-lg font-bold">{selectedPlaces.length}</span> places selected
                            </div>
                            <button
                                onClick={handlePlanTrip}
                                disabled={selectedPlaces.length === 0}
                                className="btn-primary py-3 px-8 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                            >
                                Plan This Trip <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

interface PlaceGroupProps {
    title: string;
    icon: React.ReactNode;
    places: PlaceItem[];
    selectedPlaces: string[];
    togglePlace: (id: string) => void;
}

const PlaceGroup = ({ title, icon, places, selectedPlaces, togglePlace }: PlaceGroupProps) => {
    if (!places || places.length === 0) return null;

    return (
        <section>
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                {icon} {title}
            </h4>
            <div className="flex flex-col gap-3">
                {places.map((place: PlaceItem) => {
                    const isSelected = selectedPlaces.includes(place.id);

                    return (
                        <div
                            key={place.id}
                            onClick={() => togglePlace(place.id)}
                            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                ? 'bg-primary/5 border-primary shadow-sm'
                                : 'bg-card border-border/50 hover:bg-muted/50 hover:border-border'
                                }`}
                        >
                            {/* Checkbox */}
                            <div className={`mt-1 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 bg-background'
                                }`}>
                                {isSelected && <Check size={14} strokeWidth={3} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-bold text-base text-foreground">{place.name}</h5>
                                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-full">
                                        <Clock size={12} /> {place.duration}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{place.type}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default DestinationModal;
