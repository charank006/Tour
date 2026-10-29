import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import TrendingBento from '@/components/home/TrendingBento';
import PlanByMood from '@/components/home/PlanByMood';
import SmartFeaturesBento from '@/components/home/SmartFeaturesBento';
import ReviewsSection from '@/components/home/ReviewsSection';
import StatsSection from '@/components/home/StatsSection';
import SubcontinentCorridors from '@/components/home/SubcontinentCorridors';
import FinalCta from '@/components/home/FinalCta';
import Footer from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary/20">
      {/* 1. Hero with Search Card */}
      <Hero />

      {/* 2. How It Works (Scroll-driven Dotted Journey Line) */}
      <HowItWorks />

      {/* 3. Trending Destinations (Asymmetric Bento Grid with Match Badges & "Why This?") */}
      <TrendingBento />

      {/* 4. Plan by Mood (6 Color-Tinted Tiles with Hover Reveal) */}
      <PlanByMood />

      {/* 5. Smart Features Bento (Weather Shift, Crowd Timelines, Budget Split, Swap Activity) */}
      <SmartFeaturesBento />

      {/* 6. Real Reviews (Polaroid Cards with Handwritten Captions) */}
      <ReviewsSection />

      {/* 7. Stats Counters (Real Application Numbers) */}
      <StatsSection />

      {/* 8. Curated Subcontinent Corridors Showcase */}
      <SubcontinentCorridors />

      {/* 9. Final CTA Band & Footer */}
      <FinalCta />
      <Footer />
    </div>
  );
};

export default Index;
