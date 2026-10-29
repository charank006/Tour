import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
  imageUrl?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

const Logo = ({
  size = 'md',
  linkTo = '/',
  className = '',
  variant = 'auto',
}: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  const isLight = variant === 'light';

  const logoContent = (
    <div className={`flex items-center gap-2.5 leading-none select-none ${className}`}>
      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-transform duration-300 group-hover:rotate-45">
        <Compass size={iconSizes[size]} strokeWidth={2} className="text-primary" />
      </div>

      <span className={`font-serif-display font-bold tracking-tight ${sizeClasses[size]} flex items-baseline`}>
        <span className={isLight ? 'text-white' : 'text-foreground'}>
          Plan
        </span>
        <span className="text-primary ml-0.5 italic font-normal">
          Yours
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent ml-1 inline-block" />
      </span>
    </div>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={`group inline-flex items-center transition-opacity hover:opacity-95 ${className}`}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
