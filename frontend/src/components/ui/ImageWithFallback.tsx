import { useState, useEffect } from 'react';
import { MapPin, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ElementType;
  fallbackText?: string;
  containerClassName?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  className = '',
  fallbackIcon: Icon = Compass,
  fallbackText,
  containerClassName = '',
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reset state if src changes
  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  if (error || !src) {
    return (
      <div
        className={`w-full h-full min-h-[120px] bg-gradient-to-br from-primary/10 via-amber-500/5 to-muted/80 flex flex-col items-center justify-center text-muted-foreground p-4 text-center select-none border border-border/40 ${containerClassName}`}
      >
        <div className="w-10 h-10 rounded-full bg-card/80 border border-border/80 flex items-center justify-center text-primary mb-2 shadow-xs">
          <Icon size={20} />
        </div>
        <span className="text-xs font-semibold text-foreground/80 tracking-wide line-clamp-1">
          {alt || fallbackText || 'Travel Scene'}
        </span>
        <span className="text-[11px] text-muted-foreground/75 mt-0.5">
          {fallbackText || 'Destination Photo Archive'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {loading && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse flex items-center justify-center z-10">
          <MapPin size={22} className="text-primary/40 animate-bounce" />
        </div>
      )}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        src={src}
        alt={alt || 'Travel scene'}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-transform duration-500 will-change-transform ${className}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
