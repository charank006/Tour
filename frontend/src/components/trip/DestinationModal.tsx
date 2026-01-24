import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Star, Users, ArrowRight, Check } from 'lucide-react';
import { DestinationItem, PlaceItem } from '@/data/staticDiscoveryData';
import { useNavigate } from 'react-router-dom';

interface DestinationModalProps {
    destination: DestinationItem | null;
    onClose: () => void;
}

const DestinationModal = ({ destination, onClose }: DestinationModalProps) => {
    const navigate = useNavigate();
    const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

    if (!destination) return null;

    const togglePlace = (id: string) => {
        setSelectedPlaces(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handlePlanTrip = () => {
        // Navigate to TripPlan with selected data
        navigate('/trip-plan', {
            state: {
                destination: { name: destination.name }, // Pass simple object for compatibility
                destinationId: destination.id,
                selectedPlaceIds: selectedPlaces,
                startLocation: 'New Delhi', // Default or user context
                travelers: 2, // Default
                startDate: new Date().toISOString(),
                isManualPlan: true // Flag to use client-side logic
            }
        });
    };

    const getCrowdColor = (level: string) => {
        switch (level) {
            case 'Low': return 'text-green-600 bg-green-50 border-green-200';
            case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'High': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                    {/* Image Side */}
                    <div className="md:w-2/5 relative h-48 md:h-auto">
                        <img
                            src={destination.image}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <h2 className="text-3xl font-bold">{destination.name}</h2>
                            <p className="flex items-center gap-1 text-white/80 text-sm">
                                <MapPin size={14} /> {destination.state}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 md:hidden bg-black/20 text-white p-2 rounded-full backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Side */}
                    <div className="md:w-3/5 p-6 md:p-8 flex flex-col h-full overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Top Places to Visit</h3>
                                <p className="text-muted-foreground text-sm">Select places you'd like to include in your itinerary.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="hidden md:block text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Places List (Scrollable) */}
                        <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {destination.places.map((place) => {
                                const isSelected = selectedPlaces.includes(place.id);
                                return (
                                    <div
                                        key={place.id}
                                        onClick={() => togglePlace(place.id)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${isSelected
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border hover:border-primary/30 hover:bg-muted/30'
                                            }`}
                                    >
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-foreground">{place.name}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border border-border bg-background text-muted-foreground`}>
                                                    {place.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                    {place.popularityScore}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {place.duration}
                                                </span>
                                                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${getCrowdColor(place.crowdLevel)}`}>
                                                    <Users size={10} />
                                                    {place.crowdLevel}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                            ? 'bg-primary border-primary text-white'
                                            : 'border-muted-foreground/30 group-hover:border-primary/50'
                                            }`}>
                                            {isSelected && <Check size={14} strokeWidth={3} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Action */}
                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                            <div className="text-sm">
                                <span className="font-bold text-foreground">{selectedPlaces.length}</span>
                                <span className="text-muted-foreground"> places selected</span>
                            </div>
                            <button
                                onClick={handlePlanTrip}
                                className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
                            >
                                Generate Itinerary <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DestinationModal;
