import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Users, Search, Shield, Zap, Brain, Star } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const [travelers, setTravelers] = useState('2');

    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 140]);
    const contentOpacity = useTransform(scrollY, [0, 280], [1, 0]);
    const contentY = useTransform(scrollY, [0, 280], [0, -50]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/plan', { state: { destination, travelers } });
    };

    const floatingBadges = [
        { icon: Star, label: '4.9★ Rated', sub: 'by 12k+ travelers', delay: 0, cls: 'top-[22%] left-[6%] animate-float' },
        { icon: MapPin, label: '500+ Destinations', sub: 'across India', delay: 0.8, cls: 'top-[18%] right-[7%] animate-float-delay' },
        { icon: Zap, label: 'Instant Plans', sub: 'AI in seconds', delay: 1.6, cls: 'bottom-[30%] right-[5%] animate-float-slow' },
    ];

    const trustItems = [
        { icon: Shield, label: 'Secure & Private' },
        { icon: Zap, label: 'Plans in seconds' },
        { icon: Brain, label: 'AI-powered' },
        { icon: Star, label: 'Free to use' },
    ];

    return (
        <section className="relative h-screen min-h-[680px] flex items-center justify-center overflow-hidden">

            {/* Parallax background */}
            <motion.div
                className="absolute inset-0 z-0 will-change-transform"
                style={{ y: bgY, scale: 1.15 }}
            >
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=85&w=2400&auto=format&fit=crop"
                    alt="Travel destination"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/50 via-[#0A1628]/25 to-[#0A1628]/95" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/35 via-transparent to-[#0A1628]/35" />
            </motion.div>

            {/* Ambient glow orbs */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)', top: '5%', left: '0%' }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', bottom: '15%', right: '5%' }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                />
            </div>

            {/* Floating badges — desktop only */}
            {floatingBadges.map((badge, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + badge.delay }}
                    className={`absolute z-20 hidden lg:flex items-center gap-3 glass px-4 py-3 rounded-2xl shadow-xl ${badge.cls}`}
                >
                    <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                        <badge.icon size={16} className="text-accent" />
                    </div>
                    <div>
                        <div className="text-white text-sm font-bold leading-none">{badge.label}</div>
                        <div className="text-white/50 text-xs mt-0.5">{badge.sub}</div>
                    </div>
                </motion.div>
            ))}

            {/* Main content */}
            <motion.div
                className="container mx-auto px-4 relative z-20 text-center"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass text-white/80 text-sm font-medium mb-8 border border-white/10"
                    >
                        <Brain size={14} className="text-accent" />
                        AI-Powered Travel Planning
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.3 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.06]"
                    >
                        Curate Your<br />
                        <span className="shimmer-text">Dream Journey.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Seamlessly plan, organize, and experience the world with PlanYours.
                        AI-powered itineraries tailored just for you.
                    </motion.p>
                </motion.div>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <form
                        onSubmit={handleSearch}
                        className="glass-dark p-2 rounded-2xl flex flex-col md:flex-row shadow-2xl border border-white/10"
                    >
                        <div className="flex-1 px-5 py-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/10">
                            <MapPin className="text-accent/80 shrink-0" size={18} />
                            <div className="text-left w-full">
                                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Where</label>
                                <input
                                    type="text"
                                    placeholder="Destination"
                                    className="w-full bg-transparent border-none text-white placeholder-white/30 focus:outline-none text-sm md:text-base font-medium"
                                    value={destination}
                                    onChange={e => setDestination(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 px-5 py-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/10">
                            <Calendar className="text-accent/80 shrink-0" size={18} />
                            <div className="text-left w-full">
                                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">When</label>
                                <input
                                    type="text"
                                    placeholder="Add dates"
                                    className="w-full bg-transparent border-none text-white placeholder-white/30 focus:outline-none text-sm md:text-base font-medium"
                                    value={dates}
                                    onChange={e => setDates(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 px-5 py-4 flex items-center gap-3">
                            <Users className="text-accent/80 shrink-0" size={18} />
                            <div className="text-left w-full">
                                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Who</label>
                                <select
                                    className="w-full bg-transparent border-none text-white focus:outline-none text-sm md:text-base font-medium appearance-none cursor-pointer [&>option]:text-black"
                                    value={travelers}
                                    onChange={e => setTravelers(e.target.value)}
                                >
                                    <option value="1">1 Traveler</option>
                                    <option value="2">2 Travelers</option>
                                    <option value="3">3 Travelers</option>
                                    <option value="4+">4+ Travelers</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-accent px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 m-1 shrink-0"
                        >
                            <Search size={18} />
                            <span className="hidden md:inline">Search</span>
                        </button>
                    </form>

                    {/* Trust bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-5 text-white/40 text-xs"
                    >
                        {trustItems.map(({ icon: Icon, label }) => (
                            <span key={label} className="flex items-center gap-1.5">
                                <Icon size={11} className="text-accent/60" />
                                {label}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
                <motion.div
                    className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
                    animate={{ scaleY: [0, 1, 0], originY: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                />
            </motion.div>
        </section>
    );
};

export default Hero;
