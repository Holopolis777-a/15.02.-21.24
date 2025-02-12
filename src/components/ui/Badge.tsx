import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'warning' | 'success' | 'error';
}

const variantStyles = {
  warning: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
};

export const Badge = ({ children, variant = 'warning' }: BadgeProps) => {
  return (
    <span className={`px-2 py-1 text-sm font-medium rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};
