import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface CardItem {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    category?: string;
}

interface StackedCardsSectionProps {
    title: string;
    subtitle?: string;
    items: CardItem[];
    align?: 'left' | 'right';
}

const StackedCardsSection = ({ title, subtitle, items, align = 'left' }: StackedCardsSectionProps) => {
    const [hovered, setHovered] = useState(false);

    // Layout: Text on one side, cards on the other.
    // If align left: Text Left, Cards Right.
    const isLeft = align === 'left';

    return (
        <section className="py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className={`flex flex-col md:flex-row items-center gap-16 ${isLeft ? '' : 'md:flex-row-reverse'}`}>

                    {/* Text Content */}
                    <div className="md:w-1/2 relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
                        >
                            {title}
                        </motion.h2>
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-muted-foreground mb-8 max-w-md"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group inline-flex items-center gap-2 text-primary font-semibold text-lg"
                        >
                            Explore Collection
                            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.button>
                    </div>

                    {/* Stacked Cards */}
                    <div
                        className="md:w-1/2 relative h-[400px] md:h-[500px] w-full flex items-center justify-center perspective-1000"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {items.map((item, index) => {
                            // Calculate stacked position
                            // Reverse index for z-index (first item on bottom or top? usually first item on top to be seen, or last item on top?)
                            // Let's put first item on top.
                            const reverseIndex = items.length - 1 - index;

                            return (
                                <motion.div
                                    key={item.id}
                                    className="absolute w-64 md:w-80 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-card"
                                    initial={{
                                        rotate: (index % 2 === 0 ? 1 : -1) * (index * 2), // random-ish initial rotation
                                        y: index * 4,
                                    }}
                                    animate={hovered ? {
                                        // Fan out logic
                                        x: (index - (items.length - 1) / 2) * 140, // spread horizontally
                                        y: 0,
                                        rotate: (index - (items.length - 1) / 2) * 5, // fan rotation
                                        scale: 1,
                                        zIndex: index + 10 // ensure proper layering when spread
                                    } : {
                                        // Stacked logic
                                        x: index * 10, // slight offset
                                        y: index * 10,
                                        rotate: (index % 2 === 0 ? 3 : -3) * (index + 1),
                                        scale: 1 - index * 0.05,
                                        zIndex: items.length - index, // First item (index 0) has highest z-index? No, we want top item to be visible.
                                        // Actually if we fan out, we want to see all.
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        zIndex: 100,
                                        transition: { duration: 0.2 }
                                    }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                        {item.category && (
                                            <span className="text-xs font-bold uppercase tracking-wider text-accent mb-1 block">
                                                {item.category}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                        <p className="text-sm text-white/80">{item.subtitle}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default StackedCardsSection;
