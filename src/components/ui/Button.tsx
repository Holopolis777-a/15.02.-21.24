import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center font-medium rounded-md ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
