import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Sun, Users, Wallet, RefreshCw, Clock, Sparkles } from 'lucide-react';

export const SmartFeaturesBento = () => {
  // Feature 1: Weather toggle
  const [isRainy, setIsRainy] = useState(false);

  // Feature 4: Swap activity demo
  const [swapped, setSwapped] = useState(false);

  // Feature 3: Budget demo slider
  const [budgetTotal, setBudgetTotal] = useState(24000);

  const stayShare = Math.round(budgetTotal * 0.38);
  const travelShare = Math.round(budgetTotal * 0.28);
  const foodShare = Math.round(budgetTotal * 0.22);
  const experiencesShare = Math.round(budgetTotal * 0.12);

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <section className="py-24 md:py-32 bg-muted/40 relative">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Under the Hood
            </span>
          </div>
          <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
            Smart features that protect your vacation
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
            Every itinerary anticipates weather changes, bypasses crowd surges, and keeps your budget crystal clear.
          </p>
        </div>

        {/* 4 Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto">

          {/* ── Feature 1: Weather-Aware Planning (7 cols) ── */}
          <div className="md:col-span-7 bg-card rounded-3xl p-7 md:p-8 border border-border/80 shadow-warm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Adaptive Intelligence
                </span>
                {/* Weather Toggle */}
                <div className="flex items-center p-1 bg-muted rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => setIsRainy(false)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      !isRainy ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sun size={13} className="text-accent" />
                    <span>Sunny (24°C)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRainy(true)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isRainy ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <CloudRain size={13} className="text-sky" />
                    <span>Mist / Rain (16°C)</span>
                  </button>
                </div>
              </div>

              <h3 className="font-serif-display text-2xl font-bold text-foreground mb-2">
                Weather-Aware Itinerary Shifts
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                When weather forecasts forecast downpours, outdoor viewpoints swap automatically to sheltered heritage havelis or tea houses.
              </p>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">Day 2 • 10:00 AM Slot</span>
                <span className="text-[11px] font-medium text-primary">Live adjustment</span>
              </div>

              <AnimatePresence mode="wait">
                {!isRainy ? (
                  <motion.div
                    key="sunny"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent-text flex items-center justify-center shrink-0">
                      <Sun size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">
                        Ridge Pine Walk & Valley Panorama
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Clear skies expected • Best visibility before 11:30 AM
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="rainy"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky/15 text-sky flex items-center justify-center shrink-0">
                      <CloudRain size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">
                        Woodcarving Workshop & Fireside Chai
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Indoor sheltered cultural experience • Cozy local artisan stop
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Feature 2: Crowd Timelines (5 cols) ── */}
          <div className="md:col-span-5 bg-card rounded-3xl p-7 md:p-8 border border-border/80 shadow-warm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#355E53]">
                Pacing Control
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-foreground mt-2 mb-2">
                Crowd Density Timelines
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Know exact peak windows so you visit Taj Mahal, Amber Fort, or Solang Valley when peaceful.
              </p>
            </div>

            {/* Micro Crowd Graph */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60">
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Users size={13} className="text-primary" />
                  Hourly Footfall
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Best window: 7:00 AM
                </span>
              </div>

              {/* Bar visualization */}
              <div className="flex items-end gap-2 h-20 pt-2 border-b border-border/60 pb-1">
                {[
                  { time: '6 AM', val: 15, quiet: true },
                  { time: '8 AM', val: 32, quiet: true },
                  { time: '11 AM', val: 78, quiet: false },
                  { time: '1 PM', val: 95, peak: true },
                  { time: '4 PM', val: 65, quiet: false },
                  { time: '6 PM', val: 40, quiet: true },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        bar.peak
                          ? 'bg-destructive/80'
                          : bar.quiet
                          ? 'bg-emerald-600/75'
                          : 'bg-muted-foreground/40'
                      }`}
                      style={{ height: `${bar.val}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {bar.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Feature 3: Live Budget Split (5 cols) ── */}
          <div className="md:col-span-5 bg-card rounded-3xl p-7 md:p-8 border border-border/80 shadow-warm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-text">
                Zero Surprises
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-foreground mt-2 mb-2">
                Honest Budget Split
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Transparent cost allocations across stay, transport, dining, and activities before you book.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground font-medium">Estimated 3-Day Cost</span>
                <span className="font-serif-display font-bold text-lg text-primary">
                  {formatINR(budgetTotal)}
                </span>
              </div>

              {/* Stacked Bar */}
              <div className="h-3 rounded-full overflow-hidden flex bg-border/50">
                <div style={{ width: '38%' }} className="bg-[#C4512C]" title="Stays 38%" />
                <div style={{ width: '28%' }} className="bg-[#2F6F8F]" title="Transport 28%" />
                <div style={{ width: '22%' }} className="bg-[#B45309]" title="Food 22%" />
                <div style={{ width: '12%' }} className="bg-[#355E53]" title="Activities 12%" />
              </div>

              {/* Legend with exact INR */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C4512C]" />
                  <span className="text-muted-foreground">Stay:</span>
                  <span className="font-bold text-foreground">{formatINR(stayShare)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2F6F8F]" />
                  <span className="text-muted-foreground">Transit:</span>
                  <span className="font-bold text-foreground">{formatINR(travelShare)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                  <span className="text-muted-foreground">Food:</span>
                  <span className="font-bold text-foreground">{formatINR(foodShare)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#355E53]" />
                  <span className="text-muted-foreground">Sightseeing:</span>
                  <span className="font-bold text-foreground">{formatINR(experiencesShare)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Feature 4: One-Click Swap Activity (7 cols) ── */}
          <div className="md:col-span-7 bg-card rounded-3xl p-7 md:p-8 border border-border/80 shadow-warm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Ultimate Flexibility
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles size={12} className="text-accent" />
                  Try swapping below
                </span>
              </div>

              <h3 className="font-serif-display text-2xl font-bold text-foreground mb-2">
                Instant "Swap This Activity"
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Not feeling a strenuous trek? One click replaces it with a scenic cable car or heritage cafe without breaking your schedule.
              </p>
            </div>

            {/* Live Swap Demonstration */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <AnimatePresence mode="wait">
                {!swapped ? (
                  <motion.div
                    key="original"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Option A • High Energy</span>
                    <h4 className="font-bold text-foreground text-sm mt-0.5">White Water River Rafting (Grade III)</h4>
                    <p className="text-xs text-muted-foreground">2.5 hours • Rishikesh Brahmpuri stretch</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="swapped"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#355E53]">Option B • Leisure History</span>
                    <h4 className="font-bold text-foreground text-sm mt-0.5">Beatles Ashram & Forest Meditation</h4>
                    <p className="text-xs text-muted-foreground">2 hours • Quiet woodland walk & heritage murals</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setSwapped(!swapped)}
                className="inline-flex items-center gap-2 bg-card hover:bg-background border border-border px-4 py-2.5 rounded-full text-xs font-bold text-foreground shadow-warm-sm hover:shadow-warm active:scale-95 transition-all shrink-0"
              >
                <RefreshCw size={13} className="text-primary" />
                <span>{swapped ? 'Revert to Rafting' : 'Swap Activity'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SmartFeaturesBento;
