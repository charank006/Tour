import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Wallet, ArrowRight, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { startLocations, travelTypes, budgetRanges } from '@/api/mockData';
import { motion } from 'framer-motion';

import { tripStore } from '@/lib/tripStore';
import { calculateDays } from '@/lib/formatters';

const budgetDetails: Record<string, { label: string; desc: string; inr: string }> = {
  budget: { label: 'Smart Explorer', desc: 'Authentic homestays, trains & local food', inr: '₹5,000 – ₹15,000' },
  moderate: { label: 'Balanced Traveler', desc: 'Boutique stays, cabs & top cafes', inr: '₹15,000 – ₹30,000' },
  comfort: { label: 'Relaxed Living', desc: 'Heritage hotels, flights & private guides', inr: '₹30,000 – ₹50,000' },
  luxury: { label: 'Royal Indulgence', desc: 'Luxury palaces, chauffeur & fine dining', inr: '₹50,000+' },
};

export const TripInputs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stored = tripStore.getState().inputs;
  const incomingData = location.state || {};

  const rawDest = incomingData.destination || stored.destination || '';
  const initialDestination = typeof rawDest === 'object' && rawDest !== null ? rawDest.name : (typeof rawDest === 'string' ? rawDest : '');
  const [targetDestination, setTargetDestination] = useState<string>(initialDestination);

  const [formData, setFormData] = useState({
    startLocation: incomingData.startLocation || stored.startLocation || 'Mumbai',
    startDate: incomingData.startDate || stored.startDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    endDate: incomingData.endDate || stored.endDate || new Date(Date.now() + 86400000 * 11).toISOString().split('T')[0],
    travelers: incomingData.travelers || stored.travelers || 2,
    travelType: incomingData.travelType || stored.travelType || 'couple',
    budget: incomingData.budget || stored.budget || 'moderate',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      tripStore.saveInputs(next);
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const filledCount = [formData.startLocation, formData.startDate, formData.endDate, formData.travelType, formData.budget].filter(Boolean).length;
  const progress = Math.round((filledCount / 5) * 100);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.startLocation) newErrors.startLocation = 'Please choose your starting city';
    if (!formData.startDate) newErrors.startDate = 'Pick departure date';
    if (!formData.endDate) newErrors.endDate = 'Pick return date';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Return date must be after departure date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const selectedBudget = budgetRanges.find((b) => b.value === formData.budget);
    const budgetRange = selectedBudget ? { min: selectedBudget.min, max: selectedBudget.max } : { min: 15000, max: 30000 };

    const payload = {
      ...formData,
      destination: targetDestination ? { name: targetDestination } : (incomingData.destination || stored.destination || null),
      mood: incomingData.mood || stored.mood || 'mountains',
      budgetRange
    };

    tripStore.saveInputs(payload);

    navigate('/suggestions', {
      state: payload
    });
  };

  const durationDays = calculateDays(formData.startDate, formData.endDate);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 selection:bg-primary/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">

        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Editorial Stepper Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles size={13} />
            <span>Step 1 of 3 • Trip Blueprint</span>
          </div>

          <h1 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12] mb-3">
            Design your ideal itinerary
          </h1>

          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            A few thoughtful preferences help our engine eliminate tourist traps and align with your pace.
          </p>

          {/* Progress Indicator with encouraging microcopy */}
          <div className="mt-8 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
              <span>Blueprint readiness</span>
              <span className="font-bold text-primary">{progress}% complete</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Locked / Preferred Destination Indicator */}
          {targetDestination && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-4 md:p-5 border border-primary/25 shadow-warm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Destination Focus</div>
                  <div className="text-base sm:text-lg font-serif-display font-bold text-foreground">
                    {targetDestination}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTargetDestination('')}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted border border-border/60 transition-all shrink-0"
              >
                Clear / Suggest All
              </button>
            </motion.div>
          )}

          {/* Section 1: Departure & Dates */}
          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-warm">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="font-serif-display text-2xl font-bold text-muted-foreground/40">01</span>
              <div>
                <h3 className="font-serif-display text-xl font-bold text-foreground">Starting Point & Dates</h3>
                <p className="text-xs text-muted-foreground">We calibrate transport timings from your home city.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Origin City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  Origin City
                </label>
                <select
                  value={formData.startLocation}
                  onChange={(e) => handleInputChange('startLocation', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border/80 bg-background text-foreground text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {startLocations.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.startLocation && (
                  <p className="text-xs text-destructive mt-1.5">{errors.startLocation}</p>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    Trip Dates
                  </label>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {durationDays} Days
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="flex-1 h-12 px-3.5 rounded-xl border border-border/80 bg-background text-foreground text-xs md:text-sm font-medium focus:outline-none focus:border-primary"
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="flex-1 h-12 px-3.5 rounded-xl border border-border/80 bg-background text-foreground text-xs md:text-sm font-medium focus:outline-none focus:border-primary"
                  />
                </div>
                {errors.endDate && (
                  <p className="text-xs text-destructive mt-1.5">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Travel Party & Style */}
          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-warm">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="font-serif-display text-2xl font-bold text-muted-foreground/40">02</span>
              <div>
                <h3 className="font-serif-display text-xl font-bold text-foreground">Who is Traveling</h3>
                <p className="text-xs text-muted-foreground">Adjusts walking pace, kid-friendly spots, and room configurations.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Traveler Counter */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    Group Size
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {formData.travelers === 1 ? 'Solo explorer' : `${formData.travelers} companions`}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-2xl w-fit border border-border/60">
                  <button
                    type="button"
                    onClick={() => handleInputChange('travelers', Math.max(1, formData.travelers - 1))}
                    className="w-10 h-10 rounded-xl bg-card hover:bg-background text-foreground border border-border font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xl tabular-nums text-foreground">
                    {formData.travelers}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('travelers', Math.min(8, formData.travelers + 1))}
                    className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-warm-sm active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Group Type Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Travel Companion Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {travelTypes.map((type) => {
                    const active = formData.travelType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('travelType', type.value)}
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                          active
                            ? 'border-primary bg-primary/10 shadow-warm-sm'
                            : 'border-border/80 bg-background hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-2xl mb-1.5">{type.icon}</span>
                        <span className={`text-sm font-bold ${active ? 'text-primary' : 'text-foreground'}`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Comfort & Budget Tier */}
          <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-warm">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="font-serif-display text-2xl font-bold text-muted-foreground/40">03</span>
              <div>
                <h3 className="font-serif-display text-xl font-bold text-foreground">Comfort & Budget Tier</h3>
                <p className="text-xs text-muted-foreground">Real total per person, including stays, transit, meals and admissions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {budgetRanges.map((range) => {
                const active = formData.budget === range.value;
                const info = budgetDetails[range.value];
                return (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => handleInputChange('budget', range.value)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 relative ${
                      active
                        ? 'border-primary bg-primary/10 shadow-warm-sm ring-1 ring-primary'
                        : 'border-border/80 bg-background hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className={`font-serif-display font-bold text-base ${active ? 'text-primary' : 'text-foreground'}`}>
                        {info.label}
                      </span>
                      <span className="text-xs font-bold text-foreground/80">{info.inr}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Action Submit */}
          <div className="pt-4 text-center space-y-3">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[280px] bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full shadow-warm hover:brightness-105 active:scale-[0.98] transition-all text-base inline-flex items-center justify-center gap-2"
            >
              <span>Curate Destinations</span>
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-muted-foreground">
              Step 2 will show destination matches tailored to this budget
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};

export default TripInputs;
