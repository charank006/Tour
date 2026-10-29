import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, MapPin } from 'lucide-react';
import { FoldedMapIllustration } from './illustrations/TravelIllustrations';

const REAL_STEPS_MICROCOPY = [
  'Checking historical weather forecasts & monsoon radar...',
  'Curating morning crowd windows to avoid tour bus jams...',
  'Calculating scenic road factor & transit options...',
  'Balancing day fatigue and evening rest slots...',
  'Aligning heritage highlights with your travel tempo...',
  'Finalizing your living, swappable travel journal...'
];

export const PlanningAnimation = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % REAL_STEPS_MICROCOPY.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-lg mx-auto text-center">
      {/* Folded Map & Compass Animation Scene */}
      <div className="relative w-48 h-36 flex items-center justify-center mb-6">
        <FoldedMapIllustration className="w-full h-full text-foreground/80 opacity-90 filter drop-shadow-md" />

        {/* Floating Compass Indicator */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-2 right-4 w-10 h-10 rounded-full bg-card border border-primary/40 shadow-warm flex items-center justify-center text-primary"
        >
          <Compass size={22} className="animate-spin-slow" />
        </motion.div>

        {/* Pulse pin marker */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-12 text-primary"
        >
          <MapPin size={24} className="fill-primary text-primary" />
        </motion.div>
      </div>

      {/* Progress badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
        <Sparkles size={12} />
        <span>Curating Itinerary Blueprint</span>
      </div>

      <h3 className="font-serif-display text-2xl font-bold text-foreground mb-3 tracking-tight">
        Drafting Your Personal Journey
      </h3>

      {/* Cycling Microcopy with smooth AnimatePresence transition */}
      <div className="h-12 relative w-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={REAL_STEPS_MICROCOPY[msgIndex]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-sm text-muted-foreground font-medium absolute leading-relaxed max-w-sm"
          >
            {REAL_STEPS_MICROCOPY[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlanningAnimation;
