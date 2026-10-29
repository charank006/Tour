import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * Hand-crafted Lost Compass Line Art SVG
 */
export const LostCompassIllustration: React.FC<IllustrationProps> = ({ className = '', size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer brass ring */}
    <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
    <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />

    {/* Top hanging loop */}
    <path d="M54 8 C54 4, 66 4, 66 8" stroke="currentColor" strokeWidth="2" fill="none" strokeOpacity="0.5" />
    <circle cx="60" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />

    {/* Cardinal tick marks */}
    <line x1="60" y1="18" x2="60" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="60" y1="96" x2="60" y2="102" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="60" x2="24" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="96" y1="60" x2="102" y2="60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Cardinal Letters */}
    <text x="60" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor" fontFamily="serif" opacity="0.75">N</text>
    <text x="60" y="93" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" fontFamily="serif" opacity="0.6">S</text>
    <text x="91" y="63" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" fontFamily="serif" opacity="0.6">E</text>
    <text x="29" y="63" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" fontFamily="serif" opacity="0.6">W</text>

    {/* Compass Needle pointing tilted Northwest */}
    <g transform="rotate(-35 60 60)">
      {/* North Needle Tip (terracotta primary accent) */}
      <polygon points="60,26 65,60 60,54" fill="#C4512C" />
      <polygon points="60,26 55,60 60,54" fill="#D85A32" />

      {/* South Needle Tip */}
      <polygon points="60,94 65,60 60,66" fill="currentColor" opacity="0.3" />
      <polygon points="60,94 55,60 60,66" fill="currentColor" opacity="0.4" />

      {/* Pivot Center brass rivet */}
      <circle cx="60" cy="60" r="4" fill="#D97706" />
      <circle cx="60" cy="60" r="1.5" fill="#FAF7F2" />
    </g>
  </svg>
);

/**
 * Hand-crafted Explorer Backpack SVG
 */
export const BackpackIllustration: React.FC<IllustrationProps> = ({ className = '', size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Rolled blanket on top */}
    <rect x="36" y="16" width="48" height="14" rx="7" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
    <line x1="48" y1="16" x2="48" y2="30" stroke="#C4512C" strokeWidth="2" />
    <line x1="72" y1="16" x2="72" y2="30" stroke="#C4512C" strokeWidth="2" />

    {/* Main backpack body */}
    <path
      d="M32 36 C32 30, 88 30, 88 36 L92 92 C92 98, 88 102, 80 102 L40 102 C32 102, 28 98, 28 92 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />

    {/* Top flap */}
    <path
      d="M32 36 L88 36 L84 62 C84 65, 36 65, 36 62 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="#C4512C"
      fillOpacity="0.08"
    />

    {/* Vertical buckle straps */}
    <line x1="44" y1="36" x2="44" y2="76" stroke="#C4512C" strokeWidth="2" strokeDasharray="3 2" />
    <line x1="76" y1="36" x2="76" y2="76" stroke="#C4512C" strokeWidth="2" strokeDasharray="3 2" />

    {/* Buckle metal squares */}
    <rect x="42" y="60" width="4" height="6" stroke="#D97706" strokeWidth="1.5" fill="none" />
    <rect x="74" y="60" width="4" height="6" stroke="#D97706" strokeWidth="1.5" fill="none" />

    {/* Front pocket */}
    <rect x="40" y="74" width="40" height="22" rx="4" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.7" />
    <line x1="40" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
  </svg>
);

/**
 * Hand-crafted Folded Field Map SVG
 */
export const FoldedMapIllustration: React.FC<IllustrationProps> = ({ className = '', size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* 3 Fold Map Panels */}
    {/* Left fold */}
    <polygon points="20,30 48,22 48,94 20,102" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
    {/* Middle fold */}
    <polygon points="48,22 76,30 76,102 48,94" stroke="currentColor" strokeWidth="2" fill="#C4512C" fillOpacity="0.05" />
    {/* Right fold */}
    <polygon points="76,30 102,22 102,94 76,102" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />

    {/* Contour trail line across map */}
    <path
      d="M26 68 Q 48 50, 60 70 T 96 46"
      stroke="#C4512C"
      strokeWidth="2"
      strokeDasharray="4 3"
      fill="none"
    />

    {/* Destination Pin on Map */}
    <circle cx="82" cy="46" r="4" fill="#C4512C" />
    <circle cx="82" cy="46" r="2" fill="#FAF7F2" />
  </svg>
);
