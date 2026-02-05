import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'md'
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variants = {
    default: 'bg-white shadow-lg border border-gray-100/50',
    glass: 'bg-white/80 backdrop-blur-xl shadow-lg border border-white/20',
    gradient: 'bg-gradient-to-br from-white via-gray-50/50 to-white shadow-lg border border-gray-100/50',
    elevated: 'bg-white shadow-xl shadow-gray-200/50 border border-gray-100/80',
  };

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 hover:border-violet-200/50 cursor-pointer'
    : '';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
