import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Flame, Clock, Target, TrendingUp,
  CheckCircle2, ArrowUp, Zap, Medal, ChevronRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

// ── Recharts custom tooltip ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-light border border-border-light rounded-xl px-3 py-2 shadow-medium">
        <div className="font-body font-semibold text-xs text-text-primary">{label}</div>
        <div className="font-heading font-bold text-sm text-brand-primary mt-0.5">
          {payload[0].value} min
        </div>
      </div>
    );
  }
  return null;
};

// ── Data ────────────────────────────────────────────────────────────────────
const initialWeeklyData = [
  { day: 'Mon', minutes: 0 },
  { day: 'Tue', minutes: 0 },
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 0 },
  { day: 'Fri', minutes: 0 },
  { day: 'Sat', minutes: 0 },
  { day: 'Sun', minutes: 0 },
];

const initialMonthlyData = [
  { week: 'Wk 1', minutes: 0 },
  { week: 'Wk 2', minutes: 0 },
  { week: 'Wk 3', minutes: 0 },
  { week: 'Wk 4', minutes: 0 },
];

const categoryBreakdown = [
  { name: 'Meditation', value: 0, color: 'var(--accent-warm)' },
  { name: 'Focus', value: 0, color: 'var(--brand-primary)' },
  { name: 'Breathe', value: 0, color: 'var(--accent-calm)' },
];

const STREAK_WEEKS = [
  [false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false],
];



// ── Mini circular arc chart ─────────────────────────────────────────────────
const ArcStat = ({ value, max, color, label }: { value: number; max: number; color: string; label: string }) => {
  const pct = Math.min(value / max, 1);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ * 0.75; // 270° arc
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-[135deg]">
          <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border-med)" strokeWidth="4" strokeDasharray={`${circ * 0.75} ${circ}`} />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-heading font-bold text-sm text-text-primary">{value}</div>
      </div>
      <div className="mt-1 font-body text-[10px] text-text-secondary text-center">{label}</div>
    </div>
  );
};

