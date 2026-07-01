import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Search, BookOpen, Zap, Wind, SlidersHorizontal,
  Trash2, Copy, Share, Quote, Star, MoreHorizontal
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { api } from '../lib/api';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp: any = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } }
};

/* ── Mock data ────────────────────────────────────────────────────────────── */
type Collection = 'all' | 'motivation' | 'mindfulness' | 'focus' | 'morning';

interface SavedQuote {
  id: number;
  text: string;
  author: string;
  collection: Exclude<Collection, 'all'>;
  savedOn: string;
  starred: boolean;
}

const INITIAL_QUOTES: SavedQuote[] = [];

const COLLECTION_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  all:          { label: 'All Saved',   icon: Heart,     color: 'text-brand-primary',  bg: 'bg-brand-primary-pale' },
  motivation:   { label: 'Motivation',  icon: Zap,       color: 'text-accent-warm',    bg: 'bg-accent-warm/10' },
  mindfulness:  { label: 'Mindfulness', icon: Wind,      color: 'text-accent-calm',    bg: 'bg-accent-calm/10' },
  focus:        { label: 'Focus',       icon: BookOpen,  color: 'text-brand-primary',  bg: 'bg-brand-primary-pale' },
  morning:      { label: 'Morning',     icon: Star,      color: 'text-accent-fresh',   bg: 'bg-accent-fresh/10' },
};

const SORT_OPTIONS = ['Newest', 'Starred', 'Author'] as const;
type SortOption = typeof SORT_OPTIONS[number];

