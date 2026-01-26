import { Skeleton } from "@/components/ui/Skeleton";

const TripPlanSkeleton = () => {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" /> {/* Back link */}
                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            <div>
                                <Skeleton className="h-12 w-3/4 mb-2" /> {/* Title */}
                                <Skeleton className="h-4 w-1/2" /> {/* Subtitle */}
                            </div>
                            <div className="bg-card border rounded-2xl p-4 flex justify-between items-center">
                                <Skeleton className="h-10 w-24" /> {/* Stat 1 */}
                                <div className="h-8 w-[1px] bg-border mx-4" />
                                <Skeleton className="h-10 w-24" /> {/* Stat 2 */}
                            </div>
                        </div>
                    </div>

                    {/* Timeline Skeleton */}
                    <div className="space-y-8 pl-4 md:pl-8 ml-4 md:ml-6 border-l-[2px] border-dashed border-border/30">
                        {[1, 2, 3].map((day) => (
                            <div key={day} className="relative space-y-6">
                                {/* Day Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>

                                {/* Activity Cards */}
                                {[1, 2].map((act) => (
                                    <div key={act} className="relative pl-8">
                                        <div className="absolute -left-[23px] md:-left-[39px] top-6 w-4 h-4 rounded-full border-[3px] border-background bg-muted z-10" />
                                        <div className="bg-card rounded-xl border p-4 flex gap-4 h-40">
                                            <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
                                            <div className="flex-grow space-y-3">
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-6 w-1/3" />
                                                    <Skeleton className="h-6 w-16" />
                                                </div>
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                                <div className="flex gap-2 mt-auto pt-2">
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Options Skeleton */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripPlanSkeleton;
