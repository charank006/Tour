import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, Calendar, Clock, Gauge, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface CorridorStop {
  name: string;
  location: string;
  highlight: string;
  image: string;
}

interface CorridorItem {
  id: string;
  name: string;
  badge: string;
  region: string;
  distance: string;
  duration: string;
  altitude: string;
  bestSeason: string;
  heroImage: string;
  tagline: string;
  story: string;
  insiderTip: string;
  stops: CorridorStop[];
  destinationQuery: string;
}

const corridors: CorridorItem[] = [
  {
    id: 'himalayas',
    name: 'The Great Himalayan Crest',
    badge: 'High Altitude Pass',
    region: 'Himachal & Spiti Valley',
    distance: '420 km',
    duration: '5 – 7 Days',
    altitude: '4,270 m peak',
    bestSeason: 'Jun – Oct',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=85&w=1200&auto=format&fit=crop',
    tagline: 'From cedar pine valleys over high mountain passes to Tibetan monasteries',
    story:
      'A dramatic transition from lush green alpine slopes in Manali through the engineering marvel of Atal Tunnel, opening into the moonscape canyons and thousand-year-old Buddhist monasteries of Spiti.',
    insiderTip: 'Start from Manali by 5:30 AM to bypass the morning tourist tempo travelers and catch golden hour at Rohtang rim.',
    destinationQuery: 'Manali',
    stops: [
      {
        name: 'Solang & Atal Tunnel',
        location: 'Manali Gateway',
        highlight: 'Morning cedar pine air & alpine viewpoints',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Key Monastery',
        location: 'Kaza Cliff',
        highlight: '11th-century cliffside gompa above Spiti river',
        image: 'https://images.unsplash.com/photo-1598000494396-857ae230b80e?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Chandra Taal Lake',
        location: 'Samudra Tapu',
        highlight: 'Crescent glacial lake at 4,300 meters',
        image: 'https://images.unsplash.com/photo-1601009187313-2d2c70032c28?q=85&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'rajasthan',
    name: 'Royal Rajputana Desert Circuit',
    badge: 'Heritage & Dunes',
    region: 'Jaipur • Jodhpur • Jaisalmer',
    distance: '580 km',
    duration: '5 – 6 Days',
    altitude: '350 m plains',
    bestSeason: 'Oct – Mar',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=85&w=1200&auto=format&fit=crop',
    tagline: 'Amber ramparts, cobalt blue lanes, and golden sand dunes',
    story:
      'Trace the ancient royal caravan route across Rajasthan. Watch sunrise over the Amer Palace walls, wander the indigo lanes of Brahmpuri beneath Mehrangarh, and sleep under desert stars in the Thar.',
    insiderTip: 'Take evening chai on Nahargarh fort’s outer parapet for panoramic views of Jaipur without palace midday crowds.',
    destinationQuery: 'Jaipur',
    stops: [
      {
        name: 'Amer Palace Ramparts',
        location: 'Jaipur Ridge',
        highlight: 'Ornate Rajput-Mughal mirrors & hill fortress',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Toorji Ka Jhalra',
        location: 'Jodhpur Old City',
        highlight: 'Intricate 1740s sandstone stepwell & cafes',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Sam Sand Dunes',
        location: 'Jaisalmer Desert',
        highlight: 'Sunset camel treks & folk ballad fires',
        image: 'https://images.unsplash.com/photo-1589815033735-a764d9ac72b3?q=85&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'malabar',
    name: 'Malabar Spice & Backwaters Trail',
    badge: 'Tea & Canals',
    region: 'Munnar • Thekkady • Alleppey',
    distance: '290 km',
    duration: '4 – 5 Days',
    altitude: '1,600 m to sea level',
    bestSeason: 'Sep – May',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=85&w=1200&auto=format&fit=crop',
    tagline: 'Misty cardamom estates descending to tranquil palm waterways',
    story:
      'Descend from the highest orthodox tea estates in the Western Ghats through wild pepper plantations into the quiet, non-motorized backwater canals where life moves to the rhythm of wooden oars.',
    insiderTip: 'Book a hand-paddled narrow canoe at dawn; large houseboats cannot navigate the shallow village lotus canals.',
    destinationQuery: 'Munnar',
    stops: [
      {
        name: 'Kolukkumalai Tea Peak',
        location: 'Munnar Ridge',
        highlight: 'World’s highest organic tea garden at sunrise',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Periyar Spice Walk',
        location: 'Thekkady',
        highlight: 'Walking tours through cinnamon & cardamom groves',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Vembanad Lotus Canal',
        location: 'Alleppey',
        highlight: 'Slow wooden canoe drifting under coconut canopies',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=85&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'ganges',
    name: 'Sacred Ganges Heritage Corridor',
    badge: 'Spiritual Lore',
    region: 'Rishikesh • Haridwar • Varanasi',
    distance: '760 km',
    duration: '5 – 6 Days',
    altitude: '372 m to 80 m',
    bestSeason: 'Oct – Mar',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=85&w=1200&auto=format&fit=crop',
    tagline: 'Riverbank chanting, Himalayan rapids, and thousand-year dawn rituals',
    story:
      'Follow the holy river from emerald mountain rapids in Rishikesh where monks meditate along white sand banks, down to the sacred eternal ghats of Varanasi where evening brass lamps illuminate the water.',
    insiderTip: 'Rent a hand-rowed wooden boat from Assi Ghat at 5:15 AM before the tourist diesel motors drown the temple bells.',
    destinationQuery: 'Varanasi',
    stops: [
      {
        name: 'Triveni Ghat Aarti',
        location: 'Rishikesh',
        highlight: 'Dusk chants & floating marigold leaf lamps',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Har Ki Pauri',
        location: 'Haridwar',
        highlight: 'Historic river steps with evening light ceremony',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Dashashwamedh Ghat',
        location: 'Varanasi',
        highlight: 'Dawn boat journey past ancient cremation steps',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=85&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'meghalaya',
    name: 'Cloud Forests of the North East',
    badge: 'Living Bio-Bridges',
    region: 'Guwahati • Shillong • Cherrapunji',
    distance: '190 km',
    duration: '4 – 5 Days',
    altitude: '1,490 m cloud plateaus',
    bestSeason: 'Oct – May',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=1200&auto=format&fit=crop',
    tagline: 'Living root bridges, roaring canyon waterfalls, and glass rivers',
    story:
      'Venture into the abode of the clouds. Walk across hundred-year-old living rubber tree bridges woven across cascading streams, and drift on crystal-clear river waters along the border of Bangladesh.',
    insiderTip: 'Pack lightweight trekking poles for the 3,500 stone steps descending down to the Double Decker Root Bridge in Nongriat.',
    destinationQuery: 'Shillong',
    stops: [
      {
        name: 'Double Decker Root Bridge',
        location: 'Nongriat Valley',
        highlight: 'Century-old living bio-engineered tree bridges',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Nohkalikai Falls',
        location: 'Cherrapunji',
        highlight: 'India’s tallest plunge waterfall cascading into turquoise pools',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=85&w=600&auto=format&fit=crop',
      },
      {
        name: 'Umngot Glass River',
        location: 'Dawki',
        highlight: 'Boats that appear to float on pure air above pebbles',
        image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?q=85&w=600&auto=format&fit=crop',
      },
    ],
  },
];

export const SubcontinentCorridors = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>('himalayas');

  const active = corridors.find((c) => c.id === activeId) || corridors[0];

  const handlePlanCorridor = (corridor: CorridorItem) => {
    navigate('/plan', {
      state: {
        destination: corridor.destinationQuery,
        travelers: 2,
        mood: corridor.id === 'himalayas' ? 'mountains' : corridor.id === 'rajasthan' ? 'heritage' : 'quiet',
      },
    });
  };

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Compass size={13} />
              <span>Continental Scope • Curated Corridors</span>
            </div>
            <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
              From high Himalayan passes to southern spice hills
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
              We focus deep rather than wide. Each pinned corridor has been road-tested for driving pace, verified local tea houses, and seasonal road conditions.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-muted-foreground border-l border-border pl-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-primary" />
              <span>50+ Tested Stops</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-primary" />
              <span>Zero Rushed Days</span>
            </div>
          </div>
        </div>

        {/* Corridor Pill Selector */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {corridors.map((c) => {
            const isSelected = c.id === activeId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 select-none border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-warm'
                    : 'bg-card text-foreground/80 hover:text-foreground hover:bg-muted border-border/80'
                }`}
              >
                <span>{c.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {c.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Corridor Feature Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {/* Left Column: Hero Route Card with High-Res Image (7 cols) */}
            <div className="lg:col-span-7 bg-card rounded-3xl md:rounded-4xl overflow-hidden border border-border/80 shadow-warm flex flex-col justify-between">
              <div className="relative h-72 sm:h-96 md:h-[420px] overflow-hidden">
                <ImageWithFallback
                  src={active.heroImage}
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

                {/* Badges on Top */}
                <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#E06943]" />
                    {active.badge}
                  </span>
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
                    {active.bestSeason}
                  </span>
                </div>

                {/* Headline on Image Bottom */}
                <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#E06943] font-bold block mb-1">
                    {active.region}
                  </span>
                  <h3 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight drop-shadow-sm mb-2">
                    {active.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 line-clamp-2 font-light">
                    {active.tagline}
                  </p>
                </div>
              </div>

              {/* Story & Quick Action */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-light">
                  {active.story}
                </p>

                {/* Pacing Stats HUD */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-border/60 text-xs">
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 mb-1">
                      <Gauge size={13} className="text-primary" /> Distance
                    </span>
                    <span className="font-bold text-foreground">{active.distance}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 mb-1">
                      <Clock size={13} className="text-primary" /> Pacing
                    </span>
                    <span className="font-bold text-foreground">{active.duration}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 mb-1">
                      <MapPin size={13} className="text-primary" /> Elevation
                    </span>
                    <span className="font-bold text-foreground">{active.altitude}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 mb-1">
                      <Calendar size={13} className="text-primary" /> Window
                    </span>
                    <span className="font-bold text-foreground">{active.bestSeason}</span>
                  </div>
                </div>

                {/* Insider Field Note Callout */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground/90 flex items-start gap-3">
                  <span className="font-serif-display font-bold text-base text-amber-600 flex-shrink-0">
                    “
                  </span>
                  <div>
                    <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                      Field Note from Road Scouts:
                    </span>
                    <p className="text-muted-foreground leading-relaxed italic">
                      {active.insiderTip}
                    </p>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handlePlanCorridor(active)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-warm hover:brightness-105 active:scale-[0.98] transition-all group"
                  >
                    <span>Plan Itinerary for this Corridor</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Hand-Curated Route Waypoints (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Signature Waypoints
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  3 road-tested halts
                </span>
              </div>

              {active.stops.map((stop, idx) => (
                <div
                  key={stop.name}
                  className="bg-card rounded-2xl p-4 border border-border/80 shadow-warm-xs hover:shadow-warm transition-all flex items-center gap-4 group"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-border/80">
                    <ImageWithFallback
                      src={stop.image}
                      alt={stop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                        {stop.location}
                      </span>
                    </div>
                    <h4 className="font-serif-display font-bold text-sm sm:text-base text-foreground leading-snug line-clamp-1">
                      {stop.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1 font-light">
                      {stop.highlight}
                    </p>
                  </div>
                </div>
              ))}

              {/* Subcontinent Exploration Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#131D28] to-[#1E2B3A] text-white border border-[#2B3C50] shadow-warm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    24+ Subcontinent Regions
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-light mb-3">
                  Want to blend multiple corridors or craft a custom route across state lines? Our smart engine connects transit hubs without back-tracking.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/destinations')}
                  className="text-xs font-bold text-[#E06943] hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore all 24 destinations</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default SubcontinentCorridors;
