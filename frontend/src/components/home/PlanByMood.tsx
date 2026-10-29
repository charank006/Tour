import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const moods = [
  {
    id: 'Burned out',
    title: 'Burned Out',
    tagline: 'Deep mountain quiet & zero alarms',
    sample: 'Cedar cabin in Jibhi with firewood & slow drip coffee',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=85&w=800&auto=format&fit=crop',
    tint: 'from-emerald-950/80 via-emerald-950/40 to-[#0B121A]/90',
    accentText: 'text-emerald-300',
  },
  {
    id: 'Adventure',
    title: 'High Adventure',
    tagline: 'Adrenaline on rivers & high passes',
    sample: 'River rapids in Rishikesh and sunrise paragliding in Bir',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?q=85&w=800&auto=format&fit=crop',
    tint: 'from-sky-950/80 via-sky-950/40 to-[#0B121A]/90',
    accentText: 'text-sky-300',
  },
  {
    id: 'Romance',
    title: 'Slow Romance',
    tagline: 'Lake palaces & twilight backwaters',
    sample: 'Private Alleppey houseboat dinner under lantern light',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=85&w=800&auto=format&fit=crop',
    tint: 'from-amber-950/80 via-amber-950/40 to-[#0B121A]/90',
    accentText: 'text-amber-300',
  },
  {
    id: 'Culture',
    title: 'Culture & Lore',
    tagline: 'Ancient stone, havelis & living folk craft',
    sample: 'Jaisalmer fort alley walk with local desert ballad singers',
    image: 'https://images.unsplash.com/photo-1589815033735-a764d9ac72b3?q=85&w=800&auto=format&fit=crop',
    tint: 'from-stone-950/80 via-stone-950/40 to-[#0B121A]/90',
    accentText: 'text-[#E06943]',
  },
  {
    id: 'Foodie',
    title: 'Culinary Trail',
    tagline: 'Spice plantations & old bazaar feasts',
    sample: 'Old Delhi morning nihari walk to Chettinad pepper fry',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=85&w=800&auto=format&fit=crop',
    tint: 'from-orange-950/80 via-orange-950/40 to-[#0B121A]/90',
    accentText: 'text-orange-300',
  },
  {
    id: 'Spiritual',
    title: 'Spiritual Retreat',
    tagline: 'Dawn chants & riverbank contemplation',
    sample: 'Varanasi dawn meditation and quiet ashram stays',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=85&w=800&auto=format&fit=crop',
    tint: 'from-amber-950/85 via-amber-950/40 to-[#0B121A]/90',
    accentText: 'text-amber-200',
  },
];

export const PlanByMood = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Intuitive Planning
            </span>
          </div>
          <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
            Plan by how you want to feel
          </h2>
          <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
            Pick a state of mind. We will build an itinerary calibrated to give you exactly that energy.
          </p>
        </div>

        {/* 6 Mood Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {moods.map((mood, index) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-xl transition-all duration-300 h-80 flex flex-col justify-end"
            >
              <Link
                to="/plan"
                state={{ mood: mood.id }}
                className="absolute inset-0 block"
              >
                <img
                  src={mood.image}
                  alt={mood.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-editorial"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${mood.tint}`} />
              </Link>

              {/* Card Content */}
              <div className="relative z-10 p-6 md:p-7 text-white pointer-events-none">
                <span className={`text-xs font-bold tracking-wider uppercase mb-1.5 block ${mood.accentText}`}>
                  {mood.tagline}
                </span>

                <h3 className="font-serif-display text-2xl md:text-3xl font-bold mb-2">
                  {mood.title}
                </h3>

                {/* Hover reveal of sample day */}
                <div className="max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 ease-editorial overflow-hidden">
                  <p className="text-xs text-stone-200/90 leading-relaxed pt-1 border-t border-white/20">
                    {mood.sample}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
                  <span>Explore this vibe</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PlanByMood;
