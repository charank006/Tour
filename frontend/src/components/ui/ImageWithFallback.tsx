import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Curated pool of guaranteed high-resolution Unsplash travel photography
const VERIFIED_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=800&auto=format&fit=crop', // Mountain mist
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=85&w=800&auto=format&fit=crop', // Tea gardens
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=85&w=800&auto=format&fit=crop', // Snow peaks
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=85&w=800&auto=format&fit=crop', // Amer palace
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=85&w=800&auto=format&fit=crop', // Backwaters
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=85&w=800&auto=format&fit=crop', // Heritage stay
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=85&w=800&auto=format&fit=crop', // Boutique villa
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=85&w=800&auto=format&fit=crop', // Spice market
];

const getDeterministicFallback = (key?: string) => {
  if (!key) return VERIFIED_FALLBACK_IMAGES[0];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % VERIFIED_FALLBACK_IMAGES.length;
  return VERIFIED_FALLBACK_IMAGES[index];
};

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ElementType;
  fallbackText?: string;
  containerClassName?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}: ImageWithFallbackProps) => {
  const fallbackUrl = getDeterministicFallback(alt || src);
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackUrl);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync when prop changes
  useEffect(() => {
    setCurrentSrc(src || fallbackUrl);
    setHasError(false);
    setLoading(true);
  }, [src, fallbackUrl]);

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackUrl) {
      // Gracefully switch to verified fallback image
      setHasError(true);
      setCurrentSrc(fallbackUrl);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {loading && (
        <div className="absolute inset-0 bg-muted/40 animate-pulse flex items-center justify-center z-10">
          <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      )}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
        src={currentSrc}
        alt={alt || 'Curated travel view'}
        loading="lazy"
        onError={handleError}
        onLoad={() => setLoading(false)}
        className={`w-full h-full object-cover transition-transform duration-500 will-change-transform ${className}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
