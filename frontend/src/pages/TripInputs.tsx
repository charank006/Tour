import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Wallet, ArrowRight, Sparkles, User, Heart, Briefcase, PartyPopper } from 'lucide-react';
import { startLocations, travelTypes, budgetRanges } from '@/api/mockData';
import StepIndicator from '@/components/ui/StepIndicator';
import SectionCard from '@/components/ui/SectionCard';
import { motion } from 'framer-motion';

const TripInputs = () => {
  const navigate = useNavigate();
  // Smart defaults: Travelers 2, Budget 'moderate'
  const [formData, setFormData] = useState({
    startLocation: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    travelType: '',
    budget: 'moderate',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startLocation) newErrors.startLocation = 'Select your starting city';
    if (!formData.startDate) newErrors.startDate = 'Select start date';
    if (!formData.endDate) newErrors.endDate = 'Select end date';
    if (!formData.travelType) newErrors.travelType = 'Select travel type';
    if (!formData.budget) newErrors.budget = 'Select your budget range';

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const budget = budgetRanges.find(b => b.value === formData.budget);
      navigate('/suggestions', {
        state: {
          ...formData,
          budgetRange: budget ? { min: budget.min, max: budget.max } : null
        }
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // Helper to calculate duration for display
  const getDurationString = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = end.getTime() - start.getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
      if (days > 0) return `${days}-day trip`;
    }
    return null;
  };

  // UI Mappings
  const budgetLabels: Record<string, string> = {
    budget: "Smart & Simple",
    moderate: "Balanced",
    comfort: "Relaxed",
    luxury: "Indulgent"
  };

  const budgetDescriptions: Record<string, string> = {
    budget: "Cost-effective choices",
    moderate: "Standard comfort",
    comfort: "Premium experiences",
    luxury: "Top-tier luxury"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pt-28 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Sparkles size={20} className="text-accent" />
            <span className="text-sm font-medium tracking-wide text-foreground/80 uppercase">Start Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
          >
            Let’s design your journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg mb-8"
          >
            A few details help us craft the perfect plan for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <StepIndicator currentStep={1} steps={['Plan', 'Preferences', 'Review']} />
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Trip Basics */}
          <SectionCard title="Trip Basics" description="We'll plan a round trip starting and ending here." delay={0.1}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Location */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  Starting Location
                </label>
                <select
                  value={formData.startLocation}
                  onChange={(e) => handleInputChange('startLocation', e.target.value)}
                  className={`w-full p-4 rounded-xl bg-background border-2 transition-all outline-none appearance-none cursor-pointer ${errors.startLocation ? 'border-destructive/50 focus:border-destructive' : 'border-border focus:border-primary/50'
                    }`}
                >
                  <option value="">Select your city</option>
                  {startLocations.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.startLocation && <p className="text-destructive text-xs ml-1">{errors.startLocation}</p>}
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    Dates
                  </label>
                  {getDurationString() && (
                    <span className="text-xs font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                      {getDurationString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={formData.startDate}
                      min={today}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full p-4 rounded-xl bg-background border-2 transition-all outline-none text-sm ${errors.startDate ? 'border-destructive/50' : 'border-border focus:border-primary/50'
                        }`}
                      placeholder="Start"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={formData.endDate}
                      min={formData.startDate || today}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`w-full p-4 rounded-xl bg-background border-2 transition-all outline-none text-sm ${errors.endDate ? 'border-destructive/50' : 'border-border focus:border-primary/50'
                        }`}
                      placeholder="End"
                    />
                  </div>
                </div>
                {(errors.startDate || errors.endDate) && (
                  <p className="text-destructive text-xs ml-1">{errors.startDate || errors.endDate}</p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Section 2: Who's Traveling */}
          <SectionCard title="Who's Traveling" description="This helps us match the right pace and experiences." delay={0.2}>

            <div className="space-y-8">
              {/* Count */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    Number of Travelers
                  </label>
                  <span className="text-sm text-muted-foreground">{formData.travelers === 1 ? 'Just me' : `${formData.travelers} people`}</span>
                </div>

                <div className="flex items-center gap-6 bg-secondary/30 p-2 pl-6 rounded-2xl border border-border/50 w-max shadow-sm backdrop-blur-sm">
                  <span className="w-8 text-center font-bold text-2xl tabular-nums text-foreground">{formData.travelers}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleInputChange('travelers', Math.max(1, formData.travelers - 1))}
                      className="w-10 h-10 rounded-xl bg-background hover:bg-white text-foreground shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-border"
                    >
                      <span className="text-xl font-medium">-</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('travelers', Math.min(10, formData.travelers + 1))}
                      className="w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-orange flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    >
                      <span className="text-xl font-medium">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Travel Style</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {travelTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('travelType', type.value)}
                      className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-md ${formData.travelType === type.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/30 bg-background'
                        }`}
                    >
                      <div className={`text-2xl mb-3 transition-transform duration-300 ${formData.travelType === type.value ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {type.icon}
                      </div>
                      <div className="font-semibold text-foreground text-sm">{type.label}</div>
                    </button>
                  ))}
                </div>
                {errors.travelType && <p className="text-destructive text-xs ml-1">{errors.travelType}</p>}
              </div>

            </div>
          </SectionCard>

          {/* Section 3: Budget */}
          <SectionCard title="Comfort & Budget" description="Choose your preferred comfort level." delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {budgetRanges.map((range) => {
                const isActive = formData.budget === range.value;
                return (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => handleInputChange('budget', range.value)}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg ${isActive
                      ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                      : 'border-border hover:border-accent/30 bg-background'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Wallet size={20} className={isActive ? 'text-accent' : 'text-muted-foreground'} />
                      {isActive && <div className="w-2 h-2 rounded-full bg-accent" />}
                    </div>

                    <div className="font-bold text-foreground mb-1">
                      {budgetLabels[range.value] || range.label}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mb-3">
                      {range.range}
                    </div>
                    <p className="text-[10px] text-muted-foreground/70 leading-tight">
                      {budgetDescriptions[range.value]}
                    </p>
                  </button>
                );
              })}
            </div>
            {errors.budget && <p className="text-destructive text-xs ml-1 mt-2">{errors.budget}</p>}
          </SectionCard>

          {/* CTA & Microcopy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-8 text-center space-y-4"
          >
            <button
              type="submit"
              className="btn-primary w-full md:w-auto md:min-w-[300px] text-lg px-8 py-4 rounded-full shadow-orange hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group inline-flex items-center justify-center gap-2"
            >
              Design My Trip
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-muted-foreground animate-pulse">
              Takes less than 10 seconds
            </p>
          </motion.div>

        </form>
      </div>
    </div>
  );
};

export default TripInputs;
