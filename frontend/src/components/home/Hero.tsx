import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [dates, setDates] = useState('');
    const [travelers, setTravelers] = useState('2');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/plan', { state: { destination, travelers } });
    };

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,22,40,0.4),rgba(10,22,40,1))] z-10" />
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container mx-auto px-4 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium mb-6">
                        Reimagine Travel
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Curate Your <br />
                        <span className="text-accent">
                            Dream Journey.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Seamlessly plan, organize, and experience the world with PlanYours.
                        AI-powered itineraries tailored just for you.
                    </p>
                </motion.div>

                {/* Quick Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <form onSubmit={handleSearch} className="bg-[#0A1628]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row gap-0 shadow-2xl">

                        <div className="flex-1 px-6 py-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10">
                            <MapPin className="text-accent/80" size={20} />
                            <div className="text-left w-full">
                                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Where</label>
                                <input
                                    type="text"
                                    placeholder="Destination"
                                    className="w-full bg-transparent border-none text-white placeholder-white/30 focus:outline-none text-base font-medium"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 px-6 py-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10">
                            <Calendar className="text-accent/80" size={20} />
                            <div className="text-left w-full">
                                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">When</label>
                                <input
                                    type="text"
                                    placeholder="Add dates"
                                    className="w-full bg-transparent border-none text-white placeholder-white/30 focus:outline-none text-base font-medium"
                                    value={dates}
                                    onChange={(e) => setDates(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 px-6 py-4 flex items-center gap-4">
                            <Users className="text-accent/80" size={20} />
                            <div className="text-left w-full">
                                <label className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Who</label>
                                <select
                                    className="w-full bg-transparent border-none text-white focus:outline-none text-base font-medium appearance-none cursor-pointer [&>option]:text-black"
                                    value={travelers}
                                    onChange={(e) => setTravelers(e.target.value)}
                                >
                                    <option value="1">1 Traveler</option>
                                    <option value="2">2 Travelers</option>
                                    <option value="3">3 Travelers</option>
                                    <option value="4+">4+ Travelers</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-orange m-1">
                            <Search size={20} />
                            <span className="hidden md:inline">Search</span>
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
