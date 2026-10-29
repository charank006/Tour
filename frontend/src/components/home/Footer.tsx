import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, Instagram, MapPin, Send, Check } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#101721] text-[#F2ECE1] pt-20 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Subtle organic top wave divider */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">

          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <Compass size={20} strokeWidth={2} />
              </div>
              <span className="font-serif-display text-2xl font-bold tracking-tight text-white flex items-baseline">
                Plan<span className="text-primary italic font-normal ml-0.5">Yours</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent ml-1 inline-block" />
              </span>
            </div>

            <p className="text-[#8F9EAF] text-base leading-relaxed max-w-sm font-light">
              Crafted for travelers who love the road less traveled. Thoughtfully paced itineraries, real local timings, and authentic recommendations across India.
            </p>

            <div className="pt-2">
              <span className="font-handwriting text-xl text-[#E06943] inline-block -rotate-1">
                "Not all those who wander are lost."
              </span>
            </div>
          </div>

          {/* Discover Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif-display font-semibold text-white text-base tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#8F9EAF]">
              <li>
                <Link to="/destinations" className="hover:text-primary transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-primary transition-colors">
                  Curated Experiences
                </Link>
              </li>
              <li>
                <Link to="/plan" className="hover:text-primary transition-colors">
                  Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="hover:text-primary transition-colors">
                  My Saved Journeys
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-primary transition-colors">
                  Traveler Field Notes
                </Link>
              </li>
            </ul>
          </div>

          {/* Mood Journeys (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif-display font-semibold text-white text-base tracking-wide">
              Journeys by Mood
            </h3>
            <ul className="space-y-2.5 text-sm text-[#8F9EAF]">
              <li>
                <Link to="/plan" state={{ mood: 'Burned out' }} className="hover:text-primary transition-colors">
                  Misty Mountain Rest
                </Link>
              </li>
              <li>
                <Link to="/plan" state={{ mood: 'Adventure' }} className="hover:text-primary transition-colors">
                  Himalayan Trails
                </Link>
              </li>
              <li>
                <Link to="/plan" state={{ mood: 'Culture' }} className="hover:text-primary transition-colors">
                  Heritage Forts & Lore
                </Link>
              </li>
              <li>
                <Link to="/plan" state={{ mood: 'Foodie' }} className="hover:text-primary transition-colors">
                  Culinary Coastlines
                </Link>
              </li>
              <li>
                <Link to="/plan" state={{ mood: 'Spiritual' }} className="hover:text-primary transition-colors">
                  Ghats & Ashrams
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Field Notes (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-serif-display font-semibold text-white text-base tracking-wide">
              Monthly Field Notes
            </h3>
            <p className="text-xs text-[#8F9EAF] leading-relaxed">
              One dispatch a month. Hidden waterfalls, seasonal chai-stops, and quiet train routes. No spam.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-primary/20 border border-primary/30 text-white text-sm flex items-center gap-2">
                <Check size={16} className="text-primary" />
                <span>Welcome aboard. First dispatch soon!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@journal.com"
                    required
                    className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/35 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-primary-foreground px-3.5 rounded-lg hover:brightness-110 transition-transform active:scale-95 flex items-center justify-center"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Colophon */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8F9EAF]">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} PlanYours. Hand-crafted with</span>
            <Heart size={12} className="text-primary fill-primary inline" />
            <span>for thoughtful wanderers.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <Link to="/reviews" className="hover:text-white transition-colors">Field Notes</Link>
            <Link to="/plan" className="hover:text-white transition-colors">Start Journey</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
