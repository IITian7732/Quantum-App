import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Play, Clock, Search, CheckCircle2,
  Flame, Target, Wind, Coffee, Moon, Sun, Zap, Music,
  Star, X, ArrowLeft
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const CATEGORIES = ['All', 'Meditation', 'Focus', 'Breathe', 'Energy', 'Sleep'];

const INITIAL_SESSIONS = [
  {
    id: 1, tag: 'MEDITATION', title: 'Morning Clarity', desc: 'Start your day with a clear and focused mind through guided visualisation.',
    time: '12m', icon: Sun, iconColor: 'bg-accent-warm', completed: false, rating: null, durationMinutes: 12, points: 25,
    img: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2, tag: 'FOCUS', title: 'Deep Work Flow', desc: 'Binaural beats and ambient sound to achieve peak concentration.',
    time: '45m', icon: Zap, iconColor: 'bg-brand-primary', completed: false, rating: null, durationMinutes: 45, points: 50,
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3, tag: 'BREATHE', title: 'Box Breathing', desc: 'A quick 4-4-4-4 breathing technique to instantly calm the nervous system.',
    time: '5m', icon: Wind, iconColor: 'bg-accent-calm', completed: false, rating: null, durationMinutes: 5, points: 10,
    img: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4, tag: 'ENERGY', title: 'Power Reset', desc: 'High-energy breathwork to recharge your body and mind in under 10 minutes.',
    time: '8m', icon: Flame, iconColor: 'bg-accent-soft', completed: false, rating: null, durationMinutes: 8, points: 15,
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 5, tag: 'FOCUS', title: 'Clarity Sprint', desc: 'A timed Pomodoro-style mindset session for laser-sharp focus.',
    time: '25m', icon: Target, iconColor: 'bg-brand-primary', completed: false, rating: null, durationMinutes: 25, points: 30,
    img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 6, tag: 'SLEEP', title: 'Wind Down', desc: 'A soothing bedtime routine with body scan and sleep affirmations.',
    time: '20m', icon: Moon, iconColor: 'bg-[#6C5CE7]', completed: false, rating: null, durationMinutes: 20, points: 25,
    img: 'https://images.unsplash.com/photo-1455642305367-68834a9f7e52?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 7, tag: 'MEDITATION', title: 'Gratitude Practice', desc: 'Cultivate deep appreciation and shift your mindset to abundance.',
    time: '10m', icon: Star, iconColor: 'bg-accent-fresh', completed: false, rating: null, durationMinutes: 10, points: 20,
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 8, tag: 'BREATHE', title: 'Midday Reset', desc: 'Two-minute breathing micro-break to prevent afternoon burnout.',
    time: '2m', icon: Coffee, iconColor: 'bg-accent-warm', completed: false, rating: null, durationMinutes: 2, points: 5,
    img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 9, tag: 'FOCUS', title: 'Flow State Activation', desc: 'Prime your brain for deep, creative, effortless work.',
    time: '30m', icon: Music, iconColor: 'bg-brand-primary-light', completed: false, rating: null, durationMinutes: 30, points: 40,
    img: 'https://images.unsplash.com/photo-1541753866388-0b3c701627d3?auto=format&fit=crop&q=80&w=600',
  },
];

const TAG_COLORS: Record<string, string> = {
  MEDITATION: 'bg-accent-warm/10 text-accent-warm',
  FOCUS: 'bg-brand-primary-pale text-brand-primary',
  BREATHE: 'bg-accent-calm/10 text-accent-calm',
  ENERGY: 'bg-accent-soft/10 text-accent-soft',
  SLEEP: 'bg-[#6C5CE7]/10 text-[#6C5CE7]',
};

