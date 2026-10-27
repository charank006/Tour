import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useRef, useState } from 'react';
import EmptyState from "@/components/ui/EmptyState";

const reviews = [
    { id: 1, name: "Aisha Kapoor", role: "Solo Traveler • Mumbai", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", text: "I always struggled with planning solo trips that felt safe yet adventurous. PlanYours suggested the perfect mix of crowded spots and quiet cafes in Udaipur. The 'Hidden Gems' feature is a game changer!" },
    { id: 2, name: "James & Sarah", role: "Couple • London", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", text: "We wanted a honeymoon in Kerala that wasn't just tourist traps. The itinerary generator gave us a plan that included a private houseboat and a local cooking class. It felt so personal and seamless." },
    { id: 3, name: "Rohan Mehta", role: "Photography Enthusiast • Delhi", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", text: "As a photographer, I need to be at the right place at the right time. The 'Sunrise' and 'Sunset' slots in the itinerary are incredibly accurate. Capturing the Taj Mahal at dawn was magical." },
    { id: 4, name: "Priya Patel", role: "Family Vacation • Gujarat", rating: 4, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", text: "Traveling with three kids is no joke. The app helped us find family-friendly activities in Manali that kept everyone entertained. The budget estimator was spot on — no nasty surprises." },
    { id: 5, name: "David Chen", role: "Backpacker • Singapore", rating: 5, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop", text: "I love how flexible the plans are. I swapped a museum day for a trekking experience last minute, and the app reorganized my entire schedule instantly. Best travel companion app I've used." },
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
    <div className="min-w-[320px] md:min-w-[380px] p-7 rounded-3xl bg-card border border-border/60 shadow-soft relative flex flex-col items-start shrink-0 select-none">
        <Quote className="absolute top-6 right-6 text-accent/10 w-12 h-12" />
        <div className="flex gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className={i < review.rating ? 'text-accent fill-accent' : 'text-gray-200'} />
            ))}
        </div>
        <p className="text-sm text-foreground/80 mb-6 leading-relaxed line-clamp-4 italic">"{review.text}"</p>
        <div className="mt-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent/20 shrink-0">
                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h4 className="font-bold text-foreground text-sm">{review.name}</h4>
                <p className="text-xs text-muted-foreground">{review.role}</p>
            </div>
        </div>
    </div>
);

const ReviewsSection = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);

    return (
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-secondary/10 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-4"
                    >
                        Traveler Stories
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight"
                    >
                        Loved by{' '}
                        <span className="text-gradient-brand">Travelers</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-xl mx-auto"
                    >
                        Join thousands of happy wanderers who planned their perfect trip.
                    </motion.p>
                </div>

                {reviews.length === 0 ? (
                    <div className="max-w-2xl mx-auto">
                        <EmptyState icon={Quote} title="No reviews yet" description="Be the first to share your experience!" action={<button className="btn-outline">Write a Review</button>} />
                    </div>
                ) : (
                    /* CSS marquee — no JS animation frame needed, rock-solid */
                    <div
                        className="relative"
                        style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
                    >
                        <div
                            ref={trackRef}
                            onMouseEnter={() => setPaused(true)}
                            onMouseLeave={() => setPaused(false)}
                            className="flex gap-5 overflow-hidden"
                        >
                            {/* Two identical sets for seamless loop */}
                            {[0, 1].map(set => (
                                <div
                                    key={set}
                                    className="flex gap-5 shrink-0"
                                    style={{
                                        animation: `marquee 38s linear infinite`,
                                        animationPlayState: paused ? 'paused' : 'running',
                                    }}
                                >
                                    {reviews.map(r => <ReviewCard key={`${set}-${r.id}`} review={r} />)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewsSection;
