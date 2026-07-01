import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Target, CheckCircle2, Info, Star, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Notification {
  id: number;
  type: 'streak' | 'session' | 'achievement' | 'tip' | 'reminder';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'tip', title: '👋 Welcome to Quantum', body: "We're excited to have you here. Complete your first session to start your journey!", time: 'Just now', read: false },
];

const TYPE_STYLE: Record<Notification['type'], { icon: React.ElementType; iconBg: string; iconColor: string }> = {
  streak:      { icon: Flame,        iconBg: 'bg-accent-warm/10',    iconColor: 'text-accent-warm' },
  session:     { icon: CheckCircle2, iconBg: 'bg-accent-fresh/10',   iconColor: 'text-accent-fresh' },
  achievement: { icon: Star,         iconBg: 'bg-brand-primary-pale', iconColor: 'text-brand-primary' },
  tip:         { icon: Info,         iconBg: 'bg-accent-calm/10',    iconColor: 'text-accent-calm' },
  reminder:    { icon: Target,       iconBg: 'bg-accent-soft/10',    iconColor: 'text-accent-soft' },
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  markAllRead: () => void;
  dismiss: (id: number) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications, markAllRead, dismiss }) => {
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[72px] right-4 md:right-6 z-50 w-[360px] max-h-[calc(100vh-100px)] bg-card-light rounded-2xl shadow-medium border border-border-light flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-brand-primary" />
                <span className="font-heading font-bold text-[16px] text-text-primary">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-brand-primary text-white text-[10px] font-body font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="font-body text-xs text-brand-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="py-16 flex flex-col items-center text-center px-6">
                  <div className="w-12 h-12 rounded-full bg-border-light flex items-center justify-center text-2xl mb-3">🔔</div>
                  <p className="font-heading font-bold text-sm text-text-primary">You're all caught up!</p>
                  <p className="font-body text-xs text-text-secondary mt-1">No new notifications right now.</p>
                </div>
              ) : (
                <div className="py-2">
                  {/* Unread section */}
                  {notifications.some(n => !n.read) && (
                    <>
                      <div className="px-5 pt-3 pb-1 font-body font-semibold text-[10px] text-text-muted uppercase tracking-widest">
                        New
                      </div>
                      {notifications.filter(n => !n.read).map(n => (
                        <NotifRow key={n.id} n={n} onDismiss={dismiss} />
                      ))}
                    </>
                  )}

                  {/* Read section */}
                  {notifications.some(n => n.read) && (
                    <>
                      <div className="px-5 pt-4 pb-1 font-body font-semibold text-[10px] text-text-muted uppercase tracking-widest">
                        Earlier
                      </div>
                      {notifications.filter(n => n.read).map(n => (
                        <NotifRow key={n.id} n={n} onDismiss={dismiss} />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border-light flex-shrink-0 bg-bg-primary/50">
              <button
                onClick={() => { onClose(); navigate('/profile'); }}
                className="w-full h-9 rounded-xl bg-brand-primary-pale text-brand-primary font-body font-semibold text-sm hover:bg-[#DDD6FE] transition-colors"
              >
                Notification Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Single notification row ─────────────────────────────────────────────── */
const NotifRow: React.FC<{ n: Notification; onDismiss: (id: number) => void }> = ({ n, onDismiss }) => {
  const style = TYPE_STYLE[n.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-start gap-3 px-5 py-3.5 hover:bg-bg-secondary transition-colors relative
        ${!n.read ? 'bg-brand-primary-pale/20' : ''}`}
    >
      {/* Unread dot */}
      {!n.read && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-primary" />
      )}

      {/* Icon */}
      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${style.iconBg} ${style.iconColor} mt-0.5`}>
        <style.icon size={16} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-body font-semibold text-[13px] text-text-primary leading-snug">{n.title}</div>
        <div className="font-body text-[12px] text-text-secondary mt-0.5 leading-relaxed line-clamp-2">{n.body}</div>
        <div className="font-body text-[10px] text-text-muted mt-1">{n.time}</div>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(n.id)}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-border-light transition-all text-text-muted hover:text-text-primary flex-shrink-0 mt-0.5"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
};
