// 함선 SVG 그래픽 컴포넌트들

interface ShipSvgProps {
  className?: string;
  isHorizontal?: boolean;
}

// 세로 배치용 래퍼 컴포넌트
function VerticalWrapper({ children, aspectRatio }: { children: React.ReactNode; aspectRatio: number }) {
  // aspectRatio = width / height of original SVG (e.g., 96/32 = 3 for submarine)
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className="origin-center"
        style={{
          transform: 'rotate(90deg)',
          width: `${aspectRatio * 100}%`,
          height: `${100 / aspectRatio}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// 항공모함 (5칸) - 갑판 + 활주로
export function CarrierSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  const svg = (
    <svg viewBox="0 0 160 32" className={isHorizontal ? className : 'w-full h-full'}>
      <defs>
        <linearGradient id="carrierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* 선체 */}
      <path
        d="M8 6 L152 6 Q158 6 158 16 Q158 26 152 26 L8 26 Q2 26 2 16 Q2 6 8 6"
        fill="url(#carrierGrad)"
      />
      {/* 활주로 */}
      <rect x="12" y="10" width="136" height="12" rx="2" fill="#4338ca" opacity="0.6" />
      {/* 활주로 라인 */}
      <line x1="20" y1="16" x2="140" y2="16" stroke="#818cf8" strokeWidth="1" strokeDasharray="8 4" />
      {/* 함교 */}
      <rect x="100" y="8" width="20" height="16" rx="2" fill="#312e81" />
      <rect x="104" y="11" width="4" height="4" rx="1" fill="#6366f1" />
      <rect x="110" y="11" width="4" height="4" rx="1" fill="#6366f1" />
    </svg>
  );

  if (isHorizontal) return svg;
  return <VerticalWrapper aspectRatio={5}>{svg}</VerticalWrapper>;
}

// 전함 (4칸) - 포탑 + 굴뚝
export function BattleshipSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  const svg = (
    <svg viewBox="0 0 128 32" className={isHorizontal ? className : 'w-full h-full'}>
      <defs>
        <linearGradient id="battleshipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* 선체 */}
      <path
        d="M6 8 L122 8 Q126 8 126 16 Q126 24 122 24 L6 24 Q2 24 2 18 L6 8"
        fill="url(#battleshipGrad)"
      />
      {/* 전방 포탑 */}
      <circle cx="24" cy="16" r="8" fill="#6d28d9" />
      <rect x="20" y="6" width="8" height="4" rx="1" fill="#5b21b6" />
      {/* 함교 */}
      <rect x="50" y="6" width="28" height="20" rx="3" fill="#5b21b6" />
      <rect x="54" y="9" width="6" height="4" rx="1" fill="#8b5cf6" />
      <rect x="62" y="9" width="6" height="4" rx="1" fill="#8b5cf6" />
      {/* 후방 포탑 */}
      <circle cx="100" cy="16" r="8" fill="#6d28d9" />
      <rect x="96" y="6" width="8" height="4" rx="1" fill="#5b21b6" />
    </svg>
  );

  if (isHorizontal) return svg;
  return <VerticalWrapper aspectRatio={4}>{svg}</VerticalWrapper>;
}

// 순양함 (3칸) - 날렵한 선체
export function CruiserSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  const svg = (
    <svg viewBox="0 0 96 32" className={isHorizontal ? className : 'w-full h-full'}>
      <defs>
        <linearGradient id="cruiserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      {/* 선체 */}
      <path
        d="M4 16 L12 8 L84 8 Q92 8 92 16 Q92 24 84 24 L12 24 L4 16"
        fill="url(#cruiserGrad)"
      />
      {/* 함교 */}
      <rect x="36" y="6" width="24" height="20" rx="3" fill="#be185d" />
      <rect x="40" y="9" width="5" height="4" rx="1" fill="#f472b6" />
      <rect x="47" y="9" width="5" height="4" rx="1" fill="#f472b6" />
      {/* 포탑 */}
      <circle cx="20" cy="16" r="6" fill="#9d174d" />
      <circle cx="76" cy="16" r="6" fill="#9d174d" />
    </svg>
  );

  if (isHorizontal) return svg;
  return <VerticalWrapper aspectRatio={3}>{svg}</VerticalWrapper>;
}

// 잠수함 (3칸) - 유선형 + 잠망경
export function SubmarineSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  const svg = (
    <svg viewBox="0 0 96 32" className={isHorizontal ? className : 'w-full h-full'}>
      <defs>
        <linearGradient id="subGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      {/* 선체 */}
      <ellipse cx="48" cy="18" rx="44" ry="10" fill="url(#subGrad)" />
      {/* 사령탑 */}
      <rect x="38" y="6" width="20" height="12" rx="4" fill="#0f766e" />
      {/* 잠망경 */}
      <rect x="46" y="2" width="4" height="6" rx="1" fill="#134e4a" />
      <circle cx="48" cy="2" r="3" fill="#115e59" />
      {/* 창문 */}
      <circle cx="24" cy="18" r="4" fill="#5eead4" opacity="0.5" />
      <circle cx="48" cy="20" r="4" fill="#5eead4" opacity="0.5" />
      <circle cx="72" cy="18" r="4" fill="#5eead4" opacity="0.5" />
      {/* 프로펠러 */}
      <ellipse cx="90" cy="18" rx="3" ry="6" fill="#0f766e" />
    </svg>
  );

  if (isHorizontal) return svg;
  return <VerticalWrapper aspectRatio={3}>{svg}</VerticalWrapper>;
}

// 구축함 (2칸) - 작고 빠른 배
export function DestroyerSvg({ className = '', isHorizontal = true }: ShipSvgProps) {
  const svg = (
    <svg viewBox="0 0 64 32" className={isHorizontal ? className : 'w-full h-full'}>
      <defs>
        <linearGradient id="destroyerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* 선체 */}
      <path
        d="M4 16 L10 10 L54 10 Q60 10 60 16 Q60 22 54 22 L10 22 L4 16"
        fill="url(#destroyerGrad)"
      />
      {/* 함교 */}
      <rect x="24" y="6" width="16" height="20" rx="3" fill="#b45309" />
      <rect x="28" y="9" width="4" height="3" rx="1" fill="#fbbf24" />
      <rect x="34" y="9" width="4" height="3" rx="1" fill="#fbbf24" />
      {/* 포탑 */}
      <circle cx="14" cy="16" r="5" fill="#92400e" />
      <circle cx="52" cy="16" r="4" fill="#92400e" />
    </svg>
  );

  if (isHorizontal) return svg;
  return <VerticalWrapper aspectRatio={2}>{svg}</VerticalWrapper>;
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
