
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plane,
  Train,
  Bus,
  Wallet,
  MapPin,
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { tripApi } from '@/api/api';
import TripPlanSkeleton from '@/components/skeletons/TripPlanSkeleton';
import PageTransition from '@/components/PageTransition';
import TripSummary from '@/components/trip/TripSummary';
import TimelineItinerary from '@/components/trip/TimelineItinerary';
import AlternativeSuggestions from '@/components/trip/AlternativeSuggestions';
import { planningLogic } from '@/lib/planningLogic';

type TripState = "idle" | "loading" | "success" | "fallback" | "error";

const TripPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tripState, setTripState] = useState<TripState>("loading");
  const [tripPlan, setTripPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTravelType, setSelectedTravelType] = useState<'flight' | 'train' | 'bus'>('flight');
  const [selectedStayType, setSelectedStayType] = useState<'budget' | 'comfort' | 'luxury'>('budget');

  const tripData = location.state;

  useEffect(() => {
    // If no destination passed (e.g. direct reload), go back
    if (!tripData?.destination) {
      navigate('/plan');
      return;
    }

    const loadTripPlan = async () => {
      setLoading(true);
      setError(null);
      setTripState("loading");

      // CHECK FOR MANUAL CLIENT-SIDE PLAN
      if (tripData.isManualPlan && tripData.destinationId) {
        try {
          // Simulate a small delay for better UX
          await new Promise(resolve => setTimeout(resolve, 1500));

          const { destinationId, travelers, startDate, selectedPlaceIds } = tripData;

          // Generate Itinerary
          const itinerary = planningLogic.generateSmartItinerary(
            destinationId,
            3, // Defaulting to 3 days for now as per previous logic
            Number(travelers) || 2,
            selectedPlaceIds || []
          );

          // Estimate Budget
          const budget = planningLogic.estimateBudget(
            destinationId,
            3,
            Number(travelers) || 2,
            'moderate' /// Default comfort
          );

          const clientPlan = {
            destination: { name: tripData.destination.name },
            totalDays: 3,
            travelers: Number(travelers) || 2,
            startDate: startDate || new Date().toISOString(),
            endDate: new Date(new Date(startDate || new Date()).setDate(new Date(startDate || new Date()).getDate() + 3)).toISOString(),
            budgetBreakdown: budget,
            dayPlans: itinerary,
            // Static options for demo
            travelOptions: [
              { type: 'flight', operator: 'IndiGo', duration: '2h 15m', departure: '06:00 AM', cost: 4500 },
              { type: 'train', operator: 'Shatabdi Exp', duration: '6h', departure: '07:00 AM', cost: 1200 },
              { type: 'bus', operator: 'Volvo AC', duration: '10h', departure: '09:00 PM', cost: 800 }
            ],
            stayOptions: [
              { type: 'budget', name: 'Zostel', rating: 4.5, amenities: ['WiFi', 'AC'], pricePerNight: 999, image: 'https://images.unsplash.com/photo-1555854743-e3c746dd448d' },
              { type: 'comfort', name: 'Lemon Tree', rating: 4.2, amenities: ['Pool', 'Gym'], pricePerNight: 3500, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
              { type: 'luxury', name: 'Taj Hotel', rating: 4.9, amenities: ['Spa', 'Luxury'], pricePerNight: 12000, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' }
            ]
          };

          setTripPlan(clientPlan);
          setTripState("success");
        } catch (err) {
          console.error("Client planning error:", err);
          setError("Failed to generate itinerary.");
        } finally {
          setLoading(false);
        }
        return;
      }

      // FALLBACK TO BACKEND
      try {
        // Prepare payload for Backend
        const payload = {
          destination: tripData?.destination?.name || tripData?.destination || "Unknown",
          startLocation: tripData?.startLocation || "Unknown",
          startDate: tripData?.startDate || new Date().toISOString(),
          endDate: tripData?.endDate || new Date().toISOString(),
          travelers: tripData?.travelers || "1",
          mood: 'Excited',
          budget: tripData?.budgetRange?.max || 50000
        };

        const backendData = await tripApi.createTrip(payload);

        // Strict validation: If essential data is missing, throw to trigger fallback
        if (!backendData || !backendData.plan || !Array.isArray(backendData.plan.places) || backendData.plan.places.length === 0) {
          throw new Error("Invalid or empty response from server");
        }

        // ADAPT Backend Data to Frontend UI Structure (Defensively)
        const safePlaces = backendData.plan.places;

        const adaptedPlan = {
          destination: { name: backendData.destination || payload.destination },
          totalDays: 3,
          travelers: backendData.travelers || payload.travelers,
          startDate: backendData.startDate || payload.startDate,
          endDate: backendData.endDate || payload.endDate,
          budgetBreakdown: {
            total: backendData.plan.estimatedCost?.total || 15000,
            travel: backendData.plan.estimatedCost?.transport || 5000,
            stay: backendData.plan.estimatedCost?.stay || 5000,
            food: backendData.plan.estimatedCost?.food || 3000,
            activities: backendData.plan.estimatedCost?.activities || 1000,
            misc: backendData.plan.estimatedCost?.buffer || 1000
          },
          dayPlans: [
            {
              day: 1,
              date: backendData.startDate || payload.startDate,
              dailySpend: 5000,
              activities: safePlaces.slice(0, 3).map((p: any) => ({
                time: 'morning',
                title: p?.name || 'Activity',
                description: p?.category || p?.categories?.[0]?.name || 'Sightseeing',
                duration: '2h',
                cost: 0
              }))
            },
            {
              day: 2,
              date: backendData.startDate || payload.startDate,
              dailySpend: 4000,
              activities: safePlaces.slice(3, 6).map((p: any) => ({
                time: 'afternoon',
                title: p?.name || 'Activity',
                description: p?.category || p?.categories?.[0]?.name || 'Exploration',
                duration: '3h',
                cost: 500
              }))
            }
          ],
          travelOptions: [
            { type: 'flight', operator: 'IndiGo', duration: '2h 15m', departure: '06:00 AM', cost: 4500 },
            { type: 'train', operator: 'Shatabdi Exp', duration: '6h', departure: '07:00 AM', cost: 1200 },
            { type: 'bus', operator: 'Volvo AC', duration: '10h', departure: '09:00 PM', cost: 800 }
          ],
          stayOptions: [
            { type: 'budget', name: 'Zostel', rating: 4.5, amenities: ['WiFi', 'AC'], pricePerNight: 999, image: 'https://images.unsplash.com/photo-1555854743-e3c746dd448d' },
            { type: 'comfort', name: 'Lemon Tree', rating: 4.2, amenities: ['Pool', 'Gym'], pricePerNight: 3500, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
            { type: 'luxury', name: 'Taj Hotel', rating: 4.9, amenities: ['Spa', 'Luxury'], pricePerNight: 12000, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' }
          ]
        };

        setTripPlan(adaptedPlan);
        setTripState("success");
      } catch (error: any) {
        console.error('Error fetching trip plan:', error);

        const fallbackPlan = {
          destination: { name: tripData?.destination?.name || tripData?.destination || "Destination" },
          totalDays: 3,
          travelers: tripData?.travelers || "2",
          startDate: tripData?.startDate || new Date().toISOString(),
          endDate: tripData?.endDate || new Date().toISOString(),
          budgetBreakdown: {
            total: 15000,
            travel: 5000,
            stay: 5000,
            food: 3000,
            activities: 1000,
            misc: 1000
          },
          dayPlans: [
            {
              day: 1,
              date: tripData?.startDate || new Date().toISOString(),
              dailySpend: 5000,
              activities: [
                { time: 'morning', title: 'City Tour', description: 'Explore the city landmarks', duration: '2h', cost: 0 },
                { time: 'afternoon', title: 'Local Market', description: 'Visit the famous market', duration: '2h', cost: 500 }
              ]
            },
            {
              day: 2,
              date: tripData?.startDate || new Date().toISOString(),
              dailySpend: 4000,
              activities: [
                { time: 'morning', title: 'Museum Visit', description: 'Cultural deep dive', duration: '3h', cost: 1000 },
                { time: 'afternoon', title: 'Park & Relax', description: 'Leisure time', duration: '2h', cost: 0 }
              ]
            }
          ],
          travelOptions: [
            { type: 'flight', operator: 'IndiGo', duration: '2h 15m', departure: '06:00 AM', cost: 4500 },
            { type: 'train', operator: 'Shatabdi Exp', duration: '6h', departure: '07:00 AM', cost: 1200 },
            { type: 'bus', operator: 'Volvo AC', duration: '10h', departure: '09:00 PM', cost: 800 }
          ],
          stayOptions: [
            { type: 'budget', name: 'Zostel', rating: 4.5, amenities: ['WiFi', 'AC'], pricePerNight: 999, image: 'https://images.unsplash.com/photo-1555854743-e3c746dd448d' },
            { type: 'comfort', name: 'Lemon Tree', rating: 4.2, amenities: ['Pool', 'Gym'], pricePerNight: 3500, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
            { type: 'luxury', name: 'Taj Hotel', rating: 4.9, amenities: ['Spa', 'Luxury'], pricePerNight: 12000, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' }
          ]
        };

        setTripPlan(fallbackPlan);
        setTripState("fallback");
      } finally {
        setLoading(false);
      }
    };

    loadTripPlan();
  }, [tripData, navigate]);

  const getTravelIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return Plane;
      case 'train':
        return Train;
      default:
        return Bus;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <TripPlanSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate('/plan')}
            className="btn-primary w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tripPlan) return null;

  return (
    <PageTransition className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            to="/suggestions"
            state={tripData}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to destinations
          </Link>

          <TripSummary
            tripPlan={tripPlan}
            startLocation={tripData.startLocation}
            formatCurrency={formatCurrency}
          />

          <TimelineItinerary
            dayPlans={tripPlan.dayPlans}
            formatCurrency={formatCurrency}
            selectedStay={tripPlan.stayOptions.find((s: any) => s.type === selectedStayType)}
          />

          {/* Section 4: Trip Logistics (Travel & Stay) */}
          <section className="mb-16">
            <h2 className="section-title flex items-center gap-2 mb-8">
              <MapPin className="text-primary" size={24} />
              Your Trip Logistics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Travel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Plane className="text-muted-foreground" size={20} />
                  Getting There
                </h3>

                <div className="space-y-4">
                  {tripPlan.travelOptions.map((option: any) => {
                    const Icon = getTravelIcon(option.type);
                    const isSelected = selectedTravelType === option.type;
                    return (
                      <button
                        key={option.type}
                        onClick={() => setSelectedTravelType(option.type)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${isSelected
                          ? 'bg-primary/5 border-primary ring-1 ring-primary'
                          : 'bg-card border-border hover:border-primary/50 hover:shadow-md'
                          }`}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary'
                            }`}>
                            <Icon size={22} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-foreground capitalize text-lg">{option.type}</h4>
                              <span className="font-bold text-primary">{formatCurrency(option.cost)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{option.operator}</span>
                              <span>{option.duration} • {option.departure}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Right Column: Stay */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Home className="text-muted-foreground" size={20} />
                  Where to Stay
                </h3>

                <AlternativeSuggestions
                  stayOptions={tripPlan.stayOptions}
                  selectedStayType={selectedStayType}
                  setSelectedStayType={setSelectedStayType}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          </section>

          {/* Section 5: Budget Breakdown */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          >
            <h2 className="section-title flex items-center gap-2">
              <Wallet className="text-primary" size={24} />
              Budget Breakdown
            </h2>

            <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/40 hover:shadow-md transition-shadow">
              <div className="space-y-6">
                {[
                  { label: 'Travel', sub: 'Round Trip', value: tripPlan.budgetBreakdown.travel, icon: Plane, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Accommodation', sub: 'Stay Cost', value: tripPlan.budgetBreakdown.stay, icon: Home, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  { label: 'Activities', sub: 'Sightseeing', value: tripPlan.budgetBreakdown.activities, icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { label: 'Food & Dining', sub: 'Est. Meals', value: tripPlan.budgetBreakdown.food, icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                  { label: 'Miscellaneous', sub: 'Buffer & Shopping', value: tripPlan.budgetBreakdown.misc, icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                ].map((item: any, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${item.bg}`}>
                        <item.icon size={24} className={item.color} />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-foreground">{item.label}</div>
                        <div className="text-sm text-muted-foreground font-medium">{item.sub}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground tabular-nums group-hover:text-primary transition-colors">
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Estimated Cost</div>
                    <div className="text-sm text-muted-foreground font-medium">Inclusive of all categories for {tripPlan.travelers} traveler(s)</div>
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-primary tracking-tight">
                    {formatCurrency(tripPlan.budgetBreakdown.total)}
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-muted-foreground mb-4">
                Happy with your plan? Let's make it happen!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  Book This Trip
                </button>
                <Link to="/plan" className="btn-outline">
                  Plan Another Trip
                </Link>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </PageTransition>
  );
};

export default TripPlanPage;

