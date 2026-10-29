import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plane,
  Train,
  Bus,
  Wallet,
  MapPin,
  Home,
  UtensilsCrossed,
  Sparkles,
  Bookmark,
  Printer,
  Share2,
  Check,
  WifiOff,
  Clock,
  Compass,
  Star,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { tripApi, ServerTripResponse } from '@/api/api';
import TripPlanSkeleton from '@/components/skeletons/TripPlanSkeleton';
import PageTransition from '@/components/PageTransition';
import TripSummary from '@/components/trip/TripSummary';
import TimelineItinerary, { DayPlanItem } from '@/components/trip/TimelineItinerary';
import MapSection from '@/components/trip/MapSection';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';
import { tripStore } from '@/lib/tripStore';
import { generateOfflineTripPlan } from '@/lib/offlinePlanner';
import { formatINR, calculateDays, formatDateDisplay } from '@/lib/formatters';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import confetti from 'canvas-confetti';

interface BudgetBreakdown {
  total: number;
  travel: number;
  stay: number;
  food: number;
  activities: number;
  misc: number;
}

interface TravelOption {
  type: string;
  operator: string;
  duration: string;
  departure: string;
  cost: number;
  badge?: 'cheapest' | 'fastest' | 'recommended';
}

interface StayOption {
  type: string;
  name: string;
  rating: number;
  amenities: string[];
  pricePerNight: number;
  image: string;
}

interface CompleteTripPlan {
  _id?: string;
  id?: string;
  shareId?: string;
  destination: { name: string };
  totalDays: number;
  travelers: number | string;
  startDate: string;
  endDate: string;
  budgetBreakdown: BudgetBreakdown;
  dayPlans: DayPlanItem[];
  travelOptions: TravelOption[];
  stayOptions: StayOption[];
  isOffline?: boolean;
}

