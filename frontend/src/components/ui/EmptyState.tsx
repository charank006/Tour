import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React from "react";
import { BackpackIllustration } from "@/components/illustrations/TravelIllustrations";

interface EmptyStateProps {
  icon?: LucideIcon;
  customIllustration?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  icon: Icon,
  customIllustration,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center bg-card rounded-3xl border border-dashed border-border/80 shadow-warm-sm ${className}`}
    >
      {/* Illustration / Icon */}
      <div className="mb-6 flex items-center justify-center text-primary">
        {customIllustration ? (
          customIllustration
        ) : Icon ? (
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Icon size={32} strokeWidth={1.8} />
          </div>
        ) : (
          <BackpackIllustration size={100} />
        )}
      </div>

      <h2 className="font-serif-display text-2xl font-bold mb-2 text-foreground tracking-tight">
        {title}
      </h2>

      <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {action && <div className="mt-1">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
