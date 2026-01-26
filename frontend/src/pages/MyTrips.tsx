import { Button } from "@/components/ui/button";
import { Compass, Calendar, Map, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";

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
                    <EmptyState
                        icon={Compass}
                        title="No trips planned yet"
                        description="It looks like you haven't started planning your next adventure. Let's change that! Explore amazing destinations and create your perfect itinerary."
                        action={
                            <Link to="/plan">
                                <Button size="lg" className="rounded-full gap-2 px-8">
                                    <Plus size={18} />
                                    Start Planning Your First Trip
                                </Button>
                            </Link>
                        }
                    />
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
