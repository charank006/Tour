import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Compass,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Trees,
  Home,
  Star,
  Bed,
  Wifi,
  Users,
} from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export interface ItineraryActivity {
  time?: string;
  title: string;
  description: string;
  duration?: string;
  cost?: number;
  locationType?: string;
  image?: string;
  isTravel?: boolean;
  travelType?: string;
  reason?: string;
  alternative?: {
    name: string;
    description?: string;
    reason: string;
  };
  crowdLevel?: 'Low' | 'Medium' | 'High';
}

export interface DayPlanItem {
  day: number;
  date: string;
  title?: string;
  activities: ItineraryActivity[];
  dailySpend: number;
  weather?: {
    temp: string;
    summary: string;
    tip: string;
  };
}

export interface StayOptionItem {
  type: string;
  name: string;
  rating: number;
  amenities: string[];
  pricePerNight: number;
  image: string;
}

interface TimelineItineraryProps {
  dayPlans?: DayPlanItem[];
  formatCurrency: (amount: number) => string;
  selectedStay?: StayOptionItem;
  stayOptions?: StayOptionItem[];
}

export const TimelineItinerary = ({
  dayPlans = [],
  formatCurrency,
  selectedStay,
  stayOptions,
}: TimelineItineraryProps) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Swapped activities map: key is `${day}-${index}`
  const [swappedMap, setSwappedMap] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleSwap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSwappedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Time-of-day configuration with shifting chronological badges
  const getTimeSlotConfig = (rawTime?: string, index: number = 0) => {
    const t = (rawTime || '').toLowerCase();

    if (t.includes('sunrise') || t.includes('dawn')) {
      return {
        label: 'Sunrise Awakening (06:00 AM – 08:30 AM)',
        icon: Sun,
        iconColor: 'text-[#C4512C]',
        badgeBg: 'bg-[#C4512C]/10 text-[#C4512C] border-[#C4512C]/20',
        cardTint: 'bg-[#C4512C]/[0.03] border-[#C4512C]/15',
        dotColor: 'bg-[#C4512C]',
      };
    }
    if (t.includes('morning') || (index === 0 && !t.includes('afternoon') && !t.includes('sunset') && !t.includes('evening'))) {
      return {
        label: 'Morning Trail (09:00 AM – 11:30 AM)',
        icon: Compass,
        iconColor: 'text-[#2F6F8F]',
        badgeBg: 'bg-[#2F6F8F]/10 text-[#2F6F8F] border-[#2F6F8F]/20',
        cardTint: 'bg-[#2F6F8F]/[0.03] border-[#2F6F8F]/15',
        dotColor: 'bg-[#2F6F8F]',
      };
    }
    if (t.includes('afternoon') || t.includes('midday') || t.includes('lunch') || index === 1) {
      return {
        label: 'Midday Expedition (12:00 PM – 03:30 PM)',
        icon: Coffee,
        iconColor: 'text-amber-800 dark:text-amber-300',
        badgeBg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
        cardTint: 'bg-card border-border/70',
        dotColor: 'bg-amber-600',
      };
    }
    if (t.includes('sunset') || t.includes('golden') || t.includes('twilight') || index === 2) {
      return {
        label: 'Golden Hour Vista (04:30 PM – 07:00 PM)',
        icon: Sunset,
        iconColor: 'text-[#D97706]',
        badgeBg: 'bg-[#D97706]/10 text-[#B45309] border-[#D97706]/20',
        cardTint: 'bg-[#D97706]/[0.03] border-[#D97706]/15',
        dotColor: 'bg-[#D97706]',
      };
    }
    return {
      label: 'Quiet Evening (07:30 PM – 10:00 PM)',
      icon: Moon,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
      cardTint: 'bg-indigo-500/[0.03] border-indigo-500/15',
      dotColor: 'bg-indigo-600',
    };
  };

  if (!Array.isArray(dayPlans) || dayPlans.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-3xl border border-border/80 p-8 shadow-warm">
        <Compass size={32} className="text-primary mx-auto mb-2 animate-pulse" />
        <p className="font-serif-display text-lg font-bold text-foreground">Assembling Day-by-Day Schedule...</p>
        <p className="text-xs text-muted-foreground mt-1">Calibrating optimal sunlight and transit pacing.</p>
      </div>
    );
  }

  const currentDayPlan = dayPlans.find((d) => d.day === activeDay) || dayPlans[0];
  const activeStay = selectedStay || (stayOptions && stayOptions[0]);

  return (
    <div className="space-y-8 mb-16">

      {/* ── Sticky Day Tabs Rail ── */}
      <div className="sticky top-20 z-20 bg-background/95 backdrop-blur-md py-3 border-b border-border/70 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {dayPlans.map((day) => {
            const isActive = day.day === activeDay;
            return (
              <button
                key={day.day}
                type="button"
                onClick={() => setActiveDay(day.day)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-warm'
                    : 'bg-muted/70 text-foreground/75 hover:bg-muted hover:text-foreground border border-border/60'
                }`}
              >
                <span>Day {day.day}</span>
                <span className={`text-[11px] font-normal ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {day.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Day Itinerary Content ── */}
      {currentDayPlan && (
        <div className="space-y-6">

          {/* Weather & Day Header Strip */}
          <div className="bg-card rounded-2xl md:rounded-3xl p-5 md:p-6 border border-border/80 shadow-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <span>Day {currentDayPlan.day} Focus</span>
                <span>•</span>
                <span>{currentDayPlan.date}</span>
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-foreground">
                {currentDayPlan.title || `Day ${currentDayPlan.day} Exploration`}
              </h2>
            </div>

            <div className="flex items-center gap-3 bg-muted/60 px-4 py-2 rounded-2xl border border-border/60 text-xs">
              <Sun size={16} className="text-accent shrink-0" />
              <div>
                <span className="font-bold text-foreground">
                  {currentDayPlan.weather?.temp || '18°C'} • {currentDayPlan.weather?.summary || 'Clear skies'}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {currentDayPlan.weather?.tip || 'Light layers recommended before noon'}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Stay (Base Camp) Header on Day 1 */}
          {currentDayPlan.day === 1 && activeStay && (
            <div className="bg-card rounded-2xl md:rounded-3xl p-5 border border-border/70 shadow-warm flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0">
                <ImageWithFallback
                  src={activeStay.image}
                  alt={activeStay.name}
                  className="w-full h-full object-cover"
                  fallbackIcon={Bed}
                />
              </div>
              <div className="flex-1 text-left w-full">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#355E53] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Base Camp Accommodation
                </span>
                <h4 className="font-serif-display text-lg font-bold text-foreground mt-1">
                  {activeStay.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star size={12} className="text-accent fill-accent" />
                    {activeStay.rating}
                  </span>
                  <span>•</span>
                  <span>{formatCurrency(activeStay.pricePerNight)} / night</span>
                </div>
              </div>
            </div>
          )}

          {/* Vertical Timeline Activity Items */}
          <div className="relative pl-6 sm:pl-10 ml-4 border-l-2 border-border/70 space-y-6">
            {(currentDayPlan.activities || []).map((activity, actIndex) => {
              const uniqueId = `${currentDayPlan.day}-${actIndex}`;
              const isExpanded = expandedId === uniqueId;
              const isSwapped = !!swappedMap[uniqueId];
              const slot = getTimeSlotConfig(activity.time, actIndex);
              const TimeIcon = slot.icon;

              // Swapped data
              const displayTitle = isSwapped && activity.alternative ? activity.alternative.name : activity.title;
              const displayDesc = isSwapped && activity.alternative ? activity.alternative.reason : activity.description;

              return (
                <div key={uniqueId} className="relative group">

                  {/* Shifting Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[47px] top-6 w-3.5 h-3.5 rounded-full border-2 border-background shadow-warm-sm z-10 box-content ${slot.dotColor}`}
                  />

                  {/* Activity Card with Shifting Time-of-Day Ambient Tint */}
                  <div
                    className={`rounded-2xl md:rounded-3xl p-5 md:p-6 border shadow-warm hover:shadow-warm-lg transition-all duration-300 cursor-pointer ${slot.cardTint}`}
                    onClick={() => toggleExpand(uniqueId)}
                  >
                    {/* Header Row: Slot, Time, Cost, and Swap Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${slot.badgeBg}`}>
                          <TimeIcon size={12} />
                          <span>{slot.label}</span>
                        </span>

                        {isSwapped && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Swapped
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded-full">
                          {activity.cost && activity.cost > 0 ? formatCurrency(activity.cost) : 'Included'}
                        </span>

                        {/* Interactive Swap Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleSwap(uniqueId, e)}
                          title="Swap for an alternative activity"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-card hover:bg-muted border border-border/80 text-foreground shadow-warm-sm active:scale-95 transition-all"
                        >
                          <RefreshCw size={11} className="text-primary" />
                          <span>Swap</span>
                        </button>
                      </div>
                    </div>

                    {/* Activity Title & Duration */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif-display text-xl font-bold text-foreground leading-snug">
                          {displayTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 font-medium">
                          {activity.duration && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {activity.duration}
                            </span>
                          )}
                          {activity.locationType && (
                            <span className="flex items-center gap-1">
                              <Trees size={12} />
                              {activity.locationType}
                            </span>
                          )}
                        </p>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`text-muted-foreground transition-transform duration-300 shrink-0 mt-1 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Description preview */}
                    <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
                      {displayDesc}
                    </p>

                    {/* Expandable Deep Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-border/60 space-y-3 text-xs text-muted-foreground leading-relaxed">
                            {activity.reason && (
                              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-foreground">
                                <span className="font-bold text-primary mr-1">Local Insight:</span>
                                {activity.reason}
                              </div>
                            )}

                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-foreground">Recommended arrival:</span>
                              <span>Before peak tourist footfall (before 10:00 AM)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default TimelineItinerary;
