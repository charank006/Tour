import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  Share2,
  Check,
  Tag,
  ArrowRight
} from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { tripApi, ServerTripResponse } from '@/api/api';
import { formatINR, formatDateRange, calculateDays } from '@/lib/formatters';

interface SavedTripItem {
  id: string;
  _id?: string;
  shareId?: string;
  destination: string;
  startLocation?: string;
  startDate: string;
  endDate: string;
  travelers: number | string;
  durationDays?: number;
  budget?: number;
  createdAt?: string;
  plan?: Record<string, unknown>;
}

export const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<SavedTripItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      let loaded: SavedTripItem[] = [];

      // 1. Try server fetch
      try {
        const serverTrips = await tripApi.getMyTrips();
        if (Array.isArray(serverTrips) && serverTrips.length > 0) {
          loaded = serverTrips.map((st) => ({
            id: st.id || st._id,
            _id: st._id,
            shareId: st.shareId,
            destination: st.destination,
            startLocation: st.startLocation,
            startDate: st.startDate,
            endDate: st.endDate,
            travelers: st.travelers,
            durationDays: st.durationDays || calculateDays(st.startDate, st.endDate),
            budget: st.budget,
            createdAt: st.createdAt,
            plan: st.plan as unknown as Record<string, unknown>
          }));
        }
      } catch (err) {
        console.warn('[MyTrips] Server fetch failed, reading local storage:', err);
      }

      // 2. Merge with local storage
      try {
        const rawLocal = localStorage.getItem('my_trips');
        if (rawLocal) {
          const localParsed: SavedTripItem[] = JSON.parse(rawLocal);
          for (const lt of localParsed) {
            if (!loaded.some((t) => t.id === lt.id)) {
              loaded.push(lt);
            }
          }
        }
      } catch (err) {
        console.warn('[MyTrips] local storage parse error:', err);
      }

      setTrips(loaded);
      setLoading(false);
    };

    fetchTrips();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await tripApi.deleteTrip(id);
    } catch (err) {
      console.warn('[MyTrips] remote delete failed:', err);
    }

    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    try {
      const rawLocal = localStorage.getItem('my_trips');
      if (rawLocal) {
        const localParsed = JSON.parse(rawLocal).filter((t: { id: string }) => t.id !== id);
        localStorage.setItem('my_trips', JSON.stringify(localParsed));
      }
    } catch (err) {
      console.warn('[MyTrips] local delete sync error:', err);
    }
  };

  const handleShare = (trip: SavedTripItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareKey = trip.shareId || trip.id;
    const url = `${window.location.origin}/trip/share/${shareKey}`;
    navigator.clipboard.writeText(url);
    setCopiedId(trip.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleView = (trip: SavedTripItem) => {
    navigate('/trip-plan', {
      state: {
        destination: { name: trip.destination },
        startLocation: trip.startLocation || 'Mumbai',
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelers: trip.travelers,
        budget: trip.budget,
        ...trip.plan
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 selection:bg-primary/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Editorial Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-10 border-b border-border/70 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles size={12} />
              <span>Personal Travel Archives</span>
            </div>
            <h1 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
              My Saved Journeys
            </h1>
            <p className="text-muted-foreground text-base mt-2">
              Your personalized expeditions, bookmarked itineraries, and offline dispatches.
            </p>
          </div>

          <Link
            to="/plan"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-full shadow-warm hover:brightness-105 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Design New Trip</span>
          </Link>
        </div>

        {/* Trips List or Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-56 rounded-3xl bg-muted/40 animate-pulse border border-border/60" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="max-w-md mx-auto py-12">
            <EmptyState
              icon={Compass}
              title="No Expeditions Bookmarked Yet"
              description="Your saved travel blueprints and ticket stubs will appear here once you design an itinerary."
              actionLabel="Create Your First Itinerary"
              actionHref="/plan"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {trips.map((trip) => {
                const days = trip.durationDays || calculateDays(trip.startDate, trip.endDate);
                return (
                  <motion.div
                    key={trip.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleView(trip)}
                    className="group relative bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-warm hover:shadow-warm-lg hover:border-primary/40 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                  >
                    {/* Ticket Stub Top Notch Decoration */}
                    <div className="absolute top-0 right-10 w-6 h-3 bg-background rounded-b-full border-b border-x border-border/80" />

                    <div>
                      {/* Destination & Badges */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
                            <MapPin size={13} className="text-primary" />
                            <span>{trip.startLocation ? `From ${trip.startLocation}` : 'Roundtrip'}</span>
                          </div>
                          <h3 className="font-serif-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {trip.destination}
                          </h3>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
                          {days} {days === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>

                      {/* Details strip */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground py-3 border-y border-border/60 mb-6">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                        </div>
                        <span>•</span>
                        <div>
                          <span>{trip.travelers} Traveler(s)</span>
                        </div>
                        {trip.budget && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-foreground">
                              {formatINR(trip.budget)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={(e) => handleShare(trip, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
                          title="Share Trip"
                        >
                          {copiedId === trip.id ? <Check size={12} className="text-green-600" /> : <Share2 size={12} />}
                          <span>{copiedId === trip.id ? 'Copied' : 'Share'}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(trip.id, e)}
                          className="inline-flex items-center gap-1 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete archived trip"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                        <span>Open Field Notes</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyTrips;
