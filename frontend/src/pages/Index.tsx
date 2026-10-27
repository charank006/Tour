import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import StackedCardsSection from '@/components/home/StackedCardsSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import Footer from '@/components/home/Footer';
import { Sparkles, Globe, Shield, Clock } from 'lucide-react';

const marqueeItems = [
  '🏔️ Manali', '🏖️ Goa', '🏯 Jaipur', '🌿 Munnar', '🌊 Andaman',
  '🏕️ Coorg', '🕌 Agra', '🎭 Varanasi', '🗻 Leh-Ladakh', '🌺 Ooty',
  '🏔️ Manali', '🏖️ Goa', '🏯 Jaipur', '🌿 Munnar', '🌊 Andaman',
  '🏕️ Coorg', '🕌 Agra', '🎭 Varanasi', '🗻 Leh-Ladakh', '🌺 Ooty',
];

const stats = [
  { icon: Globe, value: '500+', label: 'Destinations' },
  { icon: Sparkles, value: '50k+', label: 'Trips Planned' },
  { icon: Shield, value: '100%', label: 'Secure & Private' },
  { icon: Clock, value: '<10s', label: 'Plan Generated' },
];

const trendingDestinations = [
  { id: 'd1', title: 'Manali', subtitle: 'Himachal Pradesh', category: 'Mountains', badge: 'Trending', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop&q=60' },
  { id: 'd2', title: 'Goa', subtitle: 'India', category: 'Beaches', badge: 'Popular', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop&q=60' },
  { id: 'd3', title: 'Jaipur', subtitle: 'Rajasthan', category: 'Heritage', badge: 'Must Visit', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&auto=format&fit=crop&q=60' },
  { id: 'd4', title: 'Munnar', subtitle: 'Kerala', category: 'Nature', badge: 'Scenic', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=60' },
];

const experiences = [
  { id: 'a1', title: 'River Rafting', subtitle: 'Rishikesh', category: 'Adventure', badge: 'Thrilling', image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=500&auto=format&fit=crop&q=60' },
  { id: 'a2', title: 'Desert Safari', subtitle: 'Jaisalmer', category: 'Culture', badge: 'Unique', image: 'https://images.unsplash.com/photo-1589815033735-a764d9ac72b3?w=500&auto=format&fit=crop&q=60' },
  { id: 'a3', title: 'Yoga Retreat', subtitle: 'Kerala', category: 'Wellness', badge: 'Relaxing', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Hero />

      {/* ── Marquee Ticker ──────────────────────────────────── */}
      <div className="bg-primary py-5 marquee-wrapper border-y border-white/5">
        <div className="animate-marquee inline-flex gap-10 whitespace-nowrap">
          {marqueeItems.map((item, i) => (
            <span key={i} className="text-white/50 text-sm font-medium tracking-wide hover:text-accent transition-colors cursor-default">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group text-center p-8 rounded-3xl border border-border/60 bg-card hover:border-accent/30 hover:shadow-[0_8px_40px_-12px_rgba(245,158,11,0.2)] transition-all duration-500 cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-accent/[0.15] transition-all duration-300">
                  <Icon size={24} className="text-accent" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-foreground mb-1 tracking-tight">{value}</div>
                <div className="text-sm text-muted-foreground font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StackedCardsSection
        title="Trending Destinations"
        subtitle="The most loved spots by travelers this season, from misty hills to sun-kissed beaches."
        items={trendingDestinations}
        align="left"
        ctaLink="/destinations"
        ctaText="Explore Destinations"
      />

      <StackedCardsSection
        title="Curated Experiences"
        subtitle="Handpicked activities ensuring unforgettable memories."
        items={experiences}
        align="right"
        ctaLink="/activities"
        ctaText="Explore Activities"
      />

      {/* ── Full-width CTA Banner ────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-24 my-8 mx-4 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1a2744 50%, #0f2027 100%)' }}
      >
        {/* Animated orb */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.6) 0%, transparent 65%)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Ready to plan your <span className="shimmer-text">next adventure?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/60 text-lg mb-10 max-w-xl mx-auto"
          >
            Let our AI craft a perfect itinerary in seconds. Zero effort, maximum experience.
          </motion.p>
          <motion.a
            href="/plan"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="btn-accent inline-flex items-center gap-2 text-lg px-10 py-4 rounded-full font-bold"
          >
            <Sparkles size={20} />
            Start Planning Free
          </motion.a>
        </div>
      </motion.section>

      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Index;
