import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

const EmptyState = ({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-3xl border border-border border-dashed ${className}`}
        >
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5">
                <Icon className="w-10 h-10 text-primary/80" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-foreground tracking-tight">{title}</h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                {description}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </motion.div>
    );
};

export default EmptyState;
