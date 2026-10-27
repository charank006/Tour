import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Calendar, Users, Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { startLocations, travelTypes, budgetRanges } from '@/api/mockData';
import { motion } from 'framer-motion';

const budgetLabels: Record<string, string> = {
  budget: 'Smart & Simple', moderate: 'Balanced', comfort: 'Relaxed', luxury: 'Indulgent',
};
const budgetDescriptions: Record<string, string> = {
  budget: 'Cost-effective choices', moderate: 'Standard comfort', comfort: 'Premium experiences', luxury: 'Top-tier luxury',
};
const budgetColors: Record<string, string> = {
  budget: 'from-emerald-400/20 to-emerald-600/10',
  moderate: 'from-blue-400/20 to-blue-600/10',
  comfort: 'from-purple-400/20 to-purple-600/10',
  luxury: 'from-amber-400/20 to-amber-600/10',
};

/** Animated section card with left accent bar and step number */
const SectionCard = ({ step, title, description, delay = 0, children }: { step: string; title: string; description?: string; delay?: number; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative bg-card border border-border/60 rounded-3xl p-8 shadow-soft hover:shadow-card transition-shadow duration-300 overflow-hidden"
  >
    {/* Left accent stripe */}
    <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-accent via-accent/60 to-transparent rounded-r-full" />

    <div className="flex items-start gap-4 mb-6">
      <span className="text-xs font-black text-accent/40 tracking-widest mt-1 select-none">{step}</span>
      <div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
    {children}
  </motion.div>
);

const TripInputs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destinationData = location.state;

  const [formData, setFormData] = useState({
    startLocation: '', startDate: '', endDate: '', travelers: 2, travelType: '', budget: 'moderate',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Progress: count filled fields out of 5 required
  const filledCount = [formData.startLocation, formData.startDate, formData.endDate, formData.travelType, formData.budget].filter(Boolean).length;
  const progress = Math.round((filledCount / 5) * 100);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.startLocation) newErrors.startLocation = 'Select your starting city';
    if (!formData.startDate) newErrors.startDate = 'Select start date';
    if (!formData.endDate) newErrors.endDate = 'Select end date';
    if (!formData.travelType) newErrors.travelType = 'Select travel type';
    if (!formData.budget) newErrors.budget = 'Select your budget range';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate))
      newErrors.endDate = 'End date must be after start date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const budget = budgetRanges.find(b => b.value === formData.budget);
    if (destinationData?.destination) {
      navigate('/trip-plan', { state: { ...formData, destination: destinationData.destination, destinationId: destinationData.destinationId, selectedPlaceIds: destinationData.selectedPlaceIds, budgetRange: budget ? { min: budget.min, max: budget.max } : null, isManualPlan: true } });
    } else {
      navigate('/suggestions', { state: { ...formData, budgetRange: budget ? { min: budget.min, max: budget.max } : null } });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const getDurationString = () => {
    if (formData.startDate && formData.endDate) {
      const days = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24)) + 1;
      if (days > 0) return `${days}-day trip`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-accent" />
            <span className="text-sm font-semibold tracking-widest text-foreground/60 uppercase">Start Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
          >
            {destinationData?.destination
              ? <>Plan your trip to <span className="text-gradient-brand">{destinationData.destination.name}</span></>
              : "Let's design your journey"}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg">
            A few details help us craft the perfect plan for you.
          </motion.p>

          {/* Progress bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span className="font-semibold text-accent">{progress}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent to-amber-400"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Section 1: Trip Basics */}
          <SectionCard step="01" title="Trip Basics" description="We'll plan a round trip starting and ending here." delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin size={15} className="text-accent" /> Starting Location
                </label>
                <select
                  value={formData.startLocation}
                  onChange={e => handleInputChange('startLocation', e.target.value)}
                  className={`w-full p-4 rounded-xl bg-background border-2 transition-all outline-none appearance-none cursor-pointer ${errors.startLocation ? 'border-destructive/50' : 'border-border focus:border-accent/60 focus:shadow-[0_0_0_4px_hsl(38_92%_50%/0.10)]'}`}
                >
                  <option value="">Select your city</option>
                  {startLocations.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                {errors.startLocation && <p className="text-destructive text-xs">{errors.startLocation}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar size={15} className="text-accent" /> Dates
                  </label>
                  {getDurationString() && (
                    <span className="text-xs font-bold text-accent px-2.5 py-1 rounded-full bg-accent/10 animate-scale-in">
                      {getDurationString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <input type="date" value={formData.startDate} min={today}
                    onChange={e => handleInputChange('startDate', e.target.value)}
                    className={`flex-1 p-4 rounded-xl bg-background border-2 transition-all outline-none text-sm ${errors.startDate ? 'border-destructive/50' : 'border-border focus:border-accent/60'}`}
                  />
                  <input type="date" value={formData.endDate} min={formData.startDate || today}
                    onChange={e => handleInputChange('endDate', e.target.value)}
                    className={`flex-1 p-4 rounded-xl bg-background border-2 transition-all outline-none text-sm ${errors.endDate ? 'border-destructive/50' : 'border-border focus:border-accent/60'}`}
                  />
                </div>
                {(errors.startDate || errors.endDate) && <p className="text-destructive text-xs">{errors.startDate || errors.endDate}</p>}
              </div>
            </div>
          </SectionCard>

          {/* Section 2: Who's Traveling */}
          <SectionCard step="02" title="Who's Traveling" description="This helps us match the right pace and experiences." delay={0.2}>
            <div className="space-y-7">
              {/* Traveler count */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users size={15} className="text-accent" /> Number of Travelers
                  </label>
                  <span className="text-sm font-semibold text-accent">{formData.travelers === 1 ? 'Just me' : `${formData.travelers} people`}</span>
                </div>
                <div className="flex items-center gap-5 bg-secondary/20 p-2 pl-6 rounded-2xl border border-border/40 w-max">
                  <span className="w-8 text-center font-black text-2xl tabular-nums text-foreground">{formData.travelers}</span>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => handleInputChange('travelers', Math.max(1, formData.travelers - 1))}
                      className="w-11 h-11 rounded-xl bg-background hover:bg-white text-foreground shadow-soft flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-border text-xl font-medium">−</button>
                    <button type="button" onClick={() => handleInputChange('travelers', Math.min(10, formData.travelers + 1))}
                      className="w-11 h-11 rounded-xl bg-primary text-primary-foreground shadow-orange flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-xl font-medium">+</button>
                  </div>
                </div>
              </div>

              {/* Travel style */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Travel Style</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {travelTypes.map(type => (
                    <button key={type.value} type="button" onClick={() => handleInputChange('travelType', type.value)}
                      className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${formData.travelType === type.value ? 'border-accent bg-accent/[0.08] shadow-[0_0_0_4px_rgba(245,158,11,0.12)]' : 'border-border hover:border-accent/30 bg-background'}`}
                    >
                      {formData.travelType === type.value && (
                        <motion.div layoutId="travel-type-bg" className="absolute inset-0 rounded-2xl bg-accent/5" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />
                      )}
                      <div className={`text-2xl mb-2 transition-transform duration-300 ${formData.travelType === type.value ? 'scale-125' : 'group-hover:scale-110'}`}>{type.icon}</div>
                      <div className="font-semibold text-foreground text-sm relative z-10">{type.label}</div>
                    </button>
                  ))}
                </div>
                {errors.travelType && <p className="text-destructive text-xs mt-2">{errors.travelType}</p>}
              </div>
            </div>
          </SectionCard>

          {/* Section 3: Budget */}
          <SectionCard step="03" title="Comfort & Budget" description="Choose your preferred comfort level." delay={0.3}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {budgetRanges.map(range => {
                const isActive = formData.budget === range.value;
                return (
                  <button key={range.value} type="button" onClick={() => handleInputChange('budget', range.value)}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden ${isActive ? 'border-accent shadow-[0_0_0_4px_rgba(245,158,11,0.15)]' : 'border-border hover:border-accent/30 bg-background'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="budget-bg"
                        className={`absolute inset-0 bg-gradient-to-br ${budgetColors[range.value]} opacity-80`}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      />
                    )}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <Wallet size={18} className={isActive ? 'text-accent' : 'text-muted-foreground'} />
                        {isActive && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-accent" />}
                      </div>
                      <div className="font-bold text-foreground text-sm mb-1">{budgetLabels[range.value] || range.label}</div>
                      <div className="text-xs text-muted-foreground mb-2">{range.range}</div>
                      <p className="text-[10px] text-muted-foreground/60 leading-tight">{budgetDescriptions[range.value]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.budget && <p className="text-destructive text-xs mt-2">{errors.budget}</p>}
          </SectionCard>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-6 text-center space-y-4">
            <button type="submit"
              className="btn-primary w-full md:w-auto md:min-w-[320px] text-lg px-10 py-4 rounded-full group inline-flex items-center justify-center gap-2"
            >
              Design My Trip
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            <p className="text-xs text-muted-foreground">Takes less than 10 seconds &nbsp;·&nbsp; No sign-up needed</p>
          </motion.div>

        </form>
      </div>
    </div>
  );
};

export default TripInputs;
