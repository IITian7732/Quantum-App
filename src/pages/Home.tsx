import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, BarChart2, RefreshCw, Copy, Share, Medal, Flame, Target, Clock, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { quotes } from '../data/quotes';
import { api } from '../lib/api';

/* ── Animation variants ─────────────────────────────────────────────────── */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ── Session data ───────────────────────────────────────────────────────── */
const SESSION_CARDS = [
  { tag: 'MEDITATION', title: 'Morning Clarity',  desc: 'Guided meditation for focus',         time: '12m', img: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=400' },
  { tag: 'FOCUS',      title: 'Deep Work Flow',   desc: 'Ambient sounds and binaural beats',   time: '45m', img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=400' },
  { tag: 'BREATHE',    title: 'Box Breathing',    desc: 'Quick reset for stress relief',       time: '5m',  img: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400' },
  { tag: 'BREAK',      title: 'Mindful Walk',     desc: 'Guided audio for your daily walk',    time: '15m', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400' },
];

/* ── Toast component ────────────────────────────────────────────────────── */
const Toast: React.FC<{ message: string; visible: boolean }> = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-text-primary text-white font-body font-medium text-sm px-5 py-2.5 rounded-full shadow-medium flex items-center gap-2"
      >
        <Check size={15} className="text-accent-fresh" /> {message}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Home page ──────────────────────────────────────────────────────────── */
const Home: React.FC = () => {
  const navigate = useNavigate();

  /* Quote state */
  const [quoteIdx, setQuoteIdx]     = useState(() => Math.floor(Math.random() * quotes.length));
  const [spinning, setSpinning]     = useState(false);
  const [toast, setToast]           = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    api.getUser().then(setUser).catch(console.error);
    api.getProgress().then(setProgress).catch(console.error);
  }, []);

  const currentQuote = quotes[quoteIdx];

  /* Helpers */
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const generateNewQuote = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => {
      setQuoteIdx(i => {
        let next = i;
        while (next === i) next = Math.floor(Math.random() * quotes.length);
        return next;
      });
      setSpinning(false);
    }, 400);
  };

  const copyQuote = () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(text).catch(() => {});
    showToast('Quote copied to clipboard!');
  };

  const shareQuote = async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Daily Insight', text }); } catch {}
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
      showToast('Link copied — share away!');
    }
  };

  return (
    <motion.div
      className="w-full pt-20 pb-16 px-6 lg:px-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left */}
        <motion.div className="flex-1 lg:w-[60%] flex flex-col justify-center" variants={fadeUp}>
          <h1 className="font-heading font-extrabold text-[40px] md:text-[48px] text-text-primary leading-tight">
            Good afternoon, <span className="text-transparent bg-clip-text bg-hero-gradient">{user?.name ? user.name.split(' ')[0] : 'Explorer'} ☀️</span>
          </h1>
          <p className="mt-4 font-body text-lg text-text-secondary max-w-lg leading-relaxed">
            Your clarity journey continues today. You're on a{' '}
            <span className="font-bold text-accent-warm">{user?.streak || 0}-day</span> focus streak 🔥
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-[220px] gap-2"
              onClick={() => navigate('/sessions')}
            >
              <Play size={18} fill="currentColor" /> Start Today's Session
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-[220px] gap-2"
              onClick={() => navigate('/progress')}
            >
              <BarChart2 size={18} /> View My Progress
            </Button>
          </div>
        </motion.div>

        {/* Right — Today's Goal widget */}
        <motion.div className="w-full lg:w-[40%] max-w-md mx-auto lg:mx-0" variants={fadeUp}>
          <Card variant="warm" className="p-6">
            <div className="font-body font-semibold text-xs text-text-secondary uppercase tracking-[1px]">
              Today's Goal
            </div>
            <div className="mt-6 flex justify-center">
              <ProgressRing progress={progress?.totalMinutes || 0} max={60} />
            </div>
            <div className="mt-6 flex justify-between items-center px-4">
              <span className="font-body font-medium text-xs text-text-secondary">Mindful Minutes</span>
              <span className="font-body text-xs text-text-muted">Focus Score: {progress?.sessionsDone ? '100%' : '0%'}</span>
            </div>
            <div className="mt-6 bg-accent-warm/10 border border-accent-warm/30 rounded-[10px] p-3 flex justify-between items-center">
              <div className="font-body font-semibold text-sm text-accent-warm flex items-center gap-2">
                <Flame size={16} /> Day {user?.streak || 0} Streak
              </div>
              <div className="font-body text-[11px] text-text-secondary">+1 Personal Best: {user?.streak || 0} Days</div>
            </div>
            <div className="mt-4 flex justify-between items-center px-2">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <div key={day} className="flex justify-center w-6">
                  {day < (user?.streak || 0) ? (
                    <div className="w-2 h-2 rounded-full bg-accent-warm" />
                  ) : day === (user?.streak || 0) && (user?.streak || 0) > 0 ? (
                    <div className="w-2 h-2 rounded-full bg-accent-warm animate-pulse-ring" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-border-med" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── 2. TODAY'S INSIGHT ──────────────────────────────────────────── */}
      <motion.div className="mt-12 mb-12" variants={fadeUp}>
        <Card variant="premium" className="relative p-8 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-white/5 blur-[40px] rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/5 blur-[30px] rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-4 right-6 font-accent font-bold text-[120px] text-white/5 leading-none pointer-events-none">"</div>

          <div className="relative z-10 w-full lg:w-[65%]">
            <div className="font-body font-semibold text-[11px] text-white/60 uppercase tracking-[2px]">✦ Daily Insight</div>

            {/* Animated quote swap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mt-4 font-accent font-bold text-2xl text-white italic leading-[1.6]">
                  "{currentQuote.text}"
                </p>
                <div className="w-6 h-[1px] bg-white/40 mt-5" />
                <div className="mt-5 font-body text-[13px] text-white/60">— {currentQuote.author}</div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex gap-3 flex-wrap">
              {/* Generate New Quote */}
              <button
                onClick={generateNewQuote}
                disabled={spinning}
                className="h-8 px-4 rounded-full border border-white/40 text-white font-body font-semibold text-[13px] hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                <motion.div animate={{ rotate: spinning ? 360 : 0 }} transition={{ duration: 0.4 }}>
                  <RefreshCw size={14} />
                </motion.div>
                Generate New Quote
              </button>

              {/* Copy */}
              <button
                onClick={copyQuote}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                title="Copy quote"
              >
                <Copy size={16} />
              </button>

              {/* Share */}
              <button
                onClick={shareQuote}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                title="Share quote"
              >
                <Share size={16} />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── 3. QUICK STATS ROW ──────────────────────────────────────────── */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={staggerContainer}>
        {/* Mindful Time card → Progress */}
        <Card
          hoverable
          className="p-5 flex flex-col justify-between cursor-pointer"
          variants={fadeUp}
          onClick={() => navigate('/progress')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white">
              <Medal size={18} />
            </div>
            <div className="font-heading font-bold text-[32px] text-text-primary leading-none">
              {progress?.totalMinutes || 0}<span className="font-body font-normal text-xs text-text-secondary ml-1">min</span>
            </div>
          </div>
          <div className="mt-4 font-body font-medium text-[13px] text-text-primary">This Week's Mindful Time</div>
          <div
            className="mt-1 font-body text-[11px] text-brand-primary hover:underline cursor-pointer"
            onClick={e => { e.stopPropagation(); navigate('/progress'); }}
          >
            Goal: 420 min
          </div>
          <div className="w-full h-1 bg-border-med rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-hero-gradient rounded-full" style={{ width: `${Math.min(((progress?.totalMinutes || 0) / 420) * 100, 100)}%` }} />
          </div>
        </Card>

        {/* Streak card → Progress */}
        <Card
          hoverable
          className="p-5 flex flex-col justify-between cursor-pointer"
          variants={fadeUp}
          onClick={() => navigate('/progress')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-warm flex items-center justify-center text-white">
              <Flame size={18} />
            </div>
            <div className="font-heading font-bold text-[32px] text-accent-warm leading-none">
              {user?.streak || 0}<span className="font-body font-normal text-xs text-text-secondary ml-1">day</span>
            </div>
          </div>
          <div className="mt-4 font-body font-medium text-[13px] text-text-primary">Day Streak</div>
          <div className="mt-1 font-body text-[11px] text-accent-warm/70">Personal Best: {user?.streak || 0} Days</div>
          <div className="mt-2 flex gap-1 items-center">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className={`w-[5px] h-[5px] rounded-full ${i < (user?.streak || 0) ? 'bg-accent-warm' : i === (user?.streak || 0) && (user?.streak || 0) > 0 ? 'bg-accent-warm animate-pulse-ring' : 'bg-border-med'}`} />
            ))}
          </div>
        </Card>

        {/* Focus Score card → Sessions */}
        <Card
          hoverable
          className="p-5 flex flex-col justify-between cursor-pointer"
          variants={fadeUp}
          onClick={() => navigate('/sessions')}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-calm flex items-center justify-center text-white">
              <Target size={18} />
            </div>
            <div className="font-heading font-bold text-[32px] text-accent-calm leading-none">{progress?.sessionsDone ? '100' : '—'}</div>
          </div>
          <div className="mt-4 font-body font-medium text-[13px] text-text-primary">Focus Score</div>
          <div className="mt-1 font-body text-[11px] text-accent-calm">{progress?.sessionsDone ? 'Great focus this week!' : 'Complete a session to unlock your score 🌱'}</div>
        </Card>
      </motion.div>

      {/* ── 4. CURATED FOR YOU ──────────────────────────────────────────── */}
      <motion.div className="mt-16 mb-16" variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-2xl text-text-primary">Curated for You</h2>
          <button
            onClick={() => navigate('/sessions')}
            className="font-body font-medium text-sm text-brand-primary hover:underline flex items-center gap-1"
          >
            Explore All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SESSION_CARDS.map((item, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div
                onClick={() => navigate('/sessions')}
                className="group p-0 cursor-pointer flex flex-col h-full border border-border-light bg-card-light rounded-2xl overflow-hidden shadow-soft transition-all duration-200"
              >
              <div className="relative aspect-video w-full overflow-hidden bg-border-light">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-black/80 text-white font-body font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} /> {item.time}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col relative">
                <div className="bg-brand-primary-pale text-brand-primary font-body font-semibold text-[11px] px-2.5 py-1 rounded-md self-start">
                  {item.tag}
                </div>
                <h3 className="mt-2 font-heading font-bold text-base text-text-primary line-clamp-2">{item.title}</h3>
                <p className="mt-1 font-body text-[13px] text-text-secondary line-clamp-1">{item.desc}</p>
                <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <span className="font-body font-semibold text-xs text-brand-primary flex items-center gap-1">
                    Start Session <ArrowRight size={12} />
                  </span>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      <Toast message={toast} visible={toastVisible} />
    </motion.div>
  );
};

export default Home;
