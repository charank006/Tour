import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';

const PlanningAnimation = () => {
    const messages = [
        "Analyzing seasons...",
        "Optimizing budget...",
        "Designing your journey..."
    ];

    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full max-w-md mx-auto">
            {/* Animation Scene */}
            <div className="relative w-full h-32 flex items-center justify-center mb-8 overflow-hidden">
                {/* Dashed Path Background */}
                <svg className="absolute w-full h-full" viewBox="0 0 400 100">
                    <motion.path
                        d="M 20 80 Q 200 10 380 80"
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        strokeDasharray="10 10"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                    {/* Animated Route Line */}
                    <motion.path
                        d="M 20 80 Q 200 10 380 80"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10 20"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: -1000 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </svg>

                {/* Moving Airplane */}
                <motion.div
                    className="absolute z-10 text-primary"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    style={{
                        offsetPath: "path('M 20 80 Q 200 10 380 80')",
                        offsetRotate: "auto 45deg" // Adjust rotation to align plane
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="transform -rotate-45"> {/* Counter-rotate if needed strictly by CSS, but offsetRotate handles path following */}
                        <Plane size={32} fill="currentColor" className="text-blue-500" />
                    </div>
                </motion.div>

                {/* Fallback using simple x translation if offset-path not supported perfectly in all execution contexts, 
                    but pure CSS Motion Path (offset-path) is best for curves. 
                    Let's use a simpler Framer Motion approach for the plane if offset-path is tricky in React styles sometimes.
                */}
            </div>

            {/* Cycling Text */}
            <div className="h-8 relative w-full text-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messages[msgIndex]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-muted-foreground font-medium text-lg absolute w-full"
                    >
                        {messages[msgIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PlanningAnimation;
