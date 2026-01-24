import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
  imageUrl?: string;
  className?: string;
}

const Logo = ({
  size = 'md',
  linkTo = '/',
  imageUrl,
  className = '',
}: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const paddingClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'px-4 py-2',
  };

  const imageSizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const logoContent = (
    <div className={`flex items-center gap-2 leading-none ${className}`}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="PlanYours logo"
          className={`${imageSizes[size]} w-auto object-contain`}
        />
      )}

      <span
        className={`font-bold tracking-tight ${sizeClasses[size]} flex items-center`}
      >
        <span
          className={`text-accent ${paddingClasses[size]}`}
        >
          Plan
        </span>
        <span className="ml-1 text-foreground">Yours</span>
      </span>
    </div>
  );

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        className={`inline-flex items-center hover:opacity-90 transition-opacity ${className}`}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
