import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Sun, Moon, Sunset, Coffee, CloudRain, Sparkles, ArrowRight, ChevronDown, Home, Trees, Users, Plane, Train, Bus, Car, Bed, Wifi, Star } from 'lucide-react';

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

    return (
        <div className="space-y-12">
            {dayPlans.map((day, dayIndex) => (
                <div key={day.day} className="relative">
                    {/* Day Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: dayIndex * 0.1 }}
                        className="flex items-center gap-4 mb-6 sticky top-20 z-10 bg-background/95 backdrop-blur-md py-4 border-b border-border/50"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Day</span>
                            <span className="text-3xl font-black text-primary leading-none">{day.day}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-border mx-2"></div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">{day.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>{day.activities.length} Experiences</span>
                                <span className="w-1 h-1 rounded-full bg-border"></span>
                                <span>Est. {formatCurrency(day.dailySpend)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline Container */}
                    <div className="relative pl-4 md:pl-8 ml-4 md:ml-6 border-l-[2px] border-dashed border-border/60 pb-8 space-y-6">

                        {/* Render Stay "Your Base" ONLY on Day 1 */}
                        {day.day === 1 && selectedStay && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative mb-8"
                            >
                                {/* Base Node */}
                                <div className="absolute -left-[23px] md:-left-[39px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] border-background bg-indigo-600 shadow-sm z-10 ring-1 ring-indigo-200" />

                                <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5 flex flex-col md:flex-row gap-5 hover:shadow-md transition-all">
                                    <div className="md:w-32 h-32 shrink-0 rounded-xl overflow-hidden relative">
                                        <img src={selectedStay.image} alt={selectedStay.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            Your Base
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-lg font-bold text-foreground">{selectedStay.name}</h4>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Star size={12} className="fill-accent text-accent" />
                                                    <span className="font-semibold text-foreground">{selectedStay.rating}</span>
                                                    <span>• {selectedStay.type} Stay</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-primary">{formatCurrency(selectedStay.pricePerNight)}</div>
                                                <div className="text-xs text-muted-foreground">/ night</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedStay.amenities?.map((am: string) => (
                                                <span key={am} className="text-xs bg-white border border-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                                                    {am === 'WiFi' ? <Wifi size={10} /> : <Bed size={10} />}
                                                    {am}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {day.activities.map((activity: any, actIndex: number) => {
                            const uniqueId = `${day.day}-${actIndex}`;
                            const isExpanded = expandedId === uniqueId;

                            return (
                                <motion.div
                                    key={uniqueId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (dayIndex * 0.1) + (actIndex * 0.05) }}
                                    className="relative"
                                >
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[23px] md:-left-[39px] top-6 w-4 h-4 rounded-full border-[3px] border-background shadow-sm z-10 ring-1 ${activity.isTravel ? 'bg-blue-500 ring-blue-200' : 'bg-primary ring-primary/20'
                                        }`} />

                                    {/* Card Content based on Type */}
                                    {activity.isTravel ? (
                                        <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 p-5 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                                    {activity.travelType === 'Train' ? <Train size={24} /> :
                                                        activity.travelType === 'Bus' ? <Bus size={24} /> :
                                                            activity.travelType === 'Car' ? <Car size={24} /> :
                                                                <Plane size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-foreground">{activity.title}</h4>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <Clock size={12} /> {activity.duration} • {activity.travelType} Journey
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-bold text-blue-700">
                                                    {activity.cost > 0 ? formatCurrency(activity.cost) : 'Included'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Standard Activity Card
                                        <div
                                            className={`bg-card rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${isExpanded ? 'ring-2 ring-primary/10 shadow-lg border-primary/20' : 'border-border hover:border-primary/30 hover:shadow-md'
                                                }`}
                                            onClick={() => toggleExpand(uniqueId)}
                                        >
                                            <div className="flex p-4 gap-4">
                                                {/* Thumbnail */}
                                                <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden bg-muted relative">
                                                    {activity.image ? (
                                                        <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <MapPin className="m-auto text-muted-foreground" />
                                                    )}
                                                </div>

                                                {/* Header Info */}
                                                <div className="flex-grow flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                                                        {getTimeIcon(activity.time)} {activity.time}
                                                                    </span>
                                                                    {activity.locationType && (
                                                                        <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                                                            {getLocationIcon(activity.locationType)} {activity.locationType}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <h4 className="text-base md:text-lg font-bold text-foreground leading-tight">{activity.title}</h4>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="font-bold text-foreground text-sm">
                                                                    {activity.cost > 0 ? formatCurrency(activity.cost) : 'Free'}
                                                                </span>
                                                                <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-2">
                                                        {activity.crowdLevel && (
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${activity.crowdLevel === 'High' ? 'border-red-200 text-red-700 bg-red-50' :
                                                                activity.crowdLevel === 'Low' ? 'border-green-200 text-green-700 bg-green-50' :
                                                                    'border-orange-200 text-orange-700 bg-orange-50'
                                                                }`}>
                                                                <Users size={10} /> {activity.crowdLevel} Crowd
                                                            </span>
                                                        )}
                                                        {activity.weatherStatus && (
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${activity.weatherStatus.includes('Perfect') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                activity.weatherStatus.includes('Hot') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                                                }`}>
                                                                {activity.weatherStatus}
                                                            </span>
                                                        )}
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
                                                        <div className="px-4 pb-4 pt-0 border-t border-border/50 mt-2">
                                                            <div className="pt-4 space-y-4">
                                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                                    {activity.description}
                                                                </p>

                                                                {activity.reason && (
                                                                    <div className="flex items-start gap-2 text-xs bg-accent/5 p-3 rounded-lg border border-accent/10">
                                                                        <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                                                                        <p><span className="font-bold text-accent-foreground">Why here:</span> {activity.reason}</p>
                                                                    </div>
                                                                )}

                                                                {/* Smart Suggestion Block */}
                                                                {activity.alternative && (
                                                                    <div className="bg-violet-50 border border-violet-100 p-3 rounded-xl flex items-start gap-3">
                                                                        <div className="bg-violet-100 p-1.5 rounded-full shrink-0">
                                                                            <Sparkles size={14} className="text-violet-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-violet-800 mb-0.5">Smart Suggestion</p>
                                                                            <p className="text-xs text-violet-700">
                                                                                Is {activity.title} too busy? Try <span className="font-bold">{activity.alternative.name}</span> instead ({activity.alternative.reason}).
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Crowd Graph */}
                                                                {activity.crowdTimeline && (
                                                                    <div className="bg-secondary/20 p-3 rounded-lg">
                                                                        <div className="flex items-center gap-1 mb-2">
                                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Crowd Forecast</span>
                                                                        </div>
                                                                        <div className="flex items-end gap-1 h-8">
                                                                            {activity.crowdTimeline.map((slot: any, index: number) => (
                                                                                <div key={index} className="flex flex-col items-center gap-1 flex-1 group/bar">
                                                                                    <div
                                                                                        className={`w-full rounded-sm transition-all relative ${slot.level === 'High' ? 'bg-red-400 h-6' :
                                                                                            slot.level === 'Medium' ? 'bg-orange-300 h-4' :
                                                                                                'bg-green-300 h-2'
                                                                                            }`}
                                                                                    ></div>
                                                                                    <span className="text-[9px] text-muted-foreground">{slot.time}</span>
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
