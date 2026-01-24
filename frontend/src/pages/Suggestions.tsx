import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MapPin, Thermometer, Wallet, ArrowRight, Loader2, ArrowLeft, Star } from 'lucide-react';
import { fetchDestinations, Destination } from '@/api/mockData';

const Suggestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  const tripData = location.state;

  useEffect(() => {
    if (!tripData) {
      navigate('/plan');
      return;
    }

    const loadDestinations = async () => {
      setLoading(true);
      try {
        const data = await fetchDestinations(tripData.budgetRange);
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, [tripData, navigate]);

  const handleSelectDestination = (destination: Destination) => {
    navigate('/trip-plan', {
      state: {
        ...tripData,
        destination,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Finding perfect destinations for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to inputs
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-travel mb-4">
              <MapPin size={16} className="text-primary" />
              <span>Step 2 of 3</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose your destination
            </h1>
            <p className="text-muted-foreground text-lg">
              Based on your {tripData?.budget} budget from {tripData?.startLocation}
            </p>
          </div>

          {/* Destination Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                className="card-travel overflow-hidden group cursor-pointer"
                onClick={() => handleSelectDestination(destination)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="badge-travel bg-background/90 backdrop-blur-sm">
                      <Star size={14} className="text-primary mr-1" />
                      Popular
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {destination.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {destination.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Thermometer size={16} className="text-primary" />
                      {destination.temperature}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {destination.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Wallet size={16} className="text-primary" />
                      <span className="font-semibold text-foreground">
                        {destination.budgetEstimate}
                      </span>
                    </div>
                    <button className="btn-outline py-2 px-4 text-sm inline-flex items-center gap-1 group/btn">
                      Select
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No destinations found for your budget range.
              </p>
              <Link to="/plan" className="btn-primary">
                Try different options
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
