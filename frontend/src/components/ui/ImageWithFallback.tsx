import { useState } from 'react';
import { ImageOff, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackIcon?: React.ElementType;
    fallbackText?: string;
    containerClassName?: string;
}

const ImageWithFallback = ({
    src,
    alt,
    className,
    fallbackIcon: Icon = MapPin,
    fallbackText,
    containerClassName,
    ...props
}: ImageWithFallbackProps) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLoad = () => {
        setLoading(false);
    };

    const handleError = () => {
        setError(true);
        setLoading(false);
    };

    if (error || !src) {
        return (
            <div className={`w-full h-full bg-secondary/30 flex flex-col items-center justify-center text-muted-foreground p-4 ${className} ${containerClassName}`}>
                <Icon size={24} className="mb-2 opacity-50" />
                {fallbackText && (
                    <span className="text-xs font-medium text-center opacity-70">{fallbackText}</span>
                )}
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className} ${containerClassName}`}>
            {loading && (
                <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center z-10">
                    <Loader2 size={20} className="animate-spin text-primary/50" />
                </div>
            )}
            <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                src={src}
                alt={alt}
                loading="lazy"
                onError={handleError}
                onLoad={handleLoad}
                className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${className}`}
                {...props}
            />
        </div>
    );
};

export default ImageWithFallback;