const Sessions: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [activeSession, setActiveSession] = useState<typeof INITIAL_SESSIONS[0] | null>(null);
  const [runningSession, setRunningSession] = useState<typeof INITIAL_SESSIONS[0] | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const [progress, setProgress] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const fetchProgress = () => {
    api.getUser().then(setUser).catch(console.error);
    api.getProgress().then(data => {
      setProgress(data);
      // Update local session completion status based on history if desired
      // For a new user, recentSessions will just be empty initially
    }).catch(console.error);
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const startSession = (s: typeof INITIAL_SESSIONS[0]) => {
    setRunningSession(s);
    setTimer(0);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  };

  const endSession = async (completed: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (completed && runningSession) {
      try {
        await api.saveSession({
          title: runningSession.title,
          tag: runningSession.tag,
          duration: runningSession.durationMinutes,
          points: runningSession.points,
        });
        fetchProgress();
        setSessions(prev => prev.map(s => s.id === runningSession.id ? { ...s, completed: true } : s));
      } catch (err) {
        console.error('Failed to save session', err);
      }
    }
    setRunningSession(null);
    setTimer(0);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const filtered = sessions.filter(s => {
    const matchCat = activeCategory === 'All' || s.tag.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const completedCount = progress?.sessionsDone || 0;

  return (
    <motion.div
      className="w-full pt-10 pb-20 px-6 lg:px-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* PAGE HEADER */}
      <motion.div variants={fadeUp} className="mb-8">
        <p className="font-body text-xs text-text-secondary mb-1">Home / Sessions</p>
        <h1 className="font-heading font-extrabold text-[32px] text-text-primary">Your Sessions</h1>
        <p className="mt-1 font-body text-[15px] text-text-secondary">
          {completedCount} of {sessions.length} sessions completed this week 🎯
        </p>
      </motion.div>

      {/* TOP HIGHLIGHT: FEATURED SESSION */}
      <motion.div variants={fadeUp} className="mb-10">
        <Card variant="premium" className="relative overflow-hidden p-0">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=1200" alt="Featured" className="w-full h-full object-cover opacity-20" />
          </div>
          <div className="relative z-10 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="font-body font-semibold text-[11px] text-white/60 uppercase tracking-[2px] mb-3">✦ Up Next</div>
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white leading-tight">Power Reset</h2>
              <p className="mt-2 font-body text-[15px] text-white/70 max-w-md">High-energy breathwork to recharge your body and mind in under 10 minutes.</p>
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <div className="bg-white/10 border border-white/20 rounded-full px-3 py-1 font-body text-xs text-white flex items-center gap-1.5"><Clock size={12} /> 8 min</div>
                <div className="bg-accent-soft/20 border border-accent-soft/30 rounded-full px-3 py-1 font-body text-xs text-accent-soft">ENERGY</div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button onClick={() => setActiveSession(sessions[3])} className="h-14 px-8 text-base gap-3 rounded-2xl shadow-glow-indigo">
                <Play size={20} fill="currentColor" /> Begin Session
              </Button>
            </div>
          </div>
          <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white/5 blur-[50px] rounded-full animate-float" />
        </Card>
      </motion.div>

      {/* PROGRESS SUMMARY STRIP */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Completed', value: completedCount, unit: 'sessions', color: 'text-accent-fresh', bg: 'bg-accent-fresh/10', icon: CheckCircle2 },
          { label: 'Total Time', value: progress?.totalMinutes || 0, unit: 'min', color: 'text-brand-primary', bg: 'bg-brand-primary-pale', icon: Clock },
          { label: 'Streak', value: user?.streak || 0, unit: 'days', color: 'text-accent-warm', bg: 'bg-accent-warm/10', icon: Flame },
        ].map((stat) => (
          <Card key={stat.label} hoverable className="p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <div className={`font-heading font-bold text-2xl ${stat.color} leading-none`}>
                {stat.value}<span className="font-body font-normal text-xs text-text-secondary ml-1">{stat.unit}</span>
              </div>
              <div className="font-body text-[11px] text-text-secondary mt-0.5">{stat.label}</div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* SEARCH + FILTER BAR */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="w-full h-10 pl-9 pr-4 bg-card-light border border-border-light rounded-xl font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-body font-medium text-sm transition-all duration-150 flex-shrink-0
                ${activeCategory === cat
                  ? 'bg-hero-gradient text-white border-transparent shadow-soft'
                  : 'bg-card-light border border-border-light text-text-secondary hover:border-brand-primary hover:text-brand-primary'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* SESSION GRID */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={staggerContainer}
      >
        {filtered.map((session) => (
          <motion.div key={session.id} variants={fadeUp}>
            <Card hoverable className="group cursor-pointer p-0 flex flex-col overflow-hidden h-full">
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-border-light">
                <img
                  src={session.img}
                  alt={session.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Duration badge */}
                <div className="absolute bottom-3 left-3 bg-black/80 text-white font-body font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock size={11} /> {session.time}
                </div>
                {/* Completed badge */}
                {session.completed && (
                  <div className="absolute top-3 right-3 bg-accent-fresh text-white rounded-full p-1.5">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <span className={`self-start text-[10px] font-body font-semibold px-2 py-0.5 rounded-md ${TAG_COLORS[session.tag] ?? 'bg-border-light text-text-secondary'}`}>
                  {session.tag}
                </span>
                <h3 className="mt-2 font-heading font-bold text-base text-text-primary">{session.title}</h3>
                <p className="mt-1 font-body text-[13px] text-text-secondary leading-relaxed line-clamp-2">{session.desc}</p>

                {/* Star rating for completed */}
                {session.completed && session.rating && (
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < session.rating! ? 'text-accent-warm fill-accent-warm' : 'text-border-med'} />
                    ))}
                  </div>
                )}

              <div className="mt-auto pt-4">
                  <button
                    onClick={() => setActiveSession(session)}
                    className={`w-full h-9 rounded-xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150
                      ${session.completed
                        ? 'bg-accent-fresh/10 text-accent-fresh hover:bg-accent-fresh/20'
                        : 'bg-hero-gradient text-white hover:shadow-hover'
                      }`}
                  >
                    {session.completed ? (<><CheckCircle2 size={15} /> Redo Session</>) : (<><Play size={14} fill="currentColor" /> Start Session</>)}
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <motion.div variants={fadeUp} className="py-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-border-med flex items-center justify-center text-3xl mb-4">🔍</div>
          <h3 className="font-heading font-bold text-lg text-text-primary">No sessions found</h3>
          <p className="font-body text-sm text-text-secondary mt-1">Try a different category or search term.</p>
          <button onClick={() => { setActiveCategory('All'); setSearch(''); }} className="mt-4 font-body text-sm text-brand-primary hover:underline">
            Clear filters
          </button>
        </motion.div>
      )}

      {/* SESSION DETAIL MODAL */}
      <AnimatePresence>
        {activeSession && !runningSession && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveSession(null)} />
            <motion.div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="bg-card-light rounded-3xl w-full max-w-md overflow-hidden shadow-medium">
                <div className="relative h-52 overflow-hidden">
                  <img src={activeSession.img} alt={activeSession.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <button onClick={() => setActiveSession(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-md ${TAG_COLORS[activeSession.tag] ?? 'bg-border-light text-text-secondary'}`}>{activeSession.tag}</span>
                    <h2 className="font-heading font-bold text-xl text-white mt-1">{activeSession.title}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-body text-[14px] text-text-secondary leading-relaxed">{activeSession.desc}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-body text-sm text-text-secondary"><Clock size={14} /> {activeSession.time}</div>
                    {activeSession.completed && <div className="flex items-center gap-1.5 font-body text-sm text-accent-fresh"><CheckCircle2 size={14} /> Completed</div>}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setActiveSession(null)} className="flex-1 h-11 rounded-xl border border-border-light font-body font-medium text-sm text-text-secondary hover:bg-bg-secondary transition-colors">Cancel</button>
                    <button onClick={() => startSession(activeSession)} className="flex-1 h-11 rounded-xl bg-hero-gradient text-white font-body font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-hover transition-all">
                      <Play size={16} fill="currentColor" /> {activeSession.completed ? 'Redo Session' : 'Begin Now'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ACTIVE SESSION OVERLAY */}
      <AnimatePresence>
        {runningSession && (
          <motion.div className="fixed inset-0 z-[110] bg-gradient-to-br from-[#3D31C4] to-[#6C5CE7] flex flex-col items-center justify-center text-white"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="font-body text-[11px] uppercase tracking-[3px] text-white/60 mb-4">Now Playing</div>
            <div className="text-6xl mb-4">
              {runningSession.tag === 'MEDITATION' ? '🧘' : runningSession.tag === 'BREATHE' ? '🌬️' : runningSession.tag === 'FOCUS' ? '🎯' : '🔥'}
            </div>
            <h2 className="font-heading font-bold text-3xl text-white">{runningSession.title}</h2>
            <div className="font-data text-[60px] font-bold text-white mt-8 mb-2 tabular-nums">{formatTime(timer)}</div>
            <div className="font-body text-white/60 text-sm mb-12">Session in progress…</div>
            <div className="flex gap-4">
              <button onClick={() => endSession(false)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 font-body font-semibold text-sm hover:bg-white/20 transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => endSession(true)} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-brand-primary font-body font-bold text-sm hover:shadow-hover transition-all">
                <CheckCircle2 size={16} /> Complete Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sessions;
