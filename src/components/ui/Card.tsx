import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from './Button';

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'warm' | 'premium' | 'glass';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, children, ...props }, ref) => {
    
    const variants = {
      default: "bg-card-light border border-border-light shadow-soft",
      warm: "bg-warm-card-gradient border border-border-med shadow-soft",
      premium: "bg-hero-gradient text-white shadow-medium border-none",
      glass: "bg-glass-bg backdrop-blur-md border border-border-light shadow-soft",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { scale: 1.02, y: -2, boxShadow: 'var(--shadow-medium)' } : undefined}
        transition={{ duration: 0.2 }}
        className={cn(
          "rounded-[16px] overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