// ── Component ────────────────────────────────────────────────────────────────
const Progress: React.FC = () => {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [progress, setProgress] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.getUser().then(setUser).catch(console.error);
    api.getProgress().then(setProgress).catch(console.error);
  }, []);

  const data: any[] = chartPeriod === 'week' ? initialWeeklyData : initialMonthlyData;
  const dataKey = 'minutes';
  const xKey = chartPeriod === 'week' ? 'day' : 'week';

  const totalThisWeek = progress?.totalMinutes || 0;
  const todayIndex = 1; // "Tue" is the current day in our mock data

  return (
    <motion.div
      className="w-full pt-10 pb-20 px-6 lg:px-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* PAGE HEADER */}
      <motion.div variants={fadeUp} className="mb-8">
        <p className="font-body text-xs text-text-secondary mb-1">Home / Progress</p>
        <h1 className="font-heading font-extrabold text-[32px] text-text-primary">Your Progress</h1>
        <p className="mt-1 font-body text-[15px] text-text-secondary">
          Track your mindfulness journey and celebrate growth 🌱
        </p>
      </motion.div>

      {/* TOP STAT BANNER */}
      <motion.div variants={fadeUp}>
        <Card variant="premium" className="relative p-6 md:p-8 overflow-hidden mb-8">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/5 blur-[50px] rounded-full animate-float" />
          <div className="absolute top-1/2 right-12 w-16 h-16 bg-white/5 blur-[30px] rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="font-body font-semibold text-[11px] text-white/60 uppercase tracking-[2px] mb-3">✦ This Week</div>
              <div className="font-heading font-extrabold text-[52px] text-white leading-none">
                {totalThisWeek}
                <span className="font-body font-normal text-xl text-white/60 ml-2">min</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ArrowUp size={14} className="text-accent-fresh" />
                <span className="font-body text-sm text-accent-fresh font-semibold">+18% vs last week</span>
              </div>
            </div>
            {/* Mini arc stats */}
            <div className="flex gap-6">
              <ArcStat value={user?.streak || 0} max={7} color="var(--accent-warm)" label="Day Streak" />
              <ArcStat value={progress?.sessionsDone || 0} max={9} color="var(--accent-calm)" label="Sessions" />
              <ArcStat value={totalThisWeek} max={420} color="var(--accent-fresh)" label="Min / Goal" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* QUICK STATS GRID */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Sessions Done', value: progress?.sessionsDone || 0, unit: '', icon: CheckCircle2, color: 'text-accent-fresh', bg: 'bg-accent-fresh/10', trend: 'this week' },
          { label: 'Mindful Minutes', value: totalThisWeek, unit: 'min', icon: Clock, color: 'text-brand-primary', bg: 'bg-brand-primary-pale', trend: 'Goal: 420 min' },
          { label: 'Focus Score', value: progress?.sessionsDone ? 100 : 0, unit: '%', icon: Target, color: 'text-accent-calm', bg: 'bg-accent-calm/10', trend: 'Just starting out' },
          { label: 'Wellness Points', value: progress?.totalPoints || 0, unit: 'pts', icon: Zap, color: 'text-accent-warm', bg: 'bg-accent-warm/10', trend: 'this week' },
        ].map(stat => (
          <Card key={stat.label} hoverable className="p-4">
            <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
              <stat.icon size={16} />
            </div>
            <div className={`font-heading font-bold text-2xl ${stat.color} leading-none`}>
              {stat.value}<span className="font-body font-normal text-xs text-text-secondary ml-1">{stat.unit}</span>
            </div>
            <div className="font-body font-medium text-[12px] text-text-primary mt-1">{stat.label}</div>
            <div className="font-body text-[11px] text-text-muted mt-0.5">{stat.trend}</div>
          </Card>
        ))}
      </motion.div>

      {/* CHART + CATEGORY BREAKDOWN */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Area / Bar Chart */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-lg text-text-primary">Mindful Minutes</h2>
              <p className="font-body text-xs text-text-secondary mt-0.5">Daily practice over time</p>
            </div>
            <div className="flex bg-bg-secondary rounded-lg p-0.5 gap-0.5">
              {(['week', 'month'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all z-10 relative
                    ${chartPeriod === p ? 'bg-card-light shadow-soft text-brand-primary' : 'text-text-secondary'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {chartPeriod === 'week' ? (
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: 'var(--border-med)' }} content={<CustomTooltip />} />
                <Area type="monotone" dataKey={dataKey} stroke="var(--brand-primary)" strokeWidth={2} fill="url(#gradArea)" dot={{ r: 4, fill: 'var(--brand-primary)', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar dataKey={dataKey} radius={[4, 4, 4, 4]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={i === todayIndex ? 'var(--brand-primary)' : 'var(--brand-primary-pale)'} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-5">
          <h2 className="font-heading font-bold text-[15px] text-text-primary mb-1">Session Types</h2>
          <p className="font-body text-xs text-text-secondary mb-5">This week's breakdown</p>
          <div className="flex flex-col gap-4">
            {categoryBreakdown.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-body font-medium text-[13px] text-text-primary">{cat.name}</span>
                  <span className="font-data text-xs font-medium" style={{ color: cat.color }}>{cat.value}%</span>
                </div>
                <div className="h-2 bg-border-med rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total mindful time pill */}
          <div className="mt-6 bg-bg-secondary rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white">
              <Medal size={16} />
            </div>
            <div>
              <div className="font-body font-semibold text-[12px] text-text-primary">{totalThisWeek} min total</div>
              <div className="font-body text-[11px] text-text-secondary">All time mindful minutes</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* STREAK CALENDAR + RECENT ACTIVITY */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Streak Calendar */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-[15px] text-text-primary">Streak Calendar</h2>
              <p className="font-body text-xs text-text-secondary mt-0.5">Last 4 weeks of practice</p>
            </div>
            <div className="flex items-center gap-2 bg-accent-warm/10 border border-accent-warm/20 rounded-xl px-3 py-1.5">
              <Flame size={14} className="text-accent-warm" fill="currentColor" />
              <span className="font-body font-semibold text-sm text-accent-warm">{user?.streak || 0}-day</span>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center font-body text-[10px] text-text-muted">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex flex-col gap-1.5">
            {STREAK_WEEKS.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((done, di) => (
                  <motion.div
                    key={di}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.02 }}
                    className={`h-7 rounded-md flex items-center justify-center
                      ${done ? 'bg-accent-warm shadow-[0_0_8px_rgba(244,162,97,0.3)]' : 'bg-border-light'}`}
                  >
                    {done && <div className="w-1.5 h-1.5 rounded-full bg-white/70" />}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 text-[11px] font-body text-text-muted">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-accent-warm" /> Practiced</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-border-light" /> Missed</div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-[15px] text-text-primary">Recent Sessions</h2>
            <button onClick={() => navigate('/sessions')} className="font-body text-xs text-brand-primary hover:underline">View All →</button>
          </div>
          <div className="flex flex-col gap-2">
            {progress?.recentSessions?.length ? progress.recentSessions.map((s: any, i: number) => (
              <div key={i} onClick={() => navigate('/sessions')} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-secondary transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-brand-primary-pale flex items-center justify-center text-lg flex-shrink-0">
                  🧘
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-body font-medium text-[13px] text-text-primary truncate">{s.title}</div>
                  <div className="font-body text-[11px] text-text-secondary mt-0.5">{s.duration}m · {new Date(s.completedAt).toLocaleDateString()}</div>
                </div>
                <div className="font-body font-semibold text-sm text-accent-warm flex-shrink-0">+{s.points} pts</div>
              </div>
            )) : (
              <div className="text-sm text-text-secondary">No recent sessions found. Start exploring!</div>
            )}
          </div>

          {/* Achievements teaser */}
          <div className="mt-5 bg-warm-card-gradient border border-border-med rounded-xl p-3 flex items-center gap-3">
            <div className="text-2xl">🏆</div>
            <div className="flex-1">
              <div className="font-body font-semibold text-[13px] text-text-primary">{progress?.sessionsDone > 0 ? '1' : '0'} Badges Earned</div>
              <div className="font-body text-[11px] text-text-secondary">Keep going to unlock more</div>
            </div>
            <button onClick={() => navigate('/profile')} className="text-brand-primary">
              <ChevronRight size={18} />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* WEEKLY GOAL CARD */}
      <motion.div variants={fadeUp}>
        <Card variant="warm" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white">
              <TrendingUp size={22} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[15px] text-text-primary">Weekly Goal Progress</h3>
              <p className="font-body text-xs text-text-secondary mt-0.5">
                {totalThisWeek} / 420 min — keep going, you've got this! 💪
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48 flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="font-body text-xs text-text-secondary">{Math.round(totalThisWeek / 420 * 100)}%</span>
              <span className="font-body text-xs text-brand-primary">Goal: 420 min</span>
            </div>
            <div className="h-2 bg-border-med rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-hero-gradient rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(totalThisWeek / 420 * 100, 100)}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Progress;
