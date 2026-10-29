import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Thermometer, Sparkles } from 'lucide-react';

const destinations = [
  {
    id: 'manali',
    name: 'Manali & Spiti Gateway',
    state: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=85&w=1200&auto=format&fit=crop',
    match: 98,
    temp: '14°C',
    weather: 'Crisp Mountain Breeze',
    whyThis: 'Best window before winter snowfall closes passes',
    season: 'Oct – Feb',
    featured: true,
  },
  {
    id: 'jaipur',
    name: 'Jaipur & Amer',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=85&w=800&auto=format&fit=crop',
    match: 95,
    temp: '26°C',
    weather: 'Golden Sunshine',
    whyThis: 'Sunset views from Nahargarh wall, skip noon crowds',
    season: 'Nov – Mar',
    featured: false,
  },
  {
    id: 'munnar',
    name: 'Munnar & Cardamom Hills',
    state: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=85&w=800&auto=format&fit=crop',
    match: 94,
    temp: '19°C',
    weather: 'Misty Rain & Tea Scent',
    whyThis: 'Chai-stop worthy views without tour bus traffic',
    season: 'Sep – May',
    featured: false,
  },
  {
    id: 'varanasi',
    name: 'Varanasi Ancient Ghats',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=85&w=800&auto=format&fit=crop',
    match: 92,
    temp: '24°C',
    weather: 'Pleasant Evenings',
    whyThis: 'Dawn wooden rowboat ride before bells begin',
    season: 'Oct – Mar',
    featured: false,
  },
];

export const TrendingBento = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/40 relative">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Seasonal Favorites
              </span>
            </div>
            <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
              Trending Destinations
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
              Where travelers are discovering memorable mornings and quiet golden hours right now.
            </p>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group self-start md:self-auto"
          >
            <span>Browse all destinations</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Large Hero Destination Card (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 group relative rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-xl transition-all duration-300 min-h-[420px] md:min-h-[520px] flex flex-col justify-end"
          >
            <Link
              to="/plan"
              state={{ destination: destinations[0].name }}
              className="absolute inset-0 block"
            >
              <img
                src={destinations[0].image}
                alt={destinations[0].name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-editorial"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B121A]/95 via-[#0B121A]/35 to-transparent" />
            </Link>

            {/* Badges on Top */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
              <div className="wax-seal px-3 py-1 text-xs font-bold flex items-center gap-1.5 shadow-warm">
                <Sparkles size={12} />
                <span>{destinations[0].match}% Match</span>
              </div>
              <div className="bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
                <Thermometer size={13} className="text-accent" />
                <span>{destinations[0].temp}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 p-6 md:p-8 text-white pointer-events-none">
              <div className="mb-2">
                <span className="text-xs uppercase tracking-widest text-[#E06943] font-semibold">
                  {destinations[0].state} • {destinations[0].season}
                </span>
              </div>

              <h3 className="font-serif-display text-2xl md:text-4xl font-bold tracking-tight mb-3">
                {destinations[0].name}
              </h3>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs md:text-sm text-stone-200 border border-white/20">
                <span className="text-accent font-bold">Why this:</span>
                <span>{destinations[0].whyThis}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column Bento Stack (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {destinations.slice(1).map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 min-h-[160px] md:min-h-[155px] flex-1 flex flex-col justify-end"
              >
                <Link
                  to="/plan"
                  state={{ destination: dest.name }}
                  className="absolute inset-0 block"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-editorial"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B121A]/95 via-[#0B121A]/40 to-transparent" />
                </Link>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  <span className="bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-warm-sm">
                    {dest.match}% Match
                  </span>
                  <span className="bg-black/50 backdrop-blur-md text-white text-[11px] px-2.5 py-0.5 rounded-full border border-white/10">
                    {dest.temp}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-5 text-white pointer-events-none">
                  <h4 className="font-serif-display text-lg md:text-xl font-bold leading-tight mb-1">
                    {dest.name}
                  </h4>
                  <p className="text-xs text-stone-300 font-light line-clamp-1">
                    <span className="text-[#E06943] font-medium mr-1.5">Tip:</span>
                    {dest.whyThis}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrendingBento;
