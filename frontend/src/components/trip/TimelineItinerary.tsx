import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Sun, Moon, Sunset, Coffee, CloudRain, Sparkles, ArrowRight, ChevronDown, Home, Trees, Users, Plane, Train, Bus, Car, Bed, Wifi, Star } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface TimelineItineraryProps {
    dayPlans: any[];
    formatCurrency: (amount: number) => string;
    selectedStay?: any;
}

const TimelineItinerary = ({ dayPlans, formatCurrency, selectedStay }: TimelineItineraryProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getTimeIcon = (time: string) => {
        switch (time) {
            case 'Sunrise': return <Sun size={14} className="text-orange-400" />;
            case 'Morning': return <Coffee size={14} className="text-yellow-600" />;
            case 'Midday': return <Sun size={14} className="text-yellow-500" />;
            case 'Sunset': return <Sunset size={14} className="text-orange-500" />;
            case 'Evening': return <Moon size={14} className="text-indigo-400" />;
            default: return <Clock size={14} />;
        }
    };

    const getLocationIcon = (type: string) => {
        return type === 'Indoor' ? <Home size={12} /> : <Trees size={12} />;
    };

    const getSmartBadges = (activity: any) => {
        const badges = [];

        // Time Context
        if (activity.time === 'Morning' || activity.time === 'Sunrise') {
            badges.push({ text: 'Best before 9 AM', icon: Coffee, color: 'text-amber-600 bg-amber-50 border-amber-200' });
        } else if (activity.time === 'Sunset') {
            badges.push({ text: 'Golden Hour', icon: Sun, color: 'text-orange-600 bg-orange-50 border-orange-200' });
        } else if (activity.time === 'Evening') {
            badges.push({ text: 'Calm Evenings', icon: Moon, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' });
        }

        // Crowd Context
        if (activity.crowdLevel === 'High') {
            badges.push({ text: 'Tourist-heavy', icon: Users, color: 'text-red-600 bg-red-50 border-red-200' });
        } else if (activity.crowdLevel === 'Low') {
            badges.push({ text: 'Peaceful Spot', icon: Users, color: 'text-green-600 bg-green-50 border-green-200' });
        }

        // Environment Context
        if (activity.locationType === 'Indoor') {
            badges.push({ text: 'Indoor Escape', icon: Home, color: 'text-slate-600 bg-slate-50 border-slate-200' });
        } else if (activity.locationType === 'Outdoor') {
            // Only show outdoor badge if weather isn't the main point, to avoid duplicate "Sunny" vibes
            if (!activity.weatherStatus) {
                badges.push({ text: 'Open Air', icon: Trees, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' });
            }
        }

        return badges;
    };

    // Pre-calculate running totals
    let runningTotal = 0;
    const dayPlansWithTotal = dayPlans.map(day => {
        runningTotal += day.dailySpend;
        return { ...day, runningTotal };
    });

    return (
        <div className="space-y-20">
            {dayPlansWithTotal.map((day, dayIndex) => (
                <div key={day.day} className="relative">
                    {/* Day Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dayIndex * 0.1 }}
                        className="flex items-center gap-6 mb-8 sticky top-24 z-10 bg-background/95 backdrop-blur-md py-4 pl-2"
                    >
                        <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-2xl w-16 h-16 shadow-lg shadow-primary/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Day</span>
                            <span className="text-3xl font-black leading-none">{day.day}</span>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-1">{day.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-primary" /> {day.activities.length} Experiences</span>
                                <span className="w-1 h-1 rounded-full bg-border"></span>
                                <span>Total: <span className="font-bold text-foreground">{formatCurrency(day.runningTotal)}</span></span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline Container */}
                    <div className="relative pl-8 md:pl-12 ml-8 border-l-2 border-primary/10 space-y-8 pb-4">

                        {/* Render Stay "Your Base" ONLY on Day 1 */}
                        {day.day === 1 && selectedStay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative group"
                            >
                                {/* Base Node */}
                                <div className="absolute -left-[39px] md:-left-[55px] top-8 w-5 h-5 rounded-full border-[4px] border-background bg-primary shadow-md z-10 box-content" />

                                <div className="bg-card rounded-3xl p-1 shadow-sm border border-border/40 hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row gap-6 p-4">
                                        <div className="md:w-40 h-32 shrink-0 rounded-2xl overflow-hidden relative shadow-sm">
                                            <ImageWithFallback
                                                src={selectedStay.image}
                                                alt={selectedStay.name}
                                                className="w-full h-full"
                                                fallbackIcon={Bed}
                                            />
                                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10 uppercase tracking-wide z-20">
                                                Your Base
                                            </div>
                                        </div>
                                        <div className="flex-grow py-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-xl font-bold text-foreground mb-1">{selectedStay.name}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Star size={14} className="fill-orange-400 text-orange-400" />
                                                        <span className="font-semibold text-foreground">{selectedStay.rating}</span>
                                                        <span>• {selectedStay.type} Stay</span>
                                                    </div>
                                                </div>
                                                <div className="text-right bg-secondary/30 px-3 py-1.5 rounded-xl">
                                                    <div className="font-bold text-lg text-primary">{formatCurrency(selectedStay.pricePerNight)}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Per Night</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {selectedStay.amenities?.map((am: string) => (
                                                    <span key={am} className="text-xs bg-secondary/50 text-muted-foreground px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">
                                                        {am === 'WiFi' ? <Wifi size={12} /> : <Bed size={12} />}
                                                        {am}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {day.activities.map((activity: any, actIndex: number) => {
                            const uniqueId = `${day.day}-${actIndex}`;
                            const isExpanded = expandedId === uniqueId;
                            const badges = getSmartBadges(activity);

                            return (
                                <motion.div
                                    key={uniqueId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (dayIndex * 0.1) + (actIndex * 0.05) }}
                                    className="relative group"
                                >
                                    {/* Timeline Dot */}
                                    {activity.isTravel ? (
                                        <div className="absolute -left-[37px] md:-left-[53px] top-8 w-4 h-4 rounded-full bg-blue-100 border-[3px] border-blue-500 shadow-sm z-10 box-content" />
                                    ) : (
                                        <div className="absolute -left-[36px] md:-left-[52px] top-8 w-3 h-3 rounded-full bg-background border-[3px] border-primary shadow-sm z-10 ring-4 ring-background group-hover:scale-125 transition-transform duration-300 box-content" />
                                    )}

                                    {/* Card Content based on Type */}
                                    {activity.isTravel ? (
                                        <div className="bg-gradient-to-r from-blue-50/50 to-transparent rounded-2xl border border-blue-100/60 p-5 hover:bg-blue-50/80 transition-colors">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100">
                                                    {activity.travelType === 'Train' ? <Train size={28} /> :
                                                        activity.travelType === 'Bus' ? <Bus size={28} /> :
                                                            activity.travelType === 'Car' ? <Car size={28} /> :
                                                                <Plane size={28} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-foreground">{activity.title}</h4>
                                                    <p className="text-sm text-foreground/70 flex items-center gap-2 mt-1 font-medium">
                                                        <Clock size={14} className="text-blue-500" /> {activity.duration} • {activity.travelType} Journey
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-bold text-blue-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100">
                                                    {activity.cost > 0 ? formatCurrency(activity.cost) : 'Included'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Standard Activity Card
                                        <div
                                            className={`bg-card rounded-3xl p-1 border transition-all duration-300 overflow-hidden cursor-pointer ${isExpanded ? 'ring-2 ring-primary/10 shadow-lg border-primary/20' : 'border-border/40 hover:border-primary/20 hover:shadow-md'
                                                }`}
                                            onClick={() => toggleExpand(uniqueId)}
                                        >
                                            <div className="flex flex-col md:flex-row gap-5 p-4">
                                                {/* Thumbnail */}
                                                <div className="w-full md:w-32 h-48 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-muted relative shadow-sm group-hover:shadow transition-shadow">
                                                    <ImageWithFallback
                                                        src={activity.image}
                                                        alt={activity.title}
                                                        className="w-full h-full"
                                                        fallbackIcon={MapPin}
                                                    />
                                                    <div className="absolute top-2 left-2 z-20">
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-foreground bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                                                            {getTimeIcon(activity.time)} {activity.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Header Info */}
                                                <div className="flex-grow flex flex-col justify-between py-1">
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="text-xl font-bold text-foreground leading-tight mb-2">{activity.title}</h4>
                                                                {activity.locationType && (
                                                                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                                                        {getLocationIcon(activity.locationType)} {activity.locationType}
                                                                        {activity.description && <span className="mx-1">• {activity.description.substring(0, 40)}...</span>}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2 pl-4">
                                                                <div className={`font-bold text-sm px-3 py-1.5 rounded-xl border ${activity.cost > 0
                                                                    ? 'bg-primary/5 text-primary border-primary/10'
                                                                    : 'bg-secondary text-muted-foreground border-transparent'
                                                                    }`}>
                                                                    {activity.cost > 0 ? formatCurrency(activity.cost) : 'Free'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center flex-wrap gap-2 mt-4">
                                                        {badges.map((badge, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wide flex items-center gap-1.5 ${badge.color}`}
                                                            >
                                                                <badge.icon size={10} />
                                                                {badge.text}
                                                            </span>
                                                        ))}
                                                        <div className="ml-auto">
                                                            <ChevronDown size={20} className={`text-muted-foreground/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expandable Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-6 pt-2">
                                                            <div className="pt-4 border-t border-border/40 space-y-5">
                                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                                    {activity.description}
                                                                </p>

                                                                {activity.reason && (
                                                                    <div className="flex items-start gap-3 text-sm bg-accent/5 p-4 rounded-xl border border-accent/10">
                                                                        <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
                                                                        <p><span className="font-bold text-accent-foreground">Why we picked this:</span> {activity.reason}</p>
                                                                    </div>
                                                                )}

                                                                {/* Smart Suggestion Block */}
                                                                {activity.alternative && (
                                                                    <div className="bg-violet-50 border border-violet-100 p-4 rounded-xl flex items-start gap-3">
                                                                        <div className="bg-violet-100 p-2 rounded-full shrink-0">
                                                                            <Sparkles size={14} className="text-violet-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-violet-800 mb-1">Smart Alternative Available</p>
                                                                            <p className="text-xs text-violet-700 leading-relaxed">
                                                                                Consider swapping for <span className="font-bold">{activity.alternative.name}</span> for a {activity.alternative.reason.toLowerCase()} experience.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Crowd Graph */}
                                                                {activity.crowdTimeline && (
                                                                    <div className="bg-secondary/20 p-4 rounded-xl">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Crowd Forecast</span>
                                                                        </div>
                                                                        <div className="flex items-end gap-1 h-12">
                                                                            {activity.crowdTimeline.map((slot: any, index: number) => (
                                                                                <div key={index} className="flex flex-col items-center gap-1.5 flex-1 group/bar">
                                                                                    <div
                                                                                        className={`w-full rounded-sm transition-all relative ${slot.level === 'High' ? 'bg-red-400 h-8 opacity-80' :
                                                                                            slot.level === 'Medium' ? 'bg-orange-300 h-5 opacity-60' :
                                                                                                'bg-green-300 h-3 opacity-40'
                                                                                            }`}
                                                                                    ></div>
                                                                                    <span className="text-[9px] text-muted-foreground font-medium">{slot.time}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimelineItinerary;
