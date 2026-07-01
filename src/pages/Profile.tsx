import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Pencil, Share, Lightbulb, ArrowRight, Play, Clock, Bookmark,
  Star, ChevronDown, Download, LogOut, Trash2, AlertTriangle,
  Lock, Flame, Check, Camera
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { api } from '../lib/api';
import { useTheme } from '../lib/ThemeContext';

/* ── Variants ─────────────────────────────────────────────────────────────── */
const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

/* ── Toggle switch ────────────────────────────────────────────────────────── */
const Toggle: React.FC<{ on: boolean; onToggle: () => void }> = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${on ? 'bg-brand-primary' : 'bg-border-light'}`}
  >
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm ${on ? 'left-[calc(100%-20px)]' : 'left-1'}`}
    />
  </button>
);

/* ── Toast ────────────────────────────────────────────────────────────────── */
const Toast: React.FC<{ msg: string; visible: boolean }> = ({ msg, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-text-primary text-white font-body text-sm px-5 py-2.5 rounded-full shadow-medium flex items-center gap-2"
      >
        <Check size={14} className="text-accent-fresh" /> {msg}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Confirm Dialog ───────────────────────────────────────────────────────── */
const ConfirmDialog: React.FC<{ open: boolean; title: string; body: string; confirmLabel: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }> = ({ open, title, body, confirmLabel, danger, onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div className="fixed inset-0 bg-black/40 z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} />
        <motion.div
          className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        >
          <div className="bg-card-light rounded-2xl shadow-medium w-full max-w-sm p-6">
            <h3 className="font-heading font-bold text-lg text-text-primary">{title}</h3>
            <p className="font-body text-sm text-text-secondary mt-2 leading-relaxed">{body}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={onCancel} className="flex-1 h-10 rounded-xl border border-border-light font-body font-medium text-sm text-text-secondary hover:bg-bg-secondary transition-colors">Cancel</button>
              <button onClick={onConfirm} className={`flex-1 h-10 rounded-xl font-body font-semibold text-sm text-white transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-primary hover:bg-brand-primary-light'}`}>{confirmLabel}</button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ── Accordion ────────────────────────────────────────────────────────────── */
const AccordionItem: React.FC<{ title: string; icon: any; children: React.ReactNode; isOpen: boolean; onClick: () => void }> = ({ title, icon: Icon, children, isOpen, onClick }) => (
  <div className="border-b border-border-light last:border-0">
    <button onClick={onClick} className="w-full px-5 py-5 flex items-center justify-between hover:bg-card-lavender transition-colors text-left">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-text-primary" />
        <span className="font-body font-semibold text-[15px] text-text-primary">{title}</span>
      </div>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown size={20} className="text-text-secondary" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="overflow-hidden">
          <div className="px-5 pb-5 pt-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════ */
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Accordion */
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const toggleAccordion = (id: string) => setOpenAccordion(openAccordion === id ? null : id);

  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    api.getUser().then(setUser).catch(console.error);
    api.getProgress().then(setProgress).catch(console.error);
  }, []);

  /* Avatar */
  const [avatar, setAvatar] = useState('/profile.webp');

  /* Theme */
  const { theme, setTheme } = useTheme();

  /* Notification toggles */
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [sessionReminders, setSessionReminders] = useState(true);

  /* Privacy toggles */
  const [pinProtection, setPinProtection] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('Public');

  /* Toast */
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = (msg: string) => { setToast(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), 2500); };

  /* Dialogs */
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* Badge expand */
  const [showAllBadges, setShowAllBadges] = useState(false);

  /* All badges */
  const ALL_BADGES = [
    { id: 1, earned: progress?.sessionsDone > 0, icon: '🎯', name: 'First Session' },
    { id: 2, earned: user?.streak >= 3, icon: '🔥', name: '3-Day Streak' },
    { id: 3, earned: false, icon: '📚', name: '10 Quotes' },
    { id: 4, earned: progress?.totalMinutes >= 60, icon: '🧘', name: 'Mindful' },
    { id: 5, earned: false, icon: '🌟', name: 'Early Bird' },
    { id: 6, earned: false, icon: '🌙', name: 'Night Owl' },
    { id: 7, earned: progress?.sessionsDone >= 100, icon: '💎', name: '100 Sessions' },
    { id: 8, earned: false, icon: '👑', name: 'Mastery' },
    { id: 9, earned: user?.streak >= 30, icon: '🚀', name: '30-Day Streak' },
    { id: 10, earned: false, icon: '🌈', name: 'All Categories' },
    { id: 11, earned: false, icon: '💡', name: 'Insight Seeker' },
    { id: 12, earned: false, icon: '🏔️', name: 'Peak Focus' },
  ];
  const visibleBadges = showAllBadges ? ALL_BADGES : ALL_BADGES.slice(0, 8);
  const earnedCount = ALL_BADGES.filter(b => b.earned).length;

  /* Handlers */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      showToast('Profile photo updated!');
    }
  };

  const handleShareProfile = async () => {
    const text = 'Check out my Quantum Mindset profile!';
    if (navigator.share) {
      try { await navigator.share({ title: 'Quantum Profile', text }); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      showToast('Profile link copied!');
    }
  };

  const handleDownloadData = () => {
    const data = { user: 'John Doe', email: 'john@example.com', sessions: 12, mindfulMinutes: 340, streak: 3, exported: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'quantum-data.json'; a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!');
  };

  const handleOpenEditProfile = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await api.updateUser({ name: editName, email: editEmail });
      setUser((prev: any) => ({ ...prev, name: updatedUser.name, email: updatedUser.email }));
      setShowEditProfile(false);
      showToast('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile');
    }
  };

  return (
    <motion.div className="w-full pt-8 pb-16 px-6 lg:px-8 max-w-5xl mx-auto" variants={staggerContainer} initial="hidden" animate="show">
      {/* HEADER */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="font-body text-xs text-text-secondary mb-2">
          <button onClick={() => navigate('/home')} className="hover:underline">Home</button> / <span>Profile</span>
        </div>
        <h1 className="font-heading font-bold text-[32px] text-text-primary">Your Profile</h1>
      </motion.div>

      {/* 1. PROFILE INFO CARD */}
      <motion.div variants={fadeUp}>
        <Card className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-[140px] h-[140px] rounded-full border-4 border-brand-primary overflow-hidden shadow-[0_8px_24px_rgba(61,49,196,0.15)] relative">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md">
              <Pencil size={14} />
            </div>
            <div className="text-center mt-3 font-body text-xs text-brand-primary hover:underline">Change Avatar</div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="font-heading font-extrabold text-[28px] text-text-primary">{user?.name || 'Explorer'}</h2>
            <p className="font-body text-[15px] text-text-secondary mt-1">{user?.email || 'explorer@quantum.app'}</p>
            <p className="font-body text-[13px] text-text-secondary mt-1">Member since today</p>
            <div className="mt-4 bg-accent-warm/10 border border-accent-warm/30 rounded-xl px-4 py-3 inline-flex flex-col items-center md:items-start">
              <div className="font-body font-semibold text-sm text-accent-warm flex items-center gap-2">
                <Flame size={16} fill="currentColor" /> {user?.streak || 0}-Day Streak
              </div>
              <div className="font-body text-[11px] text-text-secondary mt-1">Personal Best: {user?.streak || 0} Days</div>
            </div>
          </div>

          <div className="w-full md:w-[200px] flex flex-col gap-3">
            <Button onClick={handleOpenEditProfile} className="w-full gap-2 text-[15px] h-12 rounded-xl">
              <Pencil size={16} /> Edit Profile
            </Button>
            <Button onClick={handleShareProfile} variant="secondary" className="w-full gap-2 text-[15px] h-12 rounded-xl bg-brand-primary-pale text-brand-primary border-none">
              <Share size={16} /> Share Profile
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* 2. PROFILE COMPLETION */}
      <motion.div variants={fadeUp} className="mt-6">
        <Card variant="warm" className="p-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white flex-shrink-0">
            <Lightbulb size={16} />
          </div>
          <div className="flex-1">
            <h3 className="font-body font-semibold text-[15px] text-text-primary">Complete Your Profile</h3>
            <div className="font-body text-xs text-text-secondary mt-1">80% complete — finish to unlock bonus features</div>
            <div className="w-full h-1 bg-border-med rounded-full mt-2 overflow-hidden">
              <div className="h-full w-[80%] bg-hero-gradient rounded-full" />
            </div>
          </div>
          <button onClick={handleOpenEditProfile} className="text-brand-primary hover:scale-110 transition-transform">
            <ArrowRight size={20} />
          </button>
        </Card>
      </motion.div>

      {/* 3. STATS & ACHIEVEMENTS */}
      <motion.div variants={staggerContainer} className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats Column */}
        <div className="flex flex-col gap-4">
          {[
            { icon: Play, bg: 'bg-brand-primary', color: 'text-brand-primary', value: progress?.sessionsDone || 0, label: 'Sessions Completed', sub: 'this week', subColor: 'text-accent-calm', to: '/sessions' },
            { icon: Clock, bg: 'bg-accent-calm', color: 'text-accent-calm', value: progress?.totalMinutes || 0, label: 'Mindful Minutes', sub: 'this week', subColor: 'text-accent-calm', to: '/progress' },
            { icon: Bookmark, bg: 'bg-accent-warm', color: 'text-accent-warm', value: '-', label: 'Saved Quotes', sub: 'Check saved page', subColor: 'text-accent-warm', to: '/saved' },
            { icon: Star, bg: 'bg-accent-fresh', color: 'text-accent-fresh', value: progress?.totalPoints || 0, label: 'Wellness Points', sub: 'Keep earning!', subColor: 'text-accent-fresh', to: '/progress' },
          ].map((s, i) => (
            <Card key={i} hoverable className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => navigate(s.to)}>
              <div className={`w-8 h-8 rounded-full ${s.bg} text-white flex items-center justify-center`}>
                <s.icon size={16} fill={i === 0 || i === 3 ? 'currentColor' : 'none'} />
              </div>
              <div className="flex-1">
                <div className={`font-heading font-bold text-[32px] ${s.color} leading-none`}>{s.value}</div>
                <div className="font-body font-medium text-[13px] text-text-primary mt-1">{s.label}</div>
                <div className={`font-body text-[11px] ${s.subColor} mt-0.5 hover:underline`}>{s.sub}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Achievements Column */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body font-semibold text-base text-text-primary">Your Achievements 🏆</h3>
            <span className="font-body text-xs text-text-secondary">{earnedCount} / {ALL_BADGES.length} earned</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {visibleBadges.map(badge => (
              <div key={badge.id} className="relative group cursor-pointer flex flex-col items-center">
                <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110 
                  ${badge.earned ? 'bg-brand-primary-pale shadow-[0_0_15px_rgba(61,49,196,0.1)]' : 'bg-border-light opacity-50 grayscale'}`}>
                  {badge.earned ? badge.icon : <Lock size={20} className="text-text-muted" />}
                </div>
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-text-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                  {badge.earned ? badge.name : 'Locked'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => setShowAllBadges(v => !v)} className="font-body text-[13px] text-brand-primary hover:underline">
              {showAllBadges ? 'Show Less ↑' : `View All ${ALL_BADGES.length} →`}
            </button>
          </div>
        </Card>
      </motion.div>

      {/* 4. RECENT ACTIVITY */}
      <motion.div variants={fadeUp} className="mt-12">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body font-semibold text-base text-text-primary">Recent Sessions</h3>
            <button onClick={() => navigate('/sessions')} className="font-body text-[13px] text-brand-primary hover:underline">View All →</button>
          </div>
          <div className="flex flex-col gap-3">
            {progress?.recentSessions?.length ? progress.recentSessions.map((session: any) => (
              <div key={session.id} onClick={() => navigate('/sessions')} className="flex items-center gap-3 p-2 hover:bg-card-lavender rounded-lg transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-brand-primary-pale flex items-center justify-center text-lg">🧘</div>
                <div className="flex-1">
                  <div className="font-body font-medium text-sm text-text-primary">{session.title}</div>
                  <div className="font-body text-xs text-text-secondary mt-0.5">{session.duration} min • {new Date(session.completedAt).toLocaleDateString()}</div>
                </div>
                <div className="font-body font-semibold text-sm text-accent-warm">+{session.points} pts</div>
              </div>
            )) : (
              <div className="text-sm text-text-secondary">No recent sessions found. Start exploring!</div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* 5. PREFERENCES & SETTINGS */}
      <motion.div variants={fadeUp} className="mt-12">
        <Card className="p-0 overflow-hidden">
          <AccordionItem title="🎨 Appearance" icon={Pencil} isOpen={openAccordion === 'appearance'} onClick={() => toggleAccordion('appearance')}>
            <div className="flex flex-col gap-5 font-body text-sm text-text-secondary">
              <div className="flex justify-between items-center">
                <span>Theme</span>
                <div className="flex gap-2">
                  {(['light', 'dark', 'system'] as const).map(t => (
                    <button key={t} onClick={() => { setTheme(t); showToast(`Theme set to ${t}`); }}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all capitalize ${theme === t ? 'bg-brand-primary-pale text-brand-primary ring-1 ring-brand-primary' : 'hover:bg-border-light text-text-secondary'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="🔔 Notifications" icon={Clock} isOpen={openAccordion === 'notifications'} onClick={() => toggleAccordion('notifications')}>
            <div className="flex flex-col gap-5 font-body text-sm text-text-secondary">
              {[
                { label: 'Push Notifications', desc: 'Receive alerts on your device', value: pushNotifs, set: setPushNotifs },
                { label: 'Email Digest', desc: 'Weekly summary in your inbox', value: emailDigest, set: setEmailDigest },
                { label: 'Session Reminders', desc: 'Daily nudge to stay consistent', value: sessionReminders, set: setSessionReminders },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-text-primary text-[13px]">{item.label}</div>
                    <div className="text-[11px] text-text-muted">{item.desc}</div>
                  </div>
                  <Toggle on={item.value} onToggle={() => { item.set(!item.value); showToast(`${item.label} ${!item.value ? 'enabled' : 'disabled'}`); }} />
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="🔐 Privacy & Security" icon={Lock} isOpen={openAccordion === 'privacy'} onClick={() => toggleAccordion('privacy')}>
            <div className="flex flex-col gap-5 font-body text-sm text-text-secondary">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-text-primary text-[13px]">PIN Protection</div>
                  <div className="text-[11px] text-text-muted">Require PIN to open the app</div>
                </div>
                <Toggle on={pinProtection} onToggle={() => { setPinProtection(v => !v); showToast(`PIN Protection ${!pinProtection ? 'enabled' : 'disabled'}`); }} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-text-primary text-[13px]">Profile Visibility</div>
                  <div className="text-[11px] text-text-muted">Who can see your profile</div>
                </div>
                <select value={profileVisibility} onChange={e => { setProfileVisibility(e.target.value); showToast(`Visibility set to ${e.target.value}`); }}
                  className="bg-bg-secondary border border-border-light rounded-lg px-2 py-1.5 text-xs text-text-primary outline-none focus:border-brand-primary">
                  <option>Public</option>
                  <option>Friends Only</option>
                  <option>Private</option>
                </select>
              </div>
            </div>
          </AccordionItem>
        </Card>
      </motion.div>

      {/* 6. DANGER ZONE */}
      <motion.div variants={fadeUp} className="mt-12 mb-8">
        <div className="bg-card-light border-2 border-red-500/10 rounded-2xl p-5 flex flex-col gap-1">
          <button onClick={handleDownloadData} className="flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors group w-full text-left">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-text-primary" />
              <div>
                <div className="font-body font-medium text-text-primary">Download My Data</div>
                <div className="font-body text-[11px] text-text-secondary">GDPR-compliant JSON export</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-text-secondary group-hover:text-text-primary" />
          </button>

          <button onClick={() => setShowSignOutConfirm(true)} className="flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors group w-full text-left">
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-500" />
              <div>
                <div className="font-body font-medium text-red-500">Sign Out</div>
                <div className="font-body text-[11px] text-text-secondary">Log out of your account</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-red-500" />
          </button>

          <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors group w-full text-left">
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-500" />
              <div>
                <div className="font-body font-bold text-red-500 flex items-center gap-2">Delete Account <AlertTriangle size={14} /></div>
                <div className="font-body text-[11px] text-text-secondary">Permanently delete account and data</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-red-500" />
          </button>
        </div>
      </motion.div>

      {/* Dialogs */}
      <ConfirmDialog
        open={showSignOutConfirm}
        title="Sign Out"
        body="Are you sure you want to sign out? Your preferences will be saved on this device."
        confirmLabel="Sign Out"
        onConfirm={() => { setShowSignOutConfirm(false); showToast('Signed out successfully.'); }}
        onCancel={() => setShowSignOutConfirm(false)}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Account?"
        body="This action is permanent and irreversible. All your sessions, progress, saved quotes, and streaks will be deleted forever."
        confirmLabel="Delete Forever"
        danger
        onConfirm={() => { setShowDeleteConfirm(false); navigate('/signin'); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Edit Profile Dialog */}
      <AnimatePresence>
        {showEditProfile && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditProfile(false)} />
            <motion.div
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-card-light rounded-2xl shadow-medium w-full max-w-sm p-6">
                <h3 className="font-heading font-bold text-lg text-text-primary mb-4">Edit Profile</h3>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-body text-[13px] font-semibold text-text-secondary mb-1">Display Name</label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)}
                      className="w-full h-10 px-3 bg-bg-secondary border border-border-light rounded-xl font-body text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[13px] font-semibold text-text-secondary mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editEmail} 
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full h-10 px-3 bg-bg-secondary border border-border-light rounded-xl font-body text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowEditProfile(false)} className="flex-1 h-10 rounded-xl border border-border-light font-body font-medium text-sm text-text-secondary hover:bg-bg-secondary transition-colors">Cancel</button>
                  <button onClick={handleSaveProfile} className="flex-1 h-10 rounded-xl bg-brand-primary font-body font-semibold text-sm text-white hover:bg-brand-primary-light transition-colors">Save</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast msg={toast} visible={toastVisible} />
    </motion.div>
  );
};

export default Profile;
