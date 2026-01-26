import { Button } from "@/components/ui/button";
import { Compass, Calendar, Map, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MyTrips = () => {
    // Logic to fetch trips would go here in the future.
    // For now, we simulate an empty state.
    const trips: any[] = [];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-2">My Trips</h1>
                <p className="text-muted-foreground mb-12">Manage your upcoming adventures and past memories.</p>

                {trips.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-3xl border border-border border-dashed"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Compass className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No trips planned yet</h2>
                        <p className="text-muted-foreground max-w-md mb-8">
                            It looks like you haven't started planning your next adventure.
                            Let's change that! Explore amazing destinations and create your perfect itinerary.
                        </p>
                        <Link to="/plan">
                            <Button size="lg" className="rounded-full gap-2">
                                <Plus size={18} />
                                Start Planning Your First Trip
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Trip Cards would go here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTrips;
