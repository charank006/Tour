import { Home, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface Amenities {
    amenities: string[];
}

interface StayOption {
    type: string;
    name: string;
    rating: number;
    amenities: string[];
    pricePerNight: number;
    image: string;
}

interface AlternativeSuggestionsProps {
    stayOptions: StayOption[];
    selectedStayType: string;
    setSelectedStayType: (type: any) => void;
    formatCurrency: (amount: number) => string;
}

const AlternativeSuggestions = ({ stayOptions, selectedStayType, setSelectedStayType, formatCurrency }: AlternativeSuggestionsProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
            className="h-full"
        >


            <div className="grid md:grid-cols-2 gap-6">
                {stayOptions.map((stay) => {
                    const isSelected = selectedStayType === stay.type;
                    return (
                        <button
                            key={stay.type}
                            onClick={() => setSelectedStayType(stay.type)}
                            className={`card-travel text-left transition-all overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''
                                }`}
                        >
                            <div className="relative h-32 -mx-6 -mt-6 mb-4 overflow-hidden">
                                <ImageWithFallback
                                    src={stay.image}
                                    alt={stay.name}
                                    className="w-full h-full"
                                    fallbackIcon={Home}
                                />
                                <div className="absolute top-3 left-3 z-20">
                                    <span className={`badge-travel ${stay.type === 'budget' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                                        }`}>
                                        {stay.type === 'budget' ? '💰 Budget' : '✨ Comfort'}
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">{stay.name}</h3>
                            <div className="flex items-center gap-1 mb-3">
                                <Star size={14} className="text-primary fill-primary" />
                                <span className="text-sm font-medium text-foreground">{stay.rating}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {stay.amenities.slice(0, 3).map((amenity) => (
                                    <span key={amenity} className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                <span className="text-muted-foreground text-sm">Per night</span>
                                <span className="text-lg font-bold text-primary">{formatCurrency(stay.pricePerNight)}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </motion.section>
    );
};

export default AlternativeSuggestions;
