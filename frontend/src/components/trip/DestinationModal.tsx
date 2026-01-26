import { useState, useMemo } from 'react';
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

        // If local is empty, maybe move some balanced to local if they fit loosely? Or just keep clean logic.

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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                    {/* Image Side (Desktp) / Header (Mobile) */}
                    <div className="md:w-1/3 relative h-48 md:h-auto md:min-h-full">
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
                    <div className="md:w-2/3 flex flex-col h-full overflow-hidden bg-background">
                        <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar">

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-foreground mb-2">Explore {destination.name}</h3>
                                <p className="text-muted-foreground">Select the places you'd like to visit to build your perfect itinerary.</p>
                            </div>

                            <div className="space-y-10">
                                {/* Customizable Sections */}
                                <PlaceGroup
                                    title="Iconic Sights"
                                    icon={<Star className="text-yellow-500 fill-yellow-500" size={18} />}
                                    places={getGroupedPlaces.iconic}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                    imageError={imageError}
                                    handleImageError={handleImageError}
                                />

                                <PlaceGroup
                                    title="Local Experiences"
                                    icon={<Users className="text-blue-500" size={18} />}
                                    places={getGroupedPlaces.local}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                    imageError={imageError}
                                    handleImageError={handleImageError}
                                />

                                <PlaceGroup
                                    title="Quiet & Relaxing"
                                    icon={<Clock className="text-green-500" size={18} />}
                                    places={getGroupedPlaces.quiet}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                    imageError={imageError}
                                    handleImageError={handleImageError}
                                />

                                <PlaceGroup
                                    title="More to Explore"
                                    places={getGroupedPlaces.balanced}
                                    selectedPlaces={selectedPlaces}
                                    togglePlace={togglePlace}
                                    imageError={imageError}
                                    handleImageError={handleImageError}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-border bg-background/50 backdrop-blur-xl flex items-center justify-between shrink-0">
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

const PlaceGroup = ({ title, icon, places, selectedPlaces, togglePlace, imageError, handleImageError }: any) => {
    if (!places || places.length === 0) return null;

    return (
        <section>
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                {icon} {title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {places.map((place: PlaceItem) => {
                    const isSelected = selectedPlaces.includes(place.id);
                    const hasImageError = imageError[place.id];

                    return (
                        <div
                            key={place.id}
                            onClick={() => togglePlace(place.id)}
                            className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'
                                }`}
                        >
                            {/* Image Aspect 16:9 */}
                            <div className="aspect-video relative bg-muted">
                                {place.image && !hasImageError ? (
                                    <img
                                        src={place.image}
                                        alt={place.name}
                                        onError={() => handleImageError(place.id)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                                        <MapPin size={24} />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Selection Check */}
                                <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white scale-100 shadow-lg' : 'bg-black/40 text-transparent border border-white/30 scale-90 group-hover:scale-100'
                                    }`}>
                                    <Check size={16} strokeWidth={3} />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <h5 className="font-bold text-base leading-tight mb-1">{place.name}</h5>
                                    <div className="flex items-center justify-between text-xs text-white/80">
                                        <span>{place.type}</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> {place.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default DestinationModal;
