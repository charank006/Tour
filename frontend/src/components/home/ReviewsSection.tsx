import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const reviews = [
    {
        id: 1,
        name: "Aisha Kapoor",
        role: "Solo Traveler • Mumbai",
        text: "I always struggled with planning solo trips that felt safe yet adventurous. PlanYours suggested the perfect mix of crowded spots and quiet cafes in Udaipur. The 'Hidden Gems' feature is a game changer!",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
        id: 2,
        name: "James & Sarah",
        role: "Couple • London",
        text: "We wanted a honeymoon in Kerala that wasn't just tourist traps. The itinerary generator gave us a plan that included a private houseboat and a local cooking class. It felt so personal and seamless.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
    },
    {
        id: 3,
        name: "Rohan Mehta",
        role: "Photography Enthusiast • Delhi",
        text: "As a photographer, I need to be at the right place at the right time. The 'Sunrise' and 'Sunset' slots in the itinerary are incredibly accurate. Capturing the Taj Mahal at dawn was magical.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
        id: 4,
        name: "Priya Patel",
        role: "Family Vacation • Gujarat",
        text: "Traveling with three kids is no joke. The app helped us find family-friendly activities in Manali that kept everyone entertained. The budget estimator was spot on, no nasty surprises.",
        rating: 4,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
        id: 5,
        name: "David Chen",
        role: "Backpacker • Singapore",
        text: "I love how flexible the plans are. I swapped a museum day for a trekking experience last minute, and the app reorganized my entire schedule instantly. Best travel companion app I've used.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
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
