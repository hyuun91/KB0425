import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'category' | 'urgency';
  level?: '높음' | '보통' | '낮음' | string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'category', level }) => {
  const getUrgencyColor = (lvl?: string) => {
    switch (lvl) {
      case '높음': return 'bg-red-100 text-red-700 border-red-200';
      case '보통': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case '낮음': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      variant === 'urgency' ? getUrgencyColor(level) : "bg-kb-yellow/10 text-kb-gray border-kb-yellow/20"
    )}>
      {children}
    </span>
  );
};
