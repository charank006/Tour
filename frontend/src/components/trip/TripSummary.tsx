import { useState } from 'react';
import { ArrowRight, Calendar, Bookmark, MapPin, Users, Wallet, Share2, Printer, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Destination {
  name: string;
}

interface BudgetBreakdown {
  total: number;
  travel: number;
  stay: number;
  food: number;
  activities: number;
  misc: number;
}

interface TripPlanData {
  destination: Destination;
  totalDays: number;
  travelers: string | number;
  startDate: string;
  endDate: string;
  budgetBreakdown: BudgetBreakdown;
}

interface TripSummaryProps {
  tripPlan: TripPlanData;
  startLocation: string;
  formatCurrency: (amount: number) => string;
  onSave?: () => void;
  isSaved?: boolean;
}

export const TripSummary = ({
  tripPlan,
  startLocation,
  formatCurrency,
  onSave,
  isSaved = false,
}: TripSummaryProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveWithConfetti = () => {
    if (isSaved) return;
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C4512C', '#D85A32', '#D97706', '#355E53'],
      disableForReducedMotion: true,
    });
    if (onSave) onSave();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-warm mb-10"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

        {/* Left Route Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-primary font-bold tracking-widest uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Curated Expedition • Day-by-Day Dispatch</span>
          </div>

          <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex flex-wrap items-center gap-3 mb-3 leading-tight">
            <span>{startLocation}</span>
            <ArrowRight className="text-muted-foreground/40 shrink-0" size={24} />
            <span className="text-primary">{tripPlan.destination.name}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground font-medium">
            <span className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full border border-border/60 text-foreground">
              <Calendar size={14} className="text-primary" />
              <span>
                {new Date(tripPlan.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
              <ArrowRight size={10} className="text-muted-foreground" />
              <span>
                {new Date(tripPlan.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
              <span className="text-muted-foreground font-normal ml-1">({tripPlan.totalDays} Days)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full border border-border/60 text-foreground">
              <Users size={14} className="text-primary" />
              <span>{tripPlan.travelers} Travelers</span>
            </span>

            <span className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full border border-border/60 text-foreground">
              <MapPin size={14} className="text-primary" />
              <span>Round Trip Pacing</span>
            </span>
          </div>
        </div>

        {/* Right Cost & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 w-full lg:w-auto pt-5 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border/60 lg:pl-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1 lg:justify-end">
              <Wallet size={13} className="text-primary" />
              <span>Est. Total Cost</span>
            </div>
            <div className="font-serif-display text-3xl md:text-4xl font-bold text-primary tracking-tight">
              {formatCurrency(tripPlan.budgetBreakdown.total)}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print or save as PDF"
              title="Print Itinerary"
              className="p-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors active:scale-95"
            >
              <Printer size={16} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share trip link"
              title="Copy link to clipboard"
              className="p-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors active:scale-95 relative"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
            </button>

            <button
              type="button"
              onClick={handleSaveWithConfetti}
              disabled={isSaved}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-warm transition-all duration-200 active:scale-95 ${
                isSaved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-primary text-primary-foreground hover:brightness-105'
              }`}
            >
              <Bookmark size={15} />
              <span>{isSaved ? 'Saved to My Trips' : 'Save Itinerary'}</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default TripSummary;
