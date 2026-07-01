import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { NotificationPanel, INITIAL_NOTIFICATIONS } from '../ui/NotificationPanel';
import type { Notification } from '../ui/NotificationPanel';

export const TopNav: React.FC = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications(ns => ns.filter(n => n.id !== id));

  return (
    <>
      <div className="sticky top-0 h-[64px] bg-card-light border-b border-border-light shadow-sm z-50 px-6 flex items-center justify-between">
        {/* LEFT SECTION */}
        <NavLink to="/home" className="flex items-center gap-3 w-[200px] hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Quantum Logo" className="w-8 h-8 object-contain" />
          <div className="hidden sm:block">
            <div className="font-heading font-bold text-lg text-brand-primary leading-tight">Quantum</div>
            <div className="font-body text-[11px] text-text-secondary leading-tight">Mindset Companion</div>
          </div>
        </NavLink>

        {/* CENTER SECTION */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Home', path: '/home' },
            { name: 'Sessions', path: '/sessions' },
            { name: 'Progress', path: '/progress' },
          ].map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                font-body font-medium text-sm transition-colors duration-150 relative pb-1
                ${isActive ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:text-brand-primary hover:border-b-2 hover:border-brand-primary'}
              `}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-end gap-4 w-[200px]">
          {/* Bell */}
          <button
            onClick={() => setNotifOpen(o => !o)}
            className={`relative transition-colors ${notifOpen ? 'text-brand-primary' : 'text-text-secondary hover:text-brand-primary'}`}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-brand-primary text-white rounded-full border-2 border-card-light flex items-center justify-center font-body font-bold text-[9px] px-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-border-light hover:border-brand-primary hover:shadow-glow-indigo transition-all"
          >
            <img src="/profile.webp" alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notifOpen} 
        onClose={() => { setNotifOpen(false); markAllRead(); }} 
        notifications={notifications}
        markAllRead={markAllRead}
        dismiss={dismiss}
      />
    </>
  );
};
