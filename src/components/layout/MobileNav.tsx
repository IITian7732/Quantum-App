import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Target, Heart } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: BarChart2, label: 'Progress', path: '/progress' },
    { icon: Target, label: 'Sessions', path: '/sessions' },
    { icon: Heart, label: 'Saved', path: '/saved' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full h-[72px] bg-card-light border-t border-border-light z-50 flex items-center justify-around px-2">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors
            ${isActive ? 'text-brand-primary' : 'text-text-secondary'}
          `}
        >
          <div className={`p-1.5 rounded-full ${window.location.pathname === item.path ? 'bg-brand-primary-pale' : ''}`}>
             <item.icon size={22} className={window.location.pathname === item.path ? 'text-brand-primary' : 'text-text-secondary'} />
          </div>
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
