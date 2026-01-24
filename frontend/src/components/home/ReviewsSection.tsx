import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const reviews = [
    {
        id: 1,
        name: "Elena Rodriguez",
        role: "Adventure Traveler",
        text: "PlanYours completely transformed how I travel. The AI suggested hidden waterfalls in Bali that weren't on any blog!",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
        id: 2,
        name: "Mark & Sarah",
        role: "Honeymooners",
        text: "We wanted a mix of luxury and culture for our honeymoon. The itinerary was perfectly balanced and within budget.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
    },
    {
        id: 3,
        name: "David Chen",
        role: "Solo Backpacker",
        text: "The budget breakdowns are a lifesaver. I knew exactly how much to save for my Japan trip. Super accurate.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
        id: 4,
        name: "Priya Patel",
        role: "Family Vacation",
        text: "Planning for a family of 5 is a nightmare usually. This app made it fun. The kids loved the activity choices.",
        rating: 4,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    }
];

const ReviewsSection = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    return (
        <section className="py-24 bg-secondary/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-foreground mb-4"
                    >
                        Loved by Travelers
                    </motion.h2>
                    <p className="text-muted-foreground text-lg">
                        Join thousands of happy wanderers who planned their perfect trip.
                    </p>
                </div>

                <motion.div
                    ref={carouselRef}
                    className="cursor-grab active:cursor-grabbing overflow-hidden"
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-6"
                    >
                        {reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                className="min-w-[300px] md:min-w-[400px] p-8 rounded-3xl bg-card border border-border shadow-soft relative flex flex-col items-start"
                            >
                                <Quote className="text-primary/20 absolute top-6 right-8 w-12 h-12" />

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={`${i < review.rating ? 'text-accent fill-accent' : 'text-gray-300'} transition-colors`}
                                        />
                                    ))}
                                </div>

                                <p className="text-lg text-foreground mb-8 line-clamp-3 italic">
                                    "{review.text}"
                                </p>

                                <div className="mt-auto flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{review.name}</h4>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ReviewsSection;
