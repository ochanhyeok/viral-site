// 함선 SVG 그래픽 컴포넌트들

interface ShipSvgProps {
  className?: string;
  isHorizontal?: boolean;
}

// 항공모함 (5칸)
export function CarrierSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  if (!isHorizontal) {
    return (
      <svg viewBox="0 0 32 160" className={className} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="carrierGradV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <path d="M6 8 L6 152 Q6 158 16 158 Q26 158 26 152 L26 8 Q26 2 16 2 Q6 2 6 8" fill="url(#carrierGradV)" />
        <rect x="10" y="12" width="12" height="136" rx="2" fill="#4338ca" opacity="0.6" />
        <line x1="16" y1="20" x2="16" y2="140" stroke="#818cf8" strokeWidth="1" strokeDasharray="8 4" />
        <rect x="8" y="100" width="16" height="20" rx="2" fill="#312e81" />
        <rect x="11" y="104" width="4" height="4" rx="1" fill="#6366f1" />
        <rect x="11" y="110" width="4" height="4" rx="1" fill="#6366f1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 160 32" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="carrierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path d="M8 6 L152 6 Q158 6 158 16 Q158 26 152 26 L8 26 Q2 26 2 16 Q2 6 8 6" fill="url(#carrierGrad)" />
      <rect x="12" y="10" width="136" height="12" rx="2" fill="#4338ca" opacity="0.6" />
      <line x1="20" y1="16" x2="140" y2="16" stroke="#818cf8" strokeWidth="1" strokeDasharray="8 4" />
      <rect x="100" y="8" width="20" height="16" rx="2" fill="#312e81" />
      <rect x="104" y="11" width="4" height="4" rx="1" fill="#6366f1" />
      <rect x="110" y="11" width="4" height="4" rx="1" fill="#6366f1" />
    </svg>
  );
}

// 전함 (4칸)
export function BattleshipSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  if (!isHorizontal) {
    return (
      <svg viewBox="0 0 32 128" className={className} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="battleshipGradV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path d="M8 6 L8 122 Q8 126 16 126 Q24 126 24 122 L24 6 Q24 2 18 2 L8 6" fill="url(#battleshipGradV)" />
        <circle cx="16" cy="24" r="8" fill="#6d28d9" />
        <rect x="6" y="20" width="4" height="8" rx="1" fill="#5b21b6" />
        <rect x="6" y="50" width="20" height="28" rx="3" fill="#5b21b6" />
        <rect x="9" y="54" width="4" height="6" rx="1" fill="#8b5cf6" />
        <rect x="9" y="62" width="4" height="6" rx="1" fill="#8b5cf6" />
        <circle cx="16" cy="100" r="8" fill="#6d28d9" />
        <rect x="6" y="96" width="4" height="8" rx="1" fill="#5b21b6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 128 32" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="battleshipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M6 8 L122 8 Q126 8 126 16 Q126 24 122 24 L6 24 Q2 24 2 18 L6 8" fill="url(#battleshipGrad)" />
      <circle cx="24" cy="16" r="8" fill="#6d28d9" />
      <rect x="20" y="6" width="8" height="4" rx="1" fill="#5b21b6" />
      <rect x="50" y="6" width="28" height="20" rx="3" fill="#5b21b6" />
      <rect x="54" y="9" width="6" height="4" rx="1" fill="#8b5cf6" />
      <rect x="62" y="9" width="6" height="4" rx="1" fill="#8b5cf6" />
      <circle cx="100" cy="16" r="8" fill="#6d28d9" />
      <rect x="96" y="6" width="8" height="4" rx="1" fill="#5b21b6" />
    </svg>
  );
}

// 순양함 (3칸)
export function CruiserSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  if (!isHorizontal) {
    return (
      <svg viewBox="0 0 32 96" className={className} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="cruiserGradV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
        <path d="M16 4 L8 12 L8 84 Q8 92 16 92 Q24 92 24 84 L24 12 L16 4" fill="url(#cruiserGradV)" />
        <rect x="6" y="36" width="20" height="24" rx="3" fill="#be185d" />
        <rect x="9" y="40" width="4" height="5" rx="1" fill="#f472b6" />
        <rect x="9" y="47" width="4" height="5" rx="1" fill="#f472b6" />
        <circle cx="16" cy="20" r="6" fill="#9d174d" />
        <circle cx="16" cy="76" r="6" fill="#9d174d" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 32" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cruiserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <path d="M4 16 L12 8 L84 8 Q92 8 92 16 Q92 24 84 24 L12 24 L4 16" fill="url(#cruiserGrad)" />
      <rect x="36" y="6" width="24" height="20" rx="3" fill="#be185d" />
      <rect x="40" y="9" width="5" height="4" rx="1" fill="#f472b6" />
      <rect x="47" y="9" width="5" height="4" rx="1" fill="#f472b6" />
      <circle cx="20" cy="16" r="6" fill="#9d174d" />
      <circle cx="76" cy="16" r="6" fill="#9d174d" />
    </svg>
  );
}

// 잠수함 (3칸)
export function SubmarineSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  if (!isHorizontal) {
    return (
      <svg viewBox="0 0 32 96" className={className} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="subGradV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>
        <ellipse cx="18" cy="48" rx="10" ry="44" fill="url(#subGradV)" />
        <rect x="6" y="38" width="12" height="20" rx="4" fill="#0f766e" />
        <rect x="2" y="46" width="6" height="4" rx="1" fill="#134e4a" />
        <circle cx="2" cy="48" r="3" fill="#115e59" />
        <circle cx="18" cy="24" r="4" fill="#5eead4" opacity="0.5" />
        <circle cx="20" cy="48" r="4" fill="#5eead4" opacity="0.5" />
        <circle cx="18" cy="72" r="4" fill="#5eead4" opacity="0.5" />
        <ellipse cx="18" cy="90" rx="6" ry="3" fill="#0f766e" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 32" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="subGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="18" rx="44" ry="10" fill="url(#subGrad)" />
      <rect x="38" y="6" width="20" height="12" rx="4" fill="#0f766e" />
      <rect x="46" y="2" width="4" height="6" rx="1" fill="#134e4a" />
      <circle cx="48" cy="2" r="3" fill="#115e59" />
      <circle cx="24" cy="18" r="4" fill="#5eead4" opacity="0.5" />
      <circle cx="48" cy="20" r="4" fill="#5eead4" opacity="0.5" />
      <circle cx="72" cy="18" r="4" fill="#5eead4" opacity="0.5" />
      <ellipse cx="90" cy="18" rx="3" ry="6" fill="#0f766e" />
    </svg>
  );
}

// 구축함 (2칸)
export function DestroyerSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  if (!isHorizontal) {
    return (
      <svg viewBox="0 0 32 64" className={className} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="destroyerGradV" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <path d="M16 4 L10 10 L10 54 Q10 60 16 60 Q22 60 22 54 L22 10 L16 4" fill="url(#destroyerGradV)" />
        <rect x="6" y="24" width="20" height="16" rx="3" fill="#b45309" />
        <rect x="9" y="28" width="3" height="4" rx="1" fill="#fbbf24" />
        <rect x="9" y="34" width="3" height="4" rx="1" fill="#fbbf24" />
        <circle cx="16" cy="14" r="5" fill="#92400e" />
        <circle cx="16" cy="52" r="4" fill="#92400e" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 32" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="destroyerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M4 16 L10 10 L54 10 Q60 10 60 16 Q60 22 54 22 L10 22 L4 16" fill="url(#destroyerGrad)" />
      <rect x="24" y="6" width="16" height="20" rx="3" fill="#b45309" />
      <rect x="28" y="9" width="4" height="3" rx="1" fill="#fbbf24" />
      <rect x="34" y="9" width="4" height="3" rx="1" fill="#fbbf24" />
      <circle cx="14" cy="16" r="5" fill="#92400e" />
      <circle cx="52" cy="16" r="4" fill="#92400e" />
    </svg>
  );
}

// 배 ID로 SVG 컴포넌트 가져오기
export function getShipSvg(shipId: string, isHorizontal: boolean, className?: string) {
  const props = { className, isHorizontal };

  switch (shipId) {
    case 'carrier':
      return <CarrierSvg {...props} />;
    case 'battleship':
      return <BattleshipSvg {...props} />;
    case 'cruiser':
      return <CruiserSvg {...props} />;
    case 'submarine':
      return <SubmarineSvg {...props} />;
    case 'destroyer':
      return <DestroyerSvg {...props} />;
    default:
      return null;
  }
}

// 미니 아이콘 버전 (배 선택 패널용)
export function ShipIcon({ shipId, size = 'md' }: { shipId: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
  };

  return (
    <div className={`${sizeClasses[size]} w-auto`}>
      {getShipSvg(shipId, true, 'h-full w-auto')}
    </div>
  );
}
