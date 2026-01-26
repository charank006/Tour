import { ArrowRight, Calendar, Download, MapPin, Users, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface Destination {
    name: string;
}

interface BudgetBreakdown {
    total: number;
}

interface TripPlan {
    destination: Destination;
    totalDays: number;
    travelers: string;
    startDate: string;
    endDate: string;
    budgetBreakdown: BudgetBreakdown;
}

interface TripSummaryProps {
    tripPlan: TripPlan;
    startLocation: string;
    formatCurrency: (amount: number) => string;
}

const TripSummary = ({ tripPlan, startLocation, formatCurrency }: TripSummaryProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full bg-card/80 backdrop-blur-xl border border-border/40 shadow-sm rounded-3xl p-6 mb-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* Left Group: Route & Meta */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-primary font-bold tracking-wide uppercase mb-2">
                        <div className="bg-primary/10 p-1 rounded-md">
                            <MapPin size={12} className="text-primary" />
                        </div>
                        Trip Itinerary
                    </div>

                    <h1 className="text-2xl md:text-4xl font-black text-foreground flex flex-wrap items-center gap-3 mb-3">
                        {startLocation}
                        <ArrowRight className="text-muted-foreground/30" size={24} />
                        {tripPlan.destination.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-medium">
                        <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
                            <Calendar size={14} className="text-foreground/70" />
                            <span className="text-foreground">{new Date(tripPlan.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            <ArrowRight size={10} className="text-muted-foreground" />
                            <span className="text-foreground">{new Date(tripPlan.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            <span className="text-muted-foreground ml-1">({tripPlan.totalDays} Days)</span>
                        </span>

                        <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
                            <Users size={14} className="text-foreground/70" />
                            <span className="text-foreground">{tripPlan.travelers} Travelers</span>
                        </span>
                    </div>
                </div>

                {/* Right Group: Budget & Action */}
                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-4 md:gap-8 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border/50 md:pl-8">

                    <div className="flex-1 md:text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5 justify-start md:justify-end">
                            <Wallet size={12} /> Est. Budget
                        </div>
                        <div className="text-3xl font-black text-primary">
                            {formatCurrency(tripPlan.budgetBreakdown.total)}
                        </div>
                    </div>

                    <button className="btn-primary py-2.5 px-6 text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        <Download size={16} strokeWidth={2.5} />
                        Save
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TripSummary;