/* ── Component ────────────────────────────────────────────────────────────── */
const Saved: React.FC = () => {
  const [quotes, setQuotes] = useState<SavedQuote[]>(INITIAL_QUOTES);
  const [activeCol, setActiveCol] = useState<Collection>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('Newest');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    api.getQuotes().then(data => {
      // map backend schema if needed
      setQuotes(data.map((q: any) => ({
        id: q.id,
        text: q.text,
        author: q.author,
        collection: q.category || 'motivation',
        savedOn: new Date(q.saved_at).toLocaleDateString(),
        starred: Boolean(q.is_starred)
      })));
    }).catch(console.error);
  }, []);

  /* derived list */
  let visible = quotes.filter(q => {
    const matchCol = activeCol === 'all' || q.collection === activeCol;
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase()) ||
                        q.author.toLowerCase().includes(search.toLowerCase());
    return matchCol && matchSearch;
  });
  if (sort === 'Starred') visible = [...visible].sort((a, b) => Number(b.starred) - Number(a.starred));
  if (sort === 'Author')  visible = [...visible].sort((a, b) => a.author.localeCompare(b.author));

  const toggleStar  = (id: number) => setQuotes(qs => qs.map(q => q.id === id ? { ...q, starred: !q.starred } : q));
  const removeQuote = (id: number) => { setQuotes(qs => qs.filter(q => q.id !== id)); setOpenMenu(null); };

  const copyQuote = (q: SavedQuote) => {
    navigator.clipboard.writeText(`"${q.text}" — ${q.author}`).catch(() => {});
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const collectionCounts = (col: Collection) =>
    col === 'all' ? quotes.length : quotes.filter(q => q.collection === col).length;

  return (
    <motion.div
      className="w-full pt-10 pb-20 px-6 lg:px-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      onClick={() => setOpenMenu(null)}
    >
      {/* PAGE HEADER */}
      <motion.div variants={fadeUp} className="mb-8">
        <p className="font-body text-xs text-text-secondary mb-1">Home / Saved</p>
        <h1 className="font-heading font-extrabold text-[32px] text-text-primary">Saved Quotes</h1>
        <p className="mt-1 font-body text-[15px] text-text-secondary">
          {quotes.length} quotes across {Object.keys(COLLECTION_META).length - 1} collections 📚
        </p>
      </motion.div>

      {/* HERO QUOTE HIGHLIGHT */}
      <motion.div variants={fadeUp} className="mb-8">
        <Card variant="premium" className="relative p-7 md:p-9 overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/5 blur-[50px] rounded-full animate-float" />
          <div className="absolute top-4 right-6 font-accent font-bold text-[120px] text-white/5 leading-none pointer-events-none select-none">"</div>
          <div className="relative z-10 max-w-2xl">
            <div className="font-body text-[11px] font-semibold text-white/60 uppercase tracking-[2px] mb-4">✦ Quote of the Day</div>
            <p className="font-accent font-bold italic text-xl md:text-2xl text-white leading-[1.65]">
              "{quotes.find(q => q.starred)?.text ?? 'Your daily dose of inspiration will appear here when you save a quote.'}"
            </p>
            <div className="w-5 h-[1px] bg-white/40 mt-5 mb-4" />
            <div className="font-body text-[13px] text-white/60">
              — {quotes.find(q => q.starred)?.author ?? 'Quantum Mindset'}
            </div>
            <div className="mt-5 flex gap-2">
              <button className="h-8 px-4 rounded-full border border-white/30 text-white font-body font-semibold text-xs hover:bg-white/10 transition-colors flex items-center gap-1.5">
                <Copy size={12} /> Copy
              </button>
              <button className="h-8 px-4 rounded-full border border-white/30 text-white font-body font-semibold text-xs hover:bg-white/10 transition-colors flex items-center gap-1.5">
                <Share size={12} /> Share
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* COLLECTIONS ROW */}
      <motion.div variants={fadeUp} className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {(Object.keys(COLLECTION_META) as Collection[]).map(col => {
          const m = COLLECTION_META[col];
          const active = activeCol === col;
          return (
            <button
              key={col}
              onClick={() => setActiveCol(col)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border font-body font-medium text-sm transition-all duration-150
                ${active
                  ? 'bg-hero-gradient text-white border-transparent shadow-soft'
                  : `bg-white border-border-light ${m.color} hover:border-brand-primary`}`}
            >
              <m.icon size={14} />
              {m.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                ${active ? 'bg-white/20 text-white' : `${m.bg} ${m.color}`}`}>
                {collectionCounts(col)}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* SEARCH + SORT BAR */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-7">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search quotes or authors…"
            className="w-full h-10 pl-9 pr-4 bg-white border border-border-light rounded-xl font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-border-light rounded-xl px-3 h-10">
          <SlidersHorizontal size={14} className="text-text-muted" />
          {SORT_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-2.5 py-1 rounded-lg font-body text-xs font-medium transition-all
                ${sort === s ? 'bg-brand-primary-pale text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* QUOTES GRID */}
      <AnimatePresence mode="wait">
        {visible.length > 0 ? (
          <motion.div
            key={activeCol + search + sort}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {visible.map(q => {
              const colMeta = COLLECTION_META[q.collection];
              return (
                <motion.div key={q.id} variants={fadeUp} className="break-inside-avoid">
                  <Card hoverable className="p-5 flex flex-col gap-3 group relative">
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-md ${colMeta.bg} ${colMeta.color}`}>
                        {colMeta.label.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        {/* Star */}
                        <button
                          onClick={e => { e.stopPropagation(); toggleStar(q.id); }}
                          className="p-1 rounded hover:bg-border-light transition-colors"
                        >
                          <Star
                            size={14}
                            className={q.starred ? 'text-accent-warm fill-accent-warm' : 'text-text-muted'}
                          />
                        </button>
                        {/* More menu */}
                        <div className="relative">
                          <button
                            onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === q.id ? null : q.id); }}
                            className="p-1 rounded hover:bg-border-light transition-colors text-text-muted hover:text-text-primary"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          <AnimatePresence>
                            {openMenu === q.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                transition={{ duration: 0.15 }}
                                onClick={e => e.stopPropagation()}
                                className="absolute right-0 top-8 bg-white border border-border-light rounded-xl shadow-medium z-20 w-36 py-1 overflow-hidden"
                              >
                                <button
                                  onClick={() => copyQuote(q)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-body text-text-primary hover:bg-bg-secondary transition-colors"
                                >
                                  <Copy size={12} />
                                  {copiedId === q.id ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-body text-text-primary hover:bg-bg-secondary transition-colors"
                                >
                                  <Share size={12} /> Share
                                </button>
                                <div className="h-px bg-border-light mx-3 my-1" />
                                <button
                                  onClick={() => removeQuote(q.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-body text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={12} /> Remove
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Quote text */}
                    <div className="relative pl-3 border-l-2 border-brand-primary-pale">
                      <Quote size={14} className="absolute -top-0.5 -left-0.5 text-brand-primary-pale rotate-180" />
                      <p className="font-accent italic text-[15px] text-text-primary leading-relaxed">
                        "{q.text}"
                      </p>
                    </div>

                    {/* Author + date */}
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-body text-[12px] text-text-secondary">— {q.author}</span>
                      <span className="font-body text-[10px] text-text-muted">{q.savedOn}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-border-light flex items-center justify-center text-3xl mb-4">🔖</div>
            <h3 className="font-heading font-bold text-lg text-text-primary">Nothing saved yet</h3>
            <p className="font-body text-sm text-text-secondary mt-1 max-w-xs">
              {search ? 'No quotes match your search.' : "Save quotes from your daily sessions and they'll appear here."}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-4 font-body text-sm text-brand-primary hover:underline">
                Clear search
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Saved;
