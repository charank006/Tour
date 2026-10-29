import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Compass, CalendarCheck, Sparkles, Navigation } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Share your rhythm & starting point',
    description:
      'Tell us who is traveling, your comfort budget, and whether you crave cold mountain air or coastal quiet.',
    tip: 'No generic questions — just what actually shapes a trip.',
    icon: Compass,
    accent: '#C4512C',
  },
  {
    step: '02',
    title: 'We map crowd windows & sunrise stops',
    description:
      'Our engine balances driving distances, matches morning light for viewpoints, and filters out midday tourist jams.',
    tip: 'Know when locals go vs when tourist buses arrive.',
    icon: CalendarCheck,
    accent: '#355E53',
  },
  {
    step: '03',
    title: 'Receive your living, swappable journal',
    description:
      'A seamless day-by-day plan with transport, stays, budget splits, and one-click alternatives whenever plans change.',
    tip: 'Export to PDF, share with friends, or tweak on the go.',
    icon: Sparkles,
    accent: '#B45309',
  },
];

export const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 35%'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const iconProgress = useTransform(scrollYProgress, [0, 1], ['0%', '92%']);

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              The Journey Method
            </span>
          </div>
          <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
            How thoughtful itineraries come to life
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Travel shouldn't feel like logistics homework. Here is how we turn a blank map into your personalized expedition in seconds.
          </p>
        </div>

        {/* Steps with Journey Line */}
        <div className="relative max-w-5xl mx-auto">

          {/* Dotted Journey SVG Line (Desktop) */}
          <div className="hidden lg:block absolute left-0 right-0 top-24 h-12 pointer-events-none -z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 900 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background faint guide line */}
              <path
                d="M 120 30 Q 300 0, 450 30 T 780 30"
                stroke="currentColor"
                className="text-border"
                strokeWidth="2"
                strokeDasharray="6 8"
              />

              {/* Animated active path */}
              {!prefersReducedMotion && (
                <motion.path
                  d="M 120 30 Q 300 0, 450 30 T 780 30"
                  stroke="#C4512C"
                  strokeWidth="2.5"
                  strokeDasharray="6 8"
                  style={{ pathLength }}
                />
              )}
            </svg>

            {/* Traveler navigation marker following the journey */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute top-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-warm"
                style={{
                  left: iconProgress,
                }}
              >
                <Navigation size={14} className="rotate-45" />
              </motion.div>
            )}
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: prefersReducedMotion ? 0 : index * 0.15,
                  }}
                  className="bg-card rounded-2xl md:rounded-3xl p-7 md:p-8 border border-border/80 shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-serif-display text-3xl font-black text-muted-foreground/30">
                        {item.step}
                      </span>
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-warm-sm"
                        style={{ backgroundColor: item.accent }}
                      >
                        <Icon size={22} strokeWidth={2} />
                      </div>
                    </div>

                    <h3 className="font-serif-display text-xl font-bold text-foreground mb-3 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Editorial tip badge */}
                  <div className="pt-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                      {item.tip}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Handwritten marginal note */}
        <div className="mt-12 text-center">
          <span className="font-handwriting text-xl text-primary font-bold -rotate-1 inline-block">
            "Takes under 15 seconds to draft your entire first itinerary."
          </span>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
