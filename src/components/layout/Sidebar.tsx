import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Target, Heart, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: BarChart2, label: 'Progress', path: '/progress' },
    { icon: Target, label: 'Sessions', path: '/sessions' },
    { icon: Heart, label: 'Saved', path: '/saved' },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center py-6 w-[72px] h-[calc(100vh-64px)] fixed left-0 top-[64px] bg-card-light border-r border-border-light z-40">
      <div className="flex flex-col gap-3 flex-1">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                w-11 h-11 flex items-center justify-center rounded-[10px] transition-colors
                ${isActive ? 'bg-brand-primary-pale text-brand-primary' : 'text-text-secondary hover:text-brand-primary hover:bg-card-lavender'}
              `}
            >
              <item.icon size={24} />
            </NavLink>
            <AnimatePresence>
              {hovered === item.label && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.15, delay: 0.2 }}
                  className="absolute left-14 top-1/2 -translate-y-1/2 bg-text-primary text-white text-[10px] font-body font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap z-50 pointer-events-none"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div
        className="relative mt-auto"
        onMouseEnter={() => setHovered('Settings')}
        onMouseLeave={() => setHovered(null)}
      >
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            w-11 h-11 flex items-center justify-center rounded-[10px] transition-colors
            ${isActive ? 'bg-brand-primary-pale text-brand-primary' : 'text-text-secondary hover:text-brand-primary hover:bg-card-lavender'}
          `}
        >
          <Settings size={24} />
        </NavLink>
        <AnimatePresence>
          {hovered === 'Settings' && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.15, delay: 0.2 }}
              className="absolute left-14 top-1/2 -translate-y-1/2 bg-text-primary text-white text-[10px] font-body font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap z-50 pointer-events-none"
            >
              Settings
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
