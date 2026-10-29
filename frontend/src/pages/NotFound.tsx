import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";
import { LostCompassIllustration } from "@/components/illustrations/TravelIllustrations";
import { motion } from "framer-motion";

export const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User navigated to missing path:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 flex items-center justify-center selection:bg-primary/20">
      <div className="container mx-auto px-4 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-3xl p-8 sm:p-12 border border-border/80 shadow-warm-lg"
        >
          {/* Lost Compass Illustration */}
          <div className="flex justify-center mb-6 text-foreground">
            <LostCompassIllustration size={130} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <Compass size={13} />
            <span>Off the Map • Error 404</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            You've wandered off the trail
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
            The path you are looking for doesn't exist or has moved to new coordinates. Let's get your compass pointed home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm shadow-warm hover:brightness-105 active:scale-95 transition-all"
            >
              <ArrowLeft size={16} />
              <span>Return to Base</span>
            </Link>

            <Link
              to="/plan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-semibold px-6 py-3 rounded-full text-sm border border-border/80 transition-all"
            >
              <Sparkles size={16} className="text-primary" />
              <span>Plan an Itinerary</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-border/70">
            <span className="font-handwriting text-lg text-primary font-bold -rotate-1 inline-block">
              "Every detour has its own story."
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
