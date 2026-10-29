import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Sparkles, Compass } from 'lucide-react';

const moodChips = [
  { id: 'mountains', label: 'Misty Mountains', icon: '🏔️' },
  { id: 'coastal', label: 'Warm Coast', icon: '🌊' },
  { id: 'heritage', label: 'Forts & Heritage', icon: '🏯' },
  { id: 'quiet', label: 'Slow & Quiet', icon: '🌿' },
];

export const Hero = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState('2');
  const [selectedMood, setSelectedMood] = useState('mountains');

  // Hero parallax container
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 160]);
  const contentOpacity = useTransform(scrollY, [0, 320], [1, 0]);

  // Postcard 3D mouse tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/plan', {
      state: {
        destination,
        travelers: Number(travelers) || 2,
        mood: selectedMood,
      },
    });
  };

  const words = ['Journeys', 'designed', 'for', 'the', 'slow', 'wanderer.'];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background Layer: High-res scenic Himalayan dawn with warm grading */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: prefersReducedMotion ? 1 : 1.08 }}
      >
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=2400&auto=format&fit=crop"
          alt="Mist drifting over mountain valleys at sunrise"
          className="w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.02]"
        />
        {/* Warm editorial gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B121A]/65 via-[#0B121A]/40 to-[#0B121A]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B121A]/50 via-transparent to-[#0B121A]/50" />
      </motion.div>

      {/* Floating Tilting Postcard (Desktop right accent) */}
      <div
        className="hidden xl:block absolute right-12 top-36 z-20 w-72 pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{
            rotateX: tilt.y,
            rotateY: tilt.x,
            rotateZ: 3,
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="p-3.5 bg-white rounded-2xl shadow-polaroid border border-stone-200/90 text-[#131D28] transform cursor-default select-none"
        >
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=85&w=600&auto=format&fit=crop"
              alt="Misty tea gardens of Munnar at first light"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              Field Note #14
            </div>
          </div>
          <div className="px-1 flex items-start justify-between">
            <div>
              <p className="font-serif-display font-bold text-sm text-[#131D28]">
                Munnar Ridge at 6:15 AM
              </p>
              <p className="text-[12px] text-stone-500 font-sans">
                Chai stall owner opens when the valley clears
              </p>
            </div>
            <span className="font-handwriting text-lg text-primary font-bold -rotate-3">
              Must visit!
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Hero Content */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl"
        style={{ opacity: contentOpacity }}
      >
        {/* Subtle Brand Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs md:text-sm font-medium mb-6"
        >
          <Compass size={15} className="text-accent" />
          <span>Intelligent Travel Planning • India & Beyond</span>
        </motion.div>

        {/* Serif Headline with word-by-word reveal */}
        <h1 className="font-serif-display text-fluid-hero font-bold text-white mb-6 tracking-tight leading-[1.05]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-[0.25em] last:mr-0"
            >
              {word === 'slow' ? (
                <span className="italic font-normal text-[#E06943] squiggle-underline">
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        {/* Short, human editorial subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="text-base sm:text-lg md:text-xl text-stone-200/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Curated daily itineraries that match your tempo. Real crowd timetables, weather-aware alternatives, and neighborhood food trails.
        </motion.p>

        {/* Floating Search Card (Sand surface, gentle drop shadow, prefilled handoff) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto bg-card rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-warm-xl border border-border/70 text-left"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2.5 items-stretch">
            {/* Destination Input */}
            <div className="flex-1 px-4 py-3 rounded-xl bg-muted/60 hover:bg-muted/80 transition-colors border border-border/40 focus-within:border-primary focus-within:bg-background">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5 flex items-center gap-1.5">
                <MapPin size={12} className="text-primary" />
                Where to?
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Manali, Jaipur, Munnar, Goa..."
                className="w-full bg-transparent border-none text-foreground text-sm md:text-base font-semibold placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>

            {/* Travelers Selector */}
            <div className="w-full md:w-56 md:min-w-[215px] px-4 py-3 rounded-xl bg-muted/60 hover:bg-muted/80 transition-colors border border-border/40 focus-within:border-primary focus-within:bg-background">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5 flex items-center gap-1.5">
                <Users size={12} className="text-primary" />
                Travelers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full bg-transparent border-none text-foreground text-sm md:text-base font-semibold focus:outline-none cursor-pointer pr-4"
              >
                <option value="1">1 Traveler (Solo)</option>
                <option value="2">2 Travelers (Duo)</option>
                <option value="3">3 Travelers (Small group)</option>
                <option value="4">4+ Travelers (Family/Group)</option>
              </select>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="bg-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl md:rounded-2xl shadow-warm hover:brightness-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shrink-0 text-sm md:text-base"
            >
              <span>Explore Plans</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Quick Mood Chips */}
          <div className="mt-3.5 pt-3 border-t border-border/50 flex flex-wrap items-center gap-2 px-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
              Popular Vibes:
            </span>
            {moodChips.map((chip) => {
              const active = selectedMood === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedMood(chip.id)}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-primary/15 text-primary border border-primary/30 font-semibold'
                      : 'bg-muted/50 text-foreground/75 hover:bg-muted hover:text-foreground border border-border/30'
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Editorial trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 text-xs text-stone-300/75 flex items-center justify-center gap-4 flex-wrap"
        >
          <span>• No cookie-cutter tours</span>
          <span>• Real road and crowd times</span>
          <span>• Free to plan and customize</span>
        </motion.p>
      </motion.div>

      {/* Gentle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50 text-[11px] uppercase tracking-widest pointer-events-none"
      >
        <span>Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1 h-5 rounded-full bg-white/40"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
