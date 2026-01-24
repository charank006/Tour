import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionCardProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    title?: string;
    description?: string;
}

const SectionCard = ({ children, delay = 0, className = "", title, description }: SectionCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`bg-white/50 backdrop-blur-sm border border-white/40 shadow-sm rounded-3xl p-6 md:p-8 ${className}`}
        >
            {(title || description) && (
                <div className="mb-6">
                    {title && <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            )}
            {children}
        </motion.div>
    );
};

export default SectionCard;
