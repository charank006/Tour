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
            className="mb-16"
        >
            <h2 className="section-title flex items-center gap-2 mb-6">
                <MapPin className="text-primary" size={24} />
                Route Map
            </h2>

            <div className="relative w-full h-[500px] bg-secondary/10 rounded-3xl overflow-hidden border border-border/50 group">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-background to-purple-50/50" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Central Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-20 h-20 bg-background rounded-full shadow-lg flex items-center justify-center mb-6 ring-4 ring-primary/10 group-hover:scale-110 transition-transform duration-500">
                        <MapPin size={32} className="text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-2">
                        Visualize Your Journey
                    </h3>
                    <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                        Interactive map visualization for {destination} is being generated. You'll be able to see all your stops and travel routes here soon.
                    </p>

                    <button className="btn-outline bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Explore Full Map
                    </button>

                    {/* Floating Elements decoration */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-xl shadow-blue-400/50" />
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-xl shadow-purple-400/50 delay-700" />
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-xl shadow-pink-400/50 delay-300" />
                </div>
            </div>
        </motion.section>
    );
};

export default MapSection;
