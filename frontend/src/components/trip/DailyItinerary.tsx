import { Calendar, Sun, Sunset, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Activity {
    time: string;
    title: string;
    description: string;
    duration: string;
    cost: number;
}

interface DayPlan {
    day: number;
    date: string;
    dailySpend: number;
    activities: Activity[];
}

interface DailyItineraryProps {
    dayPlans: DayPlan[];
    formatCurrency: (amount: number) => string;
}

const DailyItinerary = ({ dayPlans, formatCurrency }: DailyItineraryProps) => {
    const getTimeIcon = (time: string) => {
        switch (time) {
            case 'morning':
                return Sun;
            case 'afternoon':
                return Sunset;
            default:
                return Moon;
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="mb-8"
        >
            <h2 className="section-title flex items-center gap-2">
                <Calendar className="text-primary" size={24} />
                Day-by-Day Itinerary
            </h2>

            <div className="space-y-6">
                {dayPlans.map((day) => (
                    <div key={day.day} className="card-travel">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold">D{day.day}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Day {day.day}</h3>
                                    <p className="text-sm text-muted-foreground">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground">Daily Spend</div>
                                <div className="font-semibold text-primary">{formatCurrency(day.dailySpend)}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {day.activities.map((activity, index) => {
                                const TimeIcon = getTimeIcon(activity.time);
                                return (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="timeline-dot flex items-center justify-center">
                                                <TimeIcon size={10} className="text-primary-foreground" />
                                            </div>
                                            {index < day.activities.length - 1 && <div className="timeline-line" />}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                                                        {activity.time}
                                                    </span>
                                                    <h4 className="font-semibold text-foreground mt-1">{activity.title}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                                    <span className="text-xs text-muted-foreground mt-2 inline-block">
                                                        ⏱ {activity.duration}
                                                    </span>
                                                </div>
                                                {activity.cost > 0 && (
                                                    <span className="badge-travel text-xs">{formatCurrency(activity.cost)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default DailyItinerary;
