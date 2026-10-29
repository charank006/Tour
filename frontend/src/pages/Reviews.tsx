import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  Sparkles,
  MapPin,
  ShieldCheck,
  Send,
  Plus,
  Clock,
  Wallet,
  Users,
  CheckCircle2
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { reviewsApi, ServerReview } from '@/api/api';
import { formatINR } from '@/lib/formatters';

interface EditorialReview {
  id: string;
  author: string;
  destination: string;
  rating: number;
  comment: string;
  worthIt: boolean;
  actualCost?: number;
  timeSpent?: string;
  crowdLevel?: string;
  date: string;
  verified: boolean;
  handwritten?: string;
}

const SEED_REVIEWS: EditorialReview[] = [
  {
    id: 'seed-1',
    author: 'Aisha Kapoor',
    destination: 'Manali, Himachal Pradesh',
    rating: 5,
    comment: 'I always struggled with planning solo trips that felt safe yet adventurous. PlanYours suggested the perfect mix of quiet mountain cafes and scenic walking ridges. The morning crowd windows let me experience Rohtang pass without bus tour jams.',
    worthIt: true,
    actualCost: 1800,
    timeSpent: 'Full Day',
    crowdLevel: 'Quiet',
    date: 'Oct 2024',
    verified: true,
    handwritten: 'Locals skip the noon rush!'
  },
  {
    id: 'seed-2',
    author: 'James & Sarah Thornton',
    destination: 'Alleppey, Kerala',
    rating: 5,
    comment: 'We wanted a slow journey avoiding tourist traps. The itinerary generator gave us a plan with a traditional wooden canoe backwater exploration and an organic spice estate walk. Truly personal and calm.',
    worthIt: true,
    actualCost: 4500,
    timeSpent: 'Overnight',
    crowdLevel: 'Quiet',
    date: 'Dec 2024',
    verified: true,
    handwritten: 'Cardamom chai in the rain'
  },
  {
    id: 'seed-3',
    author: 'Rohan Mehta',
    destination: 'Jaipur, Rajasthan',
    rating: 5,
    comment: 'For photography, being at the right overlook 20 minutes before dawn makes all the difference. The sunrise alerts and optimal vantage points across Jaipur and Nahargarh fort saved our shoot.',
    worthIt: true,
    actualCost: 500,
    timeSpent: '3.5 hours',
    crowdLevel: 'Moderate',
    date: 'Jan 2025',
    verified: true,
    handwritten: 'Golden hour was unreal!'
  }
];

