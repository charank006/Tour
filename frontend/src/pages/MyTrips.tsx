import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Compass, Calendar, MapPin, Plus, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";

interface SavedTrip {
    id: string;
    savedAt: string;
    destination: string;
    startDate: string;
    endDate: string;
    travelers: number | string;
    totalDays: number;
    totalCost: number;
    plan: Record<string, unknown>;
}

// Deterministic gradient from destination name
const getCardGradient = (name: string) => {
    const gradients = [
        'from-blue-500/80 to-indigo-700/80',
        'from-emerald-500/80 to-teal-700/80',
        'from-amber-500/80 to-orange-700/80',
        'from-rose-500/80 to-pink-700/80',
        'from-violet-500/80 to-purple-700/80',
        'from-cyan-500/80 to-sky-700/80',
    ];
    const idx = (name.charCodeAt(0) + name.length) % gradients.length;
    return gradients[idx];
};

const MyTrips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<SavedTrip[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("my_trips");
            setTrips(raw ? JSON.parse(raw) : []);
        } catch { setTrips([]); }
    }, []);

    const deleteTrip = (id: string) => {
        const updated = trips.filter(t => t.id !== id);
        setTrips(updated);
        localStorage.setItem("my_trips", JSON.stringify(updated));
    };

    const viewTrip = (trip: SavedTrip) => {
        navigate("/trip-plan", { state: { ...trip.plan, destination: { name: trip.destination }, fromMyTrips: true } });
    };

    const fmt = (iso: string) => {
        if (!iso) return "N/A";
        try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
        catch { return iso; }
    };

    const fmtCurrency = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container mx-auto px-4">

                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-end justify-between mb-10"
                >
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Your Collection</p>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">My Trips</h1>
                        <p className="text-muted-foreground mt-2">Your saved adventures and planned itineraries.</p>
                    </div>
                    <Link to="/plan">
                        <Button size="sm" className="rounded-full gap-2 px-5 btn-accent text-sm font-bold hidden md:flex shadow-orange">
                            <Plus size={16} /> New Trip
                        </Button>
                    </Link>
                </motion.div>

                {trips.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <EmptyState
                            icon={Compass}
                            title="No trips saved yet"
                            description="Plan a trip and click 'Save to My Trips' on the trip plan page to see them here."
                            action={
                                <Link to="/plan">
                                    <Button size="lg" className="btn-primary rounded-full gap-2 px-8">
                                        <Plus size={18} /> Start Planning Your First Trip
                                    </Button>
                                </Link>
                            }
                        />
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {trips.map((trip, idx) => {
                                const gradient = getCardGradient(trip.destination);
                                return (
                                    <motion.div
                                        key={trip.id}
                                        initial={{ opacity: 0, y: 28, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                                        transition={{ duration: 0.45, delay: idx * 0.07 }}
                                        whileHover={{ y: -6 }}
                                        className="group bg-card border border-border/50 rounded-3xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 cursor-default"
                                    >
                                        {/* Gradient header */}
                                        <div className={`relative bg-gradient-to-br ${gradient} px-6 py-7 overflow-hidden`}>
                                            {/* Shimmer sweep on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                                            <div className="flex items-start justify-between relative z-10">
                                                <div>
                                                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-black text-white mb-3">
                                                        {trip.destination.charAt(0).toUpperCase()}
                                                    </div>
                                                    <h3 className="text-xl font-black text-white leading-tight">{trip.destination}</h3>
                                                    <p className="text-white/60 text-xs mt-1">Saved {fmt(trip.savedAt)}</p>
                                                </div>
                                                <span className="text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    {trip.totalDays ?? "?"} days
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card body */}
                                        <div className="px-6 py-5 space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar size={13} className="shrink-0 text-accent/70" />
                                                <span>{fmt(trip.startDate)} → {fmt(trip.endDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin size={13} className="shrink-0 text-accent/70" />
                                                <span>{trip.travelers ?? 1} traveler(s)</span>
                                            </div>
                                            {trip.totalCost > 0 && (
                                                <div className="pt-3 border-t border-border/40">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Estimated Total</div>
                                                    <div className="text-2xl font-black text-accent tracking-tight">{fmtCurrency(trip.totalCost)}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="px-6 pb-6 flex gap-2.5">
                                            <motion.button
                                                whileTap={{ scale: 0.96 }}
                                                onClick={() => viewTrip(trip)}
                                                className="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-primary text-primary-foreground rounded-2xl py-3 hover:bg-primary/90 transition-colors shadow-soft"
                                            >
                                                <Eye size={15} /> View Plan
                                            </motion.button>
                                            <motion.button
                                                whileTap={{ scale: 0.96 }}
                                                onClick={() => deleteTrip(trip.id)}
                                                className="flex items-center justify-center px-4 py-3 rounded-2xl bg-destructive/[0.08] text-destructive hover:bg-destructive/[0.15] transition-colors"
                                                title="Remove trip"
                                            >
                                                <Trash2 size={15} />
                                            </motion.button>
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
