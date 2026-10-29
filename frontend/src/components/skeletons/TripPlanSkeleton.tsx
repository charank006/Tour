import { Skeleton } from "@/components/ui/skeleton";
import PlanningAnimation from "@/components/PlanningAnimation";

export const TripPlanSkeleton = () => {
  return (
    <div className="min-h-screen bg-background pt-28 pb-16 selection:bg-primary/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">

        {/* Hero Planning Animation with Real Steps */}
        <div className="mb-12 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-warm">
          <PlanningAnimation />
        </div>

        {/* Header Skeleton */}
        <div className="space-y-4 mb-10">
          <Skeleton className="h-5 w-32 rounded-full" />
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <div className="bg-card border border-border/70 rounded-2xl p-5 flex justify-between items-center shadow-xs">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <div className="h-8 w-[1px] bg-border mx-4" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Timeline Itinerary Skeletons matching exact layout */}
        <div className="space-y-8 pl-4 md:pl-8 ml-4 md:ml-6 border-l-2 border-dashed border-border/60">
          {[1, 2].map((day) => (
            <div key={day} className="relative space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-5 w-40 rounded-md" />
              </div>

              {[1, 2].map((act) => (
                <div key={act} className="relative pl-6">
                  <div className="absolute -left-[31px] md:-left-[47px] top-6 w-4 h-4 rounded-full border-2 border-background bg-primary/40" />
                  <div className="bg-card rounded-2xl border border-border/70 p-5 flex gap-4 h-36 shadow-xs">
                    <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                    <div className="flex-grow space-y-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-1/3 rounded-md" />
                        <Skeleton className="h-5 w-16 rounded-md" />
                      </div>
                      <Skeleton className="h-3.5 w-full rounded-md" />
                      <Skeleton className="h-3.5 w-2/3 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TripPlanSkeleton;
