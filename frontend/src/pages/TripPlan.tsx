
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plane,
  Train,
  Bus,
  Wallet,
  MapPin,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { tripApi } from '@/api/api';
import PlanningAnimation from '@/components/PlanningAnimation';
import PageTransition from '@/components/PageTransition';
import TripSummary from '@/components/trip/TripSummary';
import DailyItinerary from '@/components/trip/DailyItinerary';
import AlternativeSuggestions from '@/components/trip/AlternativeSuggestions';
import MapSection from '@/components/trip/MapSection';
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
          const itinerary = planningLogic.generateItinerary(
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
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <PlanningAnimation />
      </div>
    );
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

          <DailyItinerary
            dayPlans={tripPlan.dayPlans}
            formatCurrency={formatCurrency}
          />

          <MapSection destination={tripPlan.destination.name} />
          {/* Section 3: Travel Options */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="section-title flex items-center gap-2">
              <Plane className="text-primary" size={24} />
              Travel Options
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {tripPlan.travelOptions.map((option: any) => {
                const Icon = getTravelIcon(option.type);
                const isSelected = selectedTravelType === option.type;
                return (
                  <button
                    key={option.type}
                    onClick={() => setSelectedTravelType(option.type)}
                    className={`card-travel text-left transition-all ${isSelected ? 'ring-2 ring-primary bg-accent' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-primary' : 'bg-secondary'
                        }`}>
                        <Icon size={22} className={isSelected ? 'text-primary-foreground' : 'text-foreground'} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground capitalize">{option.type}</h3>
                        <p className="text-xs text-muted-foreground">{option.operator}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">{option.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departure</span>
                        <span className="font-medium text-foreground">{option.departure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price (one-way)</span>
                        <span className="font-bold text-primary">{formatCurrency(option.cost)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <AlternativeSuggestions
            stayOptions={tripPlan.stayOptions}
            selectedStayType={selectedStayType}
            setSelectedStayType={setSelectedStayType}
            formatCurrency={formatCurrency}
          />

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

            <div className="card-travel">
              <div className="space-y-4">
                {[
                  { label: 'Travel (Round Trip)', value: tripPlan.budgetBreakdown.travel, icon: Plane },
                  { label: 'Accommodation', value: tripPlan.budgetBreakdown.stay, icon: Home },
                  { label: 'Activities & Sightseeing', value: tripPlan.budgetBreakdown.activities, icon: MapPin },
                  { label: 'Food & Dining', value: tripPlan.budgetBreakdown.food, emoji: '🍽️' },
                  { label: 'Miscellaneous (10%)', value: tripPlan.budgetBreakdown.misc, emoji: '📦' },
                ].map((item: any, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        {'icon' in item && item.icon ? (
                          <item.icon size={18} className="text-primary" />
                        ) : (
                          <span className="text-lg">{item.emoji}</span>
                        )}
                      </div>
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <span className="font-semibold text-foreground">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-foreground">Total Estimated Cost</div>
                    <div className="text-sm text-muted-foreground">For {tripPlan.travelers} traveler(s)</div>
                  </div>
                  <div className="text-3xl font-bold text-primary">
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