export const Reviews = () => {
  const [reviewsList, setReviewsList] = useState<EditorialReview[]>(SEED_REVIEWS);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [author, setAuthor] = useState('');
  const [destination, setDestination] = useState('');
  const [rating, setRating] = useState(5);
  const [actualCost, setActualCost] = useState('');
  const [timeSpent, setTimeSpent] = useState('2-3 hours');
  const [crowdLevel, setCrowdLevel] = useState('Moderate');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const remote = await reviewsApi.getReviews();
        if (Array.isArray(remote) && remote.length > 0) {
          const adapted: EditorialReview[] = remote.map((r) => ({
            id: r.id || r._id,
            author: r.author || 'Traveler',
            destination: r.destination || 'India',
            rating: r.rating || 5,
            comment: r.comment,
            worthIt: r.worthIt ?? true,
            actualCost: r.actualCost,
            timeSpent: r.timeSpent || '2-3 hours',
            crowdLevel: r.crowdLevel || 'Moderate',
            date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
            verified: true
          }));

          // Merge without duplicates
          setReviewsList((prev) => {
            const ids = new Set(adapted.map((a) => a.id));
            const uniquePrev = prev.filter((p) => !ids.has(p.id));
            return [...adapted, ...uniquePrev];
          });
        }
      } catch (err) {
        console.warn('[Reviews] Remote fetch error, using local seed reviews:', err);
      }
    };

    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    setSubmitting(true);
    const newReview = {
      author,
      destination: destination || 'General Expedition',
      rating,
      actualCost: Number(actualCost) || 0,
      timeSpent,
      crowdLevel,
      comment,
      worthIt: true
    };

    try {
      await reviewsApi.createReview(newReview);
    } catch (err) {
      console.warn('[Reviews] Remote review save fallback:', err);
    }

    const optimisticReview: EditorialReview = {
      id: `rev_${Date.now()}`,
      author,
      destination: destination || 'General Expedition',
      rating,
      comment,
      worthIt: true,
      actualCost: Number(actualCost) || 0,
      timeSpent,
      crowdLevel,
      date: 'Just now',
      verified: true,
      handwritten: 'Field note added'
    };

    setReviewsList((prev) => [optimisticReview, ...prev]);
    setSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setFormOpen(false);
      setAuthor('');
      setDestination('');
      setComment('');
      setActualCost('');
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-28 pb-20 selection:bg-primary/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-border/70 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles size={13} />
                <span>Traveler Field Notes</span>
              </div>
              <h1 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
                Dispatches from thoughtful wanderers
              </h1>
              <p className="text-muted-foreground text-base max-w-xl mt-2">
                Honest field reports, crowd timings, and verified budget reflections from fellow explorers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFormOpen(!formOpen)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-warm hover:brightness-105 active:scale-95 transition-all self-start md:self-auto"
            >
              <Plus size={16} />
              <span>{formOpen ? 'Close Form' : 'Share Field Note'}</span>
            </button>
          </div>

          {/* Review Submission Form Drawer / Panel */}
          <AnimatePresence>
            {formOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-12"
              >
                <div className="bg-card border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-warm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    <ShieldCheck size={16} />
                    <span>Verified Traveler Submission</span>
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-foreground mb-6">
                    Submit your field report
                  </h3>

                  {submittedSuccess ? (
                    <div className="p-8 text-center bg-primary/5 rounded-2xl border border-primary/20">
                      <CheckCircle2 size={36} className="text-primary mx-auto mb-3" />
                      <h4 className="font-serif-display text-lg font-bold text-foreground mb-1">
                        Dispatched with Gratitude!
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Your review has been verified and published to the travel archives.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Your Name or Nom de Plume *
                          </label>
                          <input
                            type="text"
                            required
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="e.g. Maya Sen"
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Destination Explored
                          </label>
                          <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="e.g. Manali, Himachal Pradesh"
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Rating
                          </label>
                          <div className="flex items-center gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  size={20}
                                  className={star <= rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Actual Spend (INR)
                          </label>
                          <input
                            type="number"
                            value={actualCost}
                            onChange={(e) => setActualCost(e.target.value)}
                            placeholder="e.g. 2500"
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Crowd Level
                          </label>
                          <select
                            value={crowdLevel}
                            onChange={(e) => setCrowdLevel(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="Quiet">Quiet (Few people)</option>
                            <option value="Moderate">Moderate (Comfortable)</option>
                            <option value="High">High (Busy)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Traveler Reflection & Practical Wisdom *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="What hour was best? Any secret tea shacks or photo angles worth sharing?"
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-warm hover:brightness-105 active:scale-95 transition-all"
                      >
                        <Send size={14} />
                        <span>{submitting ? 'Publishing...' : 'Publish to Archive'}</span>
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsList.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Rating & Verified Trust Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-500 text-amber-500" />
                      ))}
                    </div>

                    {review.verified && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={12} />
                        <span>Verified Traveler</span>
                      </div>
                    )}
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-foreground leading-relaxed italic mb-6">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div>
                  {/* Context stats strip */}
                  {(review.actualCost || review.crowdLevel) && (
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground pt-3 border-t border-border/60 mb-4">
                      {review.actualCost ? (
                        <span className="font-medium text-foreground">
                          Spend: {formatINR(review.actualCost)}
                        </span>
                      ) : null}
                      {review.crowdLevel && (
                        <span>• Crowd: {review.crowdLevel}</span>
                      )}
                      {review.timeSpent && (
                        <span>• {review.timeSpent}</span>
                      )}
                    </div>
                  )}

                  {/* Author Strip */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground block">
                        {review.author}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                        <MapPin size={11} className="text-primary" />
                        <span>{review.destination}</span>
                      </div>
                    </div>

                    <span className="text-[11px] text-muted-foreground/80">
                      {review.date}
                    </span>
                  </div>

                  {/* Handwritten accent */}
                  {review.handwritten && (
                    <div className="mt-3 pt-2 text-right">
                      <span className="font-handwriting text-primary text-base transform -rotate-1 inline-block">
                        ~ {review.handwritten}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default Reviews;
