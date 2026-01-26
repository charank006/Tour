import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

interface Review {
    id: number;
    name: string;
    type: string;
    rating: number;
    text: string;
    location: string;
    date: string;
}

const reviews: Review[] = [
    {
        id: 1,
        name: "Sarah Jenkins",
        type: "Solo Traveler",
        rating: 5,
        text: "The AI itinerary generator was a game changer! It found hidden gems in Kyoto that I would have never discovered on my own. The budget estimation was spot on too.",
        location: "Japan Trip",
        date: "Oct 2023"
    },
    {
        id: 2,
        name: "The Malhotra Family",
        type: "Family of 4",
        rating: 5,
        text: "Planning a trip for kids and grandparents is a nightmare, but this app made it effortless. We got a perfectly balanced schedule with activities for everyone.",
        location: "Singapore",
        date: "Dec 2023"
    },
    {
        id: 3,
        name: "David & Emma",
        type: "Couple",
        rating: 5,
        text: "We wanted a romantic getaway without the stress of planning logistics. The suggestions for 'Comfort' stays were exactly our vibe. best travel tool we've used.",
        location: "Paris",
        date: "Sep 2023"
    },
    {
        id: 4,
        name: "Alex Thorne",
        type: "Adventure Seeker",
        rating: 4,
        text: "Solid recommendations for hiking trails in Patagonia. I appreciated the weather alerts and packing tips included in the generated plan.",
        location: "Chile",
        date: "Nov 2023"
    },
    {
        id: 5,
        name: "Priya Patel",
        type: "Budget Traveler",
        rating: 5,
        text: "I was skeptical about the budget planning, but it helped me stick to my ₹50k limit for a week in Vietnam. The hostel suggestions were safe and social.",
        location: "Vietnam",
        date: "Jan 2024"
    },
    {
        id: 6,
        name: "Marcus Chen",
        type: "Business + Leisure",
        rating: 5,
        text: "Used it to plan a quick weekend extension after a conference in London. Efficient, fast, and high-quality recommendations.",
        location: "London",
        date: "Feb 2024"
    }
];

const Reviews = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-background pt-24 pb-12">
                <div className="container mx-auto px-4">

                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight"
                        >
                            Loved by Travelers
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground"
                        >
                            See how thousands of explorers are planning their perfect trips with our AI-powered planner.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="mb-6 flex justify-between items-start">
                                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <Quote size={24} className="fill-current" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} size={16} className="text-orange-400 fill-orange-400" />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-foreground/80 leading-relaxed mb-6 italic">
                                    "{review.text}"
                                </p>

                                <div className="border-t border-border/50 pt-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground text-sm">{review.name}</h4>
                                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                            {review.type} • <span className="text-primary">{review.location}</span>
                                        </p>
                                    </div>
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
