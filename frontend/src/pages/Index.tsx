import Hero from '@/components/home/Hero';
import StackedCardsSection from '@/components/home/StackedCardsSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import Footer from '@/components/home/Footer';

const Index = () => {
  const trendingDestinations = [
    {
      id: '1',
      title: 'Bali, Indonesia',
      subtitle: 'Tropical Paradise',
      category: 'Trending',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000',
    },
    {
      id: '2',
      title: 'Kyoto, Japan',
      subtitle: 'Ancient Traditions',
      category: 'Culture',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000',
    },
    {
      id: '3',
      title: 'Santorini, Greece',
      subtitle: 'Sunset Views',
      category: 'Romantic',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?auto=format&fit=crop&q=80&w=1000',
    },
    {
      id: '4',
      title: 'New York, USA',
      subtitle: 'The City That Never Sleeps',
      category: 'Urban',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1000',
    },
  ];

  const experiences = [
    {
      id: '1',
      title: 'Kayaking in Fjords',
      subtitle: 'Norway',
      category: 'Adventure',
      image: 'https://images.unsplash.com/photo-1522501633390-e51c8a141aa4?auto=format&fit=crop&q=80&w=1000',
    },
    {
      id: '2',
      title: 'Sunset Dining',
      subtitle: 'Amalfi Coast',
      category: 'Gastronomy',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000',
    },
    {
      id: '3',
      title: 'Desert Safari',
      subtitle: 'Dubai',
      category: 'Thriller',
      image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&q=80&w=1000',
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Hero />

      <StackedCardsSection
        title="Trending Destinations."
        subtitle="Discover the most sought-after locations for the upcoming season, handpicked by our experts."
        items={trendingDestinations}
        align="left"
      />

      <StackedCardsSection
        title="Unforgettable Experiences."
        subtitle="From heart-pounding adventures to serene culinary journeys, find what moves you."
        items={experiences}
        align="right"
      />

      <ReviewsSection />

      <Footer />
    </div>
  );
};

export default Index;