export const TripPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ id?: string; shareId?: string }>();
  const [tripPlan, setTripPlan] = useState<CompleteTripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTravelType, setSelectedTravelType] = useState<string>('flight');
  const [selectedStayType, setSelectedStayType] = useState<string>('budget');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Restore state from router state or persistent tripStore
  const stored = tripStore.getState();
  const tripData =
    location.state ||
    (stored.selectedDestination
      ? { ...stored.inputs, destination: stored.selectedDestination }
      : stored.inputs?.destination
        ? stored.inputs
        : null);

  useEffect(() => {
    // Check if deep linking via /trip/:id or /trip/share/:shareId
    const deepLinkId = params.id || params.shareId;
    if (deepLinkId) {
      const loadDeepLink = async () => {
        setLoading(true);
        try {
          const remoteTrip = await tripApi.getTripById(deepLinkId);
          if (remoteTrip && remoteTrip.plan) {
            adaptServerPlan(remoteTrip);
            return;
          }
        } catch (err) {
          console.warn('[TripPlan] Deep link remote fetch failed, falling back to local storage:', err);
          const localList: Array<{ id: string; shareId?: string; plan: CompleteTripPlan }> =
            JSON.parse(localStorage.getItem('my_trips') || '[]');
          const match = localList.find((t) => t.id === deepLinkId || t.shareId === deepLinkId);
          if (match && match.plan) {
            setTripPlan(match.plan);
            setLoading(false);
            return;
          }
        }
      };
      loadDeepLink();
      return;
    }

    // Normal plan generation from wizard
    if (!tripData?.destination) {
      navigate('/plan');
      return;
    }

    const loadTripPlan = async () => {
      setLoading(true);
      setError(null);

      const destName = typeof tripData.destination === 'string'
        ? tripData.destination
        : tripData.destination.name || 'Jaipur';
      const startLoc = tripData.startLocation || 'Mumbai';
      const sDate = tripData.startDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
      const eDate = tripData.endDate || new Date(Date.now() + 86400000 * 11).toISOString().split('T')[0];
      const realDays = calculateDays(sDate, eDate);
      const pax = Number(tripData.travelers) || 2;
      const budgetNum = tripData.budgetRange?.max || (typeof tripData.budget === 'number' ? tripData.budget : 30000);

      const payload = {
        destination: destName,
        startLocation: startLoc,
        startDate: sDate,
        endDate: eDate,
        travelers: pax,
        mood: tripData.mood || 'Curious',
        pace: tripData.pace || 'Medium',
        budget: budgetNum
      };

      try {
        // 1. Attempt Live Server Generation
        const backendData = await tripApi.createTrip(payload);
        if (backendData?.plan) {
          adaptServerPlan(backendData);
          tripStore.savePlan(backendData);
          return;
        }
        throw new Error('Empty server response');
      } catch (apiErr) {
        // 2. Guaranteed Offline-First Generation Fallback
        console.info('[TripPlan] Server unreachable. Executing client-side rule engine on static dataset.', apiErr);
        const offlineData = generateOfflineTripPlan(payload);
        adaptServerPlan(offlineData, true);
        tripStore.savePlan(offlineData);
      } finally {
        setLoading(false);
      }
    };

    loadTripPlan();
  }, [params.id, params.shareId, tripData?.destination?.name, navigate]);

  // Sync trip context with global AI Concierge whenever tripPlan updates
  useEffect(() => {
    if (tripPlan?.destination?.name) {
      window.dispatchEvent(
        new CustomEvent('update-ai-concierge-context', {
          detail: {
            destination: tripPlan.destination.name,
            tripContext: {
              destination: tripPlan.destination.name,
              startLocation: tripData?.startLocation || 'Origin City',
              totalDays: tripPlan.totalDays,
              travelers: tripPlan.travelers,
              budget: tripPlan.budgetBreakdown?.total,
            },
          },
        })
      );
    }
  }, [tripPlan, tripData]);

  function adaptServerPlan(serverTrip: ServerTripResponse, isOffline = false) {
    const p = serverTrip.plan;
    const destName = serverTrip.destination || 'Destination';
    const sDate = serverTrip.startDate || new Date().toISOString().split('T')[0];
    const eDate = serverTrip.endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
    const totalDays = calculateDays(sDate, eDate);
    const pax = Number(serverTrip.travelers) || 2;

    const budgetBreakdown: BudgetBreakdown = {
      total: p.estimatedCost?.total || 24000,
      travel: p.estimatedCost?.travel || p.estimatedCost?.transport || 6000,
      stay: p.estimatedCost?.stay || p.estimatedCost?.accommodation || 8000,
      food: p.estimatedCost?.food || 6000,
      activities: p.estimatedCost?.activities || 3000,
      misc: p.estimatedCost?.misc || p.estimatedCost?.buffer || 1000
    };

    // Adapt dayPlans
    const adaptedDays: DayPlanItem[] = (p.dayPlans || []).map((d, idx) => ({
      day: d.day || idx + 1,
      date: formatDateDisplay(d.date || new Date(new Date(sDate).getTime() + 86400000 * idx).toISOString()),
      title: d.theme || `Day ${d.day || idx + 1} Discovery`,
      dailySpend: Math.round(budgetBreakdown.total / Math.max(1, totalDays)),
      activities: (d.activities || []).map((a) => ({
        time: a.time || 'Morning',
        title: a.title,
        description: a.description,
        duration: a.duration || '2 hours',
        cost: a.cost || 0,
        type: a.type
      }))
    }));

    // Dynamic transport with badges
    const transportList: TravelOption[] = p.transportOptions && p.transportOptions.length > 0
      ? p.transportOptions.map((opt, i) => ({
          type: opt.type,
          operator: opt.operator,
          duration: opt.duration,
          departure: opt.departure,
          cost: opt.cost,
          badge: i === 0 ? 'fastest' : i === 1 ? 'recommended' : 'cheapest'
        }))
      : [
          { type: 'flight', operator: 'IndiGo Express', duration: '2h 15m', departure: '06:30 AM', cost: 4200, badge: 'fastest' },
          { type: 'train', operator: 'Shatabdi Express', duration: '5h 30m', departure: '06:00 AM', cost: 1200, badge: 'recommended' },
          { type: 'bus', operator: 'Volvo Multi-Axle', duration: '8h 00m', departure: '09:30 PM', cost: 850, badge: 'cheapest' }
        ];

    // Dynamic stay options
    const stayList: StayOption[] = [
      {
        type: 'budget',
        name: `${destName} Heritage Homestay`,
        rating: 4.6,
        amenities: ['High-speed WiFi', 'Traditional Breakfast', 'Garden Courtyard'],
        pricePerNight: p.stay?.estimatedCostPerNight ? Math.round(p.stay.estimatedCostPerNight * 0.5) : 1200,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80'
      },
      {
        type: 'comfort',
        name: `${destName} Boutique Palace View`,
        rating: 4.8,
        amenities: ['Pool', 'Rooftop Terrace', 'Buffet Breakfast', 'Airport Pickup'],
        pricePerNight: p.stay?.estimatedCostPerNight || 3500,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80'
      },
      {
        type: 'luxury',
        name: `The Grand ${destName} Royal Haveli`,
        rating: 4.9,
        amenities: ['Private Chauffeur', 'Ayurvedic Spa', 'Fine Dining Courtyard', 'Butler'],
        pricePerNight: p.stay?.estimatedCostPerNight ? Math.round(p.stay.estimatedCostPerNight * 2.5) : 8500,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80'
      }
    ];

    setTripPlan({
      _id: serverTrip._id,
      id: serverTrip.id || serverTrip._id,
      shareId: serverTrip.shareId,
      destination: { name: destName },
      totalDays,
      travelers: pax,
      startDate: sDate,
      endDate: eDate,
      budgetBreakdown,
      dayPlans: adaptedDays,
      travelOptions: transportList,
      stayOptions: stayList,
      isOffline: isOffline || p.meta?.source === 'offline'
    });
    setLoading(false);
  }

  const saveTrip = async () => {
    if (!tripPlan || isSaved) return;

    try {
      const tripRecord = {
        id: tripPlan.id || `trip_${Date.now()}`,
        _id: tripPlan._id || `trip_${Date.now()}`,
        shareId: tripPlan.shareId || `share_${Date.now().toString(36)}`,
        destination: tripPlan.destination.name,
        startDate: tripPlan.startDate,
        endDate: tripPlan.endDate,
        totalDays: tripPlan.totalDays,
        travelers: tripPlan.travelers,
        budget: tripPlan.budgetBreakdown.total,
        plan: tripPlan,
        createdAt: new Date().toISOString()
      };

      // 1. Try server persistence
      try {
        await tripApi.saveTrip(tripRecord);
      } catch (err) {
        console.warn('[TripPlan] Remote save failed, preserved locally:', err);
      }

      // 2. LocalStorage persistence for instant offline retrieval
      const existing = JSON.parse(localStorage.getItem('my_trips') || '[]');
      const filtered = existing.filter((t: { id: string }) => t.id !== tripRecord.id);
      localStorage.setItem('my_trips', JSON.stringify([tripRecord, ...filtered]));

      setIsSaved(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#C4512C', '#D85A32', '#B45309', '#355E53', '#FAF7F2']
      });
    } catch (err) {
      console.error('[TripPlan] Error saving trip:', err);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/trip/share/${tripPlan?.shareId || tripPlan?.id || 'public'}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  if (loading) {
    return <TripPlanSkeleton />;
  }

  if (error || !tripPlan) {
    return (
      <div className="min-h-screen bg-background pt-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-card p-8 rounded-2xl border border-border shadow-warm">
          <Compass size={40} className="text-primary mx-auto mb-4" />
          <h2 className="font-serif-display text-2xl font-bold text-foreground mb-2">
            Could Not Load Itinerary
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            We preserved your blueprint. Please return to adjust your dates or destination.
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-warm hover:brightness-105"
          >
            <span>Return to Blueprint</span>
          </Link>
        </div>
      </div>
    );
  }

  const destName = tripPlan.destination?.name || 'Jaipur';
  const startLoc = tripData?.startLocation || 'Origin City';

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-24 pb-20 selection:bg-primary/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Top Bar Navigation & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-4">
            <Link
              to="/suggestions"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Destinations</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Honest Offline Mode Badge */}
              {tripPlan.isOffline && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold"
                  title="Generated using local cached intelligence. All routes and spots remain functional."
                >
                  <WifiOff size={12} />
                  <span>Offline Curated</span>
                </div>
              )}

              {/* Share Button */}
              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                title="Copy public link"
              >
                {copiedShare ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
                <span>{copiedShare ? 'Copied Link!' : 'Share Itinerary'}</span>
              </button>

              {/* Print Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <Printer size={14} />
                <span>Print Dispatches</span>
              </button>

              {/* Save Trip Button */}
              <button
                type="button"
                onClick={saveTrip}
                disabled={isSaved}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-warm transition-all ${
                  isSaved
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-primary text-primary-foreground hover:brightness-105 active:scale-95'
                }`}
              >
                {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                <span>{isSaved ? 'Saved to Archives' : 'Save to My Trips'}</span>
              </button>
            </div>
          </div>

          {/* Editorial Trip Summary Banner */}
          <SectionErrorBoundary title="Trip Summary Banner">
            <TripSummary
              tripPlan={tripPlan}
              startLocation={startLoc}
              formatCurrency={formatINR}
              onSave={saveTrip}
              isSaved={isSaved}
            />
          </SectionErrorBoundary>

          {/* Section: Transit & Accommodation Choices */}
          <SectionErrorBoundary title="Transit & Accommodation Engine">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

              {/* Transport Column */}
              <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-warm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <Train size={14} />
                    <span>Transit Recommendations</span>
                  </div>
                  <span className="text-xs text-muted-foreground">From {startLoc}</span>
                </div>

                <div className="space-y-3">
                  {tripPlan.travelOptions.map((opt) => (
                    <div
                      key={opt.type}
                      onClick={() => setSelectedTravelType(opt.type)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedTravelType === opt.type
                          ? 'border-primary bg-primary/5 shadow-xs'
                          : 'border-border/60 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground">
                          {opt.type === 'flight' && <Plane size={18} />}
                          {opt.type === 'train' && <Train size={18} />}
                          {opt.type === 'bus' && <Bus size={18} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{opt.operator}</span>
                            {opt.badge === 'fastest' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700">Fastest</span>
                            )}
                            {opt.badge === 'cheapest' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">Cheapest</span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {opt.duration} • Depart {opt.departure}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-serif-display font-bold text-foreground text-sm">
                          {formatINR(opt.cost)}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">per seat</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stay Column */}
              <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-warm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <Home size={14} />
                    <span>Lodging Tiers</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{destName} Area</span>
                </div>

                <div className="space-y-3">
                  {tripPlan.stayOptions.map((stay) => (
                    <div
                      key={stay.type}
                      onClick={() => setSelectedStayType(stay.type)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedStayType === stay.type
                          ? 'border-primary bg-primary/5 shadow-xs'
                          : 'border-border/60 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-border flex-shrink-0">
                          <ImageWithFallback
                            src={stay.image}
                            alt={stay.name}
                            className="w-full h-full object-cover"
                            fallbackIcon={Home}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-foreground line-clamp-1">{stay.name}</span>
                            <div className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-700 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              <Star size={10} className="fill-amber-500 text-amber-500" />
                              <span>{stay.rating}</span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {stay.amenities.slice(0, 2).join(' • ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="font-serif-display font-bold text-foreground text-sm">
                          {formatINR(stay.pricePerNight)}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">/ night</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </SectionErrorBoundary>

          {/* Topographic Map Loop */}
          <SectionErrorBoundary title="Interactive Map Route">
            <MapSection destination={destName} />
          </SectionErrorBoundary>

          {/* Daily Timeline Itinerary with Time-of-Day Tints */}
          <SectionErrorBoundary title="Timeline Schedule">
            <TimelineItinerary
              dayPlans={tripPlan.dayPlans}
              stayOptions={tripPlan.stayOptions}
              formatCurrency={formatINR}
            />
          </SectionErrorBoundary>

        </div>
      </div>
    </PageTransition>
  );
};

export default TripPlanPage;
