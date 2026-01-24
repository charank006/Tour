import { ArrowLeftRight, Calendar, Download, MapPin, Users, Wallet } from 'lucide-react';
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
            className="card-travel mb-8 bg-primary/5"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 badge-travel">
                    <MapPin size={16} className="text-primary" />
                    <span>Your Trip Plan</span>
                </div>
                <button className="btn-outline py-2 px-4 text-sm inline-flex items-center gap-2">
                    <Download size={16} />
                    Save Plan
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    {startLocation}
                    <ArrowLeftRight className="text-primary" size={24} />
                    {tripPlan.destination.name}
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-semibold text-foreground">{tripPlan.totalDays} Days</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Users size={18} className="text-primary" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Travelers</div>
                        <div className="font-semibold text-foreground">{tripPlan.travelers} People</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Dates</div>
                        <div className="font-semibold text-foreground text-sm">
                            {new Date(tripPlan.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(tripPlan.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Wallet size={18} className="text-primary-foreground" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Est. Total</div>
                        <div className="font-bold text-primary">{formatCurrency(tripPlan.budgetBreakdown.total)}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TripSummary;
