import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  max,
  size = 140,
  strokeWidth = 3,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  
  useEffect(() => {
    // Delay slightly to allow the entrance animation to be visible
    const timer = setTimeout(() => {
      setCurrentProgress((progress / max) * 100);
    }, 200);
    return () => clearTimeout(timer);
  }, [progress, max]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          className="text-border-med"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress track */}
        <motion.circle
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-primary)" />
            <stop offset="100%" stopColor="var(--brand-primary-light)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[28px] font-heading font-bold text-text-primary leading-none">
          {progress} <span className="text-text-muted font-normal">/ {max}</span>
        </div>
        <div className="text-xs text-text-secondary mt-1">min</div>
      </div>
    </div>
  );
};
