import Hero from '@/components/home/Hero';
import StackedCardsSection from '@/components/home/StackedCardsSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import Footer from '@/components/home/Footer';

const Index = () => {
  const trendingDestinations = [
    {
      id: 'd1',
      title: 'Manali',
      subtitle: 'Himachal Pradesh',
      category: 'Mountains',
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop&q=60',
    },
    {
      id: 'd2',
      title: 'Goa',
      subtitle: 'India',
      category: 'Beaches',
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop&q=60',
    },
    {
      id: 'd3',
      title: 'Jaipur',
      subtitle: 'Rajasthan',
      category: 'Heritage',
      badge: 'Must Visit',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&auto=format&fit=crop&q=60',
    },
    {
      id: 'd4',
      title: 'Munnar',
      subtitle: 'Kerala',
      category: 'Nature',
      badge: 'Scenic',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=60',
    }
  ];

  const experiences = [
    {
      id: 'a1',
      title: 'River Rafting',
      subtitle: 'Rishikesh',
      category: 'Adventure',
      badge: 'Thrilling',
      image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=500&auto=format&fit=crop&q=60',
    },
    {
      id: 'a2',
      title: 'Desert Safari',
      subtitle: 'Jaisalmer',
      category: 'Culture',
      badge: 'Unique',
      image: 'https://images.unsplash.com/photo-1589815033735-a764d9ac72b3?w=500&auto=format&fit=crop&q=60',
    },
    {
      id: 'a3',
      title: 'Yoga Retreat',
      subtitle: 'Kerala',
      category: 'Wellness',
      badge: 'Relaxing',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60',
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Hero />

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

      <ReviewsSection />

      <Footer />
    </div>
  );
};

export default Index;
