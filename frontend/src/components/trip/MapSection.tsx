import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapSectionProps {
    destination: string;
}

const MapSection = ({ destination }: MapSectionProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            className="mb-8"
        >
            <h2 className="section-title flex items-center gap-2">
                <MapPin className="text-primary" size={24} />
                Map View
            </h2>
            <div className="card-travel h-64 flex items-center justify-center bg-secondary/20">
                <p className="text-muted-foreground">Map of {destination} coming soon...</p>
            </div>
        </motion.section>
    );
};

export default MapSection;
