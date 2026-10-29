import { motion } from 'framer-motion';
import { MapPin, Compass, Clock, Award } from 'lucide-react';

const stats = [
  {
    icon: MapPin,
    value: '50+',
    label: 'Verified Destinations',
    sub: 'From Spiti to Munnar',
  },
  {
    icon: Compass,
    value: '180+',
    label: 'Curated Experiences',
    sub: 'Local trails & hidden cafes',
  },
  {
    icon: Award,
    value: '100%',
    label: 'Human-Paced Routes',
    sub: 'No 14-hour bus marathons',
  },
  {
    icon: Clock,
    value: '<15s',
    label: 'Itinerary Generation',
    sub: 'Instant, customizable draft',
  },
];

export const StatsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30 border-y border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border/70 shadow-warm-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3.5">
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div className="font-serif-display text-3xl md:text-4xl font-bold text-foreground mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground mb-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.sub}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
