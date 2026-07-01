import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const variants = {
      primary: "bg-hero-gradient text-white hover:shadow-hover",
      secondary: "bg-brand-primary-pale text-brand-primary hover:bg-[#DDD6FE]",
      outline: "border border-border-light bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
      ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-lg",
      md: "h-12 px-6 text-base font-semibold rounded-xl",
      lg: "h-14 px-8 text-lg font-semibold rounded-2xl",
      icon: "h-10 w-10 flex items-center justify-center rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
