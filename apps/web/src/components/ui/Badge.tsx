import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'danger' | 'muted' | 'warning';
}

export function Badge({ children, variant = 'muted' }: BadgeProps) {
  const baseStyle = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase border";
  
  const variantStyles = {
    brand: "bg-amber-950 text-amber-400 border-amber-800",
    success: "bg-emerald-950 text-emerald-400 border-emerald-800",
    danger: "bg-red-950 text-red-400 border-red-800",
    muted: "bg-zinc-800 text-zinc-300 border-zinc-700",
    warning: "bg-yellow-950 text-yellow-500 border-yellow-800",
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
