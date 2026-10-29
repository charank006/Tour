import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    id: 1,
    name: 'Aisha Kapoor',
    location: 'Solo Traveler • Mumbai',
    caption: '“The sunrise slot at Lake Pichola was completely empty!”',
    handwritten: 'Locals skip the noon boat, trust them!',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=85&w=400&h=400&auto=format&fit=crop',
    story:
      'I usually spend weeks cross-checking Reddit and blogs before traveling solo. PlanYours gave me a 4-day Udaipur route that felt like a friend had lived there for a decade. The quiet morning chai recommendations were golden.',
    rotation: -1.5,
  },
  {
    id: 2,
    name: 'James & Sarah Thornton',
    location: 'Couple • Bristol / Kochi',
    caption: '“Kerala backwaters without a single tourist trap.”',
    handwritten: 'Best anniversary dinner ever ☕',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=85&w=400&h=400&auto=format&fit=crop',
    story:
      'We wanted a relaxed anniversary trip without crowded resorts. The smart planner paired a private Alleppey canoe ride with a cardamom estate homestay. Seamless timings, zero rush.',
    rotation: 1.5,
  },
  {
    id: 3,
    name: 'Rohan Mehta',
    location: 'Photographer • New Delhi',
    caption: '“Taj Mahal at 5:45 AM was utter magic.”',
    handwritten: 'Golden hour was spot on!',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=85&w=400&h=400&auto=format&fit=crop',
    story:
      'For photography, 30 minutes make or break lighting. The sunrise and sunset timing alerts in the itinerary allowed me to capture the mist over Mehtab Bagh with no one else in frame.',
    rotation: -1,
  },
];

export const ReviewsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Field Notes & Dispatches
            </span>
          </div>
          <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
            Stories from the open road
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
            Real travelers who traded chaotic spreadsheets for calm, hand-crafted itineraries.
          </p>
        </div>

        {/* Polaroid Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              style={{ rotate: `${item.rotation}deg` }}
              className="bg-card rounded-2xl p-6 md:p-7 shadow-polaroid border border-border/70 hover:shadow-warm-xl hover:rotate-0 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Reviewer Header */}
                <div className="flex items-center gap-3.5 mb-5">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{item.name}</h3>
                    <p
                      className="text-xs text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: item.location }}
                    />
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-accent fill-accent" />
                  ))}
                </div>

                {/* Main Quote */}
                <blockquote className="font-serif-display text-lg font-bold text-foreground mb-3 leading-snug">
                  {item.caption}
                </blockquote>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6 font-light">
                  {item.story}
                </p>
              </div>

              {/* Handwritten Polaroid Caption Bottom */}
              <div className="pt-4 border-t border-dashed border-border/70 flex items-center justify-between">
                <span className="font-handwriting text-lg text-primary font-bold -rotate-1">
                  {item.handwritten}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Verified Trip
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
