import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface CardItem {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    category?: string;
    badge?: string;
}

interface StackedCardsSectionProps {
    title: string;
    subtitle?: string;
    items: CardItem[];
    align?: 'left' | 'right';
    ctaLink?: string;
    ctaText?: string;
}

/** Individual card with mouse-follow tilt */
const TiltCard = ({ item, index, total, hovered }: { item: CardItem; index: number; total: number; hovered: boolean }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [imageError, setImageError] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-80, 80], [6, -6]), { stiffness: 180, damping: 22 });
    const rotateY = useSpring(useTransform(x, [-80, 80], [-6, 6]), { stiffness: 180, damping: 22 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
    };
    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="absolute w-56 md:w-[280px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-card cursor-pointer"
            style={{ rotateX, rotateY }}
            initial={{ rotate: (index % 2 === 0 ? 1 : -1) * (index * 2), y: index * 4 }}
            animate={hovered ? {
                x: (index - (total - 1) / 2) * 150,
                y: 0,
                rotate: (index - (total - 1) / 2) * 6,
                scale: 1.02,
                zIndex: index + 10,
            } : {
                x: index * 10,
                y: index * 10,
                rotate: (index % 2 === 0 ? 3 : -3) * (index + 1),
                scale: 1 - index * 0.04,
                zIndex: total - index,
            }}
            whileHover={{ scale: 1.07, zIndex: 100, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
            {!imageError ? (
                <img
                    src={item.image}
                    alt={item.title}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-muted-foreground font-medium text-lg opacity-50">No Image</span>
                </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* Top badge */}
            {item.badge && (
                <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider glass px-3 py-1 rounded-full text-white border border-white/20">
                        {item.badge}
                    </span>
                </div>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {item.category && (
                    <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-1">
                        {item.category}
                    </span>
                )}
                <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                <p className="text-sm text-white/70 mt-0.5">{item.subtitle}</p>
            </div>
        </motion.div>
    );
};

const StackedCardsSection = ({ title, subtitle, items, align = 'left', ctaLink, ctaText }: StackedCardsSectionProps) => {
    const [hovered, setHovered] = useState(false);
    const isLeft = align === 'left';

    return (
        <section className="py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className={`flex flex-col md:flex-row items-center gap-16 ${isLeft ? '' : 'md:flex-row-reverse'}`}>

                    {/* Text side */}
                    <div className="md:w-1/2 relative z-10">
                        {/* Glowing accent dot */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="w-12 h-1.5 rounded-full bg-accent mb-6"
                        />

                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight"
                        >
                            {title}
                        </motion.h2>

                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.12, duration: 0.6 }}
                                className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed"
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.22, duration: 0.5 }}
                        >
                            <Link
                                to={ctaLink || '#'}
                                className="group inline-flex items-center gap-2 font-bold text-lg text-foreground border-b-2 border-accent pb-0.5 hover:text-accent transition-colors duration-300"
                            >
                                {ctaText || 'Explore Collection'}
                                <motion.span
                                    className="inline-block"
                                    animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
                                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <ArrowUpRight size={20} />
                                </motion.span>
                            </Link>
                        </motion.div>

                        {/* Floating count hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 text-xs text-muted-foreground/60 uppercase tracking-widest"
                        >
                            Hover the cards to explore →
                        </motion.p>
                    </div>

                    {/* Cards side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="md:w-1/2 relative h-[400px] md:h-[520px] w-full flex items-center justify-center"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {items.map((item, index) => (
                            <TiltCard
                                key={item.id}
                                item={item}
                                index={index}
                                total={items.length}
                                hovered={hovered}
                            />
                        ))}

                        {/* Background decorative blur circle */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.06, 0.12, 0.06] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-72 h-72 rounded-full"
                                style={{ background: 'radial-gradient(circle, hsl(38 92% 50% / 0.6) 0%, transparent 70%)' }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default StackedCardsSection;
