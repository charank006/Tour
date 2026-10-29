import { useState } from 'react';
import { MapPin, Navigation, Compass, Mountain, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapSectionProps {
  destination: string;
}

const mapStops = [
  { id: 1, title: 'Arrival & Valley Point', time: '08:30 AM', desc: 'Starting vista and morning tea stop' },
  { id: 2, title: 'Solang Ridge Trail', time: '11:00 AM', desc: 'Alpine pine forest & valley view' },
  { id: 3, title: 'Old Cedar Wood Haunt', time: '02:30 PM', desc: 'Sheltered village handicraft hub' },
  { id: 4, title: 'Nahargarh Twilight Wall', time: '05:45 PM', desc: 'Sunset panorama & return base' },
];

export const MapSection = ({ destination }: MapSectionProps) => {
  const [activeStop, setActiveStop] = useState<number>(1);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-1">
            <Compass size={14} />
            <span>Topographic Route Overview</span>
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-foreground">
            The {destination} Scenic Loop
          </h2>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline bg-muted px-3 py-1 rounded-full border border-border/60">
          48 km • 4 Curated Stops
        </span>
      </div>

      <div className="bg-card rounded-3xl border border-border/80 shadow-warm overflow-hidden p-6 md:p-8">
        {/* Topographic Visual Canvas */}
        <div className="relative w-full h-72 md:h-80 bg-[#16202C] rounded-2xl overflow-hidden mb-6 flex items-center justify-center text-white">
          {/* Subtle topographic contour lines SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60 Q 200 120, 450 60 T 900 80 M0 140 Q 250 180, 500 120 T 900 160 M0 220 Q 300 240, 600 180 T 900 240"
              stroke="#FAF7F2"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* Dotted Route connecting numbered pins */}
          <div className="absolute inset-x-8 md:inset-x-20 top-1/2 -translate-y-1/2 flex items-center justify-between z-10">
            {mapStops.map((stop) => {
              const isActive = activeStop === stop.id;
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setActiveStop(stop.id)}
                  className="flex flex-col items-center gap-2 group focus:outline-none"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-serif-display font-bold text-sm md:text-base transition-all duration-300 shadow-warm ${
                      isActive
                        ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/30'
                        : 'bg-card text-foreground hover:bg-primary/20 hover:text-white border border-white/20'
                    }`}
                  >
                    {stop.id}
                  </div>
                  <span className={`text-[11px] font-semibold tracking-wide hidden sm:block ${
                    isActive ? 'text-[#E06943]' : 'text-stone-300/70'
                  }`}>
                    {stop.time}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-6 flex items-center gap-2 text-xs text-stone-300/80">
            <Mountain size={14} className="text-[#E06943]" />
            <span>Curated loop paced for minimal backtrack driving</span>
          </div>
        </div>

        {/* Active Stop Details */}
        <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
              {activeStop}
            </div>
            <div>
              <h4 className="font-serif-display text-base font-bold text-foreground">
                {mapStops[activeStop - 1].title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {mapStops[activeStop - 1].desc} • Expected arrival {mapStops[activeStop - 1].time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <CheckCircle size={14} />
            <span>Stop #{activeStop} in sequence</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
