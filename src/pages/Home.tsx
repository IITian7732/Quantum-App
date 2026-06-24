import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { quotes } from '../data/quotes';

export default function Home() {
  const navigate = useNavigate();
  const [quote, setQuote] = useState(quotes[0]);
  const [fade, setFade] = useState(false);
  const [userName, setUserName] = useState('John');
  const [profileImage, setProfileImage] = useState('/profile.webp');
  const [scrolled, setScrolled] = useState(false);
  const [quotesGenerated, setQuotesGenerated] = useState(0);
  const [showInsights, setShowInsights] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [favorites, setFavorites] = useState<{text: string, author: string}[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const isLiked = favorites.some(q => q.text === quote.text);
  const [toastMessage, setToastMessage] = useState('');
  
  const [totalWatched, setTotalWatched] = useState(0);
  const [totalActual, setTotalActual] = useState(0);
  const [activeSession, setActiveSession] = useState<{title: string, desc: string, time: string} | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const mindfulMinutes = Math.min(totalWatched, 60);
  const mindfulPercentage = (mindfulMinutes / 60) * 100;
  const focusScore = totalActual > 0 ? Math.round((totalWatched / totalActual) * 100) : 0;

  const toggleFavorite = () => {
    if (isLiked) {
      setFavorites(prev => prev.filter(q => q.text !== quote.text));
    } else {
      setFavorites(prev => [...prev, quote]);
      setToastMessage('Added to favorites!');
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem('quantum_user_data');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        if (userData.name) setUserName(userData.name.split(' ')[0]);
        if (userData.profileImage) setProfileImage(userData.profileImage);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerateQuote = () => {
    setFade(true);
    setTimeout(() => {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(newQuote);
      setQuotesGenerated(prev => prev + 1);
      setFade(false);
    }, 300);
  };

  const maxQuotesForRed = 10;
  const ratio = Math.min(quotesGenerated / maxQuotesForRed, 1);
  const r = Math.round(67 + (186 - 67) * ratio);
  const g = Math.round(82 + (26 - 82) * ratio);
  const b = Math.round(165 + (26 - 165) * ratio);
  const streakColor = `rgb(${r}, ${g}, ${b})`;
  const streakBgColor = `rgba(${r}, ${g}, ${b}, 0.1)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    setToastMessage('Quote copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quantum Quote',
          text: `"${quote.text}" - ${quote.author}`,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setToastMessage('Failed to share.');
        }
      }
    } else {
      handleCopy();
      setToastMessage('Quote copied! (Sharing not supported)');
    }
  };

  return (
    <div className="font-body-md text-body-md min-h-screen bg-background text-on-surface transition-colors duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full text-sm font-semibold shadow-xl z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* TopAppBar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-surface/95 shadow-md' : 'bg-surface/80 backdrop-blur-xl shadow-sm'}`}>
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max-width mx-auto">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/logo.png" alt="Quantum Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            <div className="flex flex-col">
              <h1 className="font-h3 text-h3 font-bold tracking-tight text-primary m-0 leading-none">Quantum</h1>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mt-0.5">Mindset Companion</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="material-symbols-outlined p-2 rounded-full hover:bg-surface-variant transition-colors bg-transparent border-none cursor-pointer" 
                data-icon="notifications"
              >
                notifications
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 top-12 mt-2 w-72 glass-card rounded-xl p-4 shadow-xl z-50 bg-surface/95 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="font-h3 text-h3 text-on-surface m-0 mb-3 border-b border-outline-variant/20 pb-2">Notifications</h4>
                    <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">notifications_paused</span>
                      <p className="text-body-md text-on-surface-variant m-0">You're all caught up!</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed block hover:opacity-80 transition-opacity p-0 bg-transparent cursor-pointer"
            >
              <img className="w-full h-full object-cover" alt="User Profile" src={profileImage} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-24 md:pt-24 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto space-y-10 md:space-y-16">
        {/* Hero Greeting & Streak Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-7 space-y-4">
            <h2 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-surface m-0">Good morning, {userName}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl m-0">
              Take a deep breath. Your journey toward clarity continues today. Ready for your morning session?
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-h3 text-body-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all border-none cursor-pointer"
              >
                <span className="material-symbols-outlined" data-icon="play_circle" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                Take a Session
              </button>
              <button 
                onClick={() => setShowInsights(true)}
                className="bg-secondary-container/50 text-on-secondary-container px-8 py-4 rounded-xl font-h3 text-body-md flex items-center gap-2 hover:bg-secondary-container transition-all border-none cursor-pointer"
              >
                <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
                View Insights
              </button>
            </div>
          </div>
          
          {/* Streak Card (Bento Style) */}
          <div className="md:col-span-5">
            <div 
              className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4 group transition-colors duration-500" 
              style={{ borderColor: streakBgColor }}
            >
              <div 
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl transition-colors duration-500" 
                style={{ backgroundColor: streakBgColor }}
              ></div>
              <div className="relative">
                <span 
                  className="material-symbols-outlined text-6xl streak-pulse group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" 
                  data-icon="local_fire_department" 
                  style={{ fontVariationSettings: "'FILL' 1", color: streakColor }}
                >
                  local_fire_department
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-h2 text-h2 m-0 transition-colors duration-500" style={{ color: streakColor }}>
                  {quotesGenerated} Quotes Generated
                </h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest m-0">Consistency is Mastery</p>
              </div>
              <div className="flex gap-2 mt-4">
                {Array.from({length: 7}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-500 ${quotesGenerated > i ? 'text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`} 
                    style={quotesGenerated > i ? { backgroundColor: streakColor, boxShadow: `0 2px 4px ${streakBgColor}` } : {}}
                  >
                    {i + 1}
                  </div>
                ))}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-500 ${quotesGenerated > 7 ? 'text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`} 
                  style={quotesGenerated > 7 ? { backgroundColor: streakColor, boxShadow: `0 2px 4px ${streakBgColor}` } : {}}
                >
                  7+
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Insights section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Daily Summary */}
          <div className="md:col-span-1 glass-card p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 mt-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-h3 text-h3 text-on-surface m-0">Progress</h3>
                  <button 
                    onClick={() => setShowInfoModal(true)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl bg-transparent border-none cursor-pointer p-0"
                    title="What is this?"
                  >
                    info
                  </button>
                </div>
                <div className="text-on-surface-variant text-xs font-bold uppercase tracking-widest bg-surface-variant px-3 py-1 rounded-full">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">MINDFUL MINUTES</span>
                    <span className="font-h3 text-primary text-xl">{mindfulMinutes} / 60</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${mindfulPercentage}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">FOCUS SCORE</span>
                    <span className="font-h3 text-secondary text-xl">{focusScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${focusScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex-1 flex flex-col items-center justify-center border-t border-outline-variant/20 pt-6">
              <span className="font-h3 text-h3 text-on-surface-variant/50 uppercase tracking-widest">
                Know YourSelf
              </span>
            </div>
          </div>

          {/* Interactive Daily Insight Section */}
          <div className="md:col-span-2 glass-card p-6 md:p-10 rounded-2xl bg-surface-container-lowest flex flex-col justify-between overflow-hidden relative group bg-white/90">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none"></div>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-label-caps text-primary px-3 py-1 bg-primary/5 rounded-full uppercase tracking-wider">Daily Insight</span>
                <button 
                  onClick={toggleFavorite}
                  className={`transition-colors p-2 rounded-full bg-transparent border-none cursor-pointer ${isLiked ? 'text-error hover:bg-error/10' : 'text-on-surface-variant hover:text-error hover:bg-error/5'}`} 
                  title="Favorite"
                >
                  <span className="material-symbols-outlined" data-icon="favorite" style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}>favorite</span>
                </button>
              </div>
              <div className="space-y-6">
                <span className="material-symbols-outlined text-primary/20 text-5xl block" data-weight="fill">format_quote</span>
                <p 
                  className={`font-h3 text-h3 md:text-[28px] text-on-surface leading-relaxed text-balance transition-opacity duration-300 m-0 ${fade ? 'opacity-0' : 'opacity-100'}`}
                >
                  "{quote.text}"
                </p>
                <div className={`flex items-center gap-3 transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="w-10 h-[1px] bg-outline-variant"></span>
                  <span className="font-author-accent text-author-accent text-on-surface-variant tracking-wider uppercase">{quote.author}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 relative z-10 flex flex-wrap gap-4 items-center">
              <button 
                onClick={handleGenerateQuote}
                className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-body-md font-semibold shadow-md hover:shadow-lg hover:opacity-95 active:scale-95 transition-all duration-300 border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl" data-icon="refresh">refresh</span>
                Generate Quote
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-4 rounded-full border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant hover:text-on-surface transition-colors active:scale-95 cursor-pointer" 
                  title="Copy"
                >
                  <span className="material-symbols-outlined" data-icon="content_copy">content_copy</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 rounded-full border border-outline-variant text-on-surface-variant bg-surface-container-lowest hover:bg-surface-variant hover:text-on-surface transition-colors active:scale-95 cursor-pointer" 
                  title="Share"
                >
                  <span className="material-symbols-outlined" data-icon="ios_share">ios_share</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Tracks */}
        <section id="explore" className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-h2 text-h2 text-on-surface m-0">Curated for You</h3>
            <a className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all no-underline" href="#explore">
              Explore All <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {[
              {
                title: "Morning Clarity",
                desc: "Guided meditation for focus",
                time: "12m",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqhVvS2DQcqaiL-9zWtlLO_4M8wXpKk1basrYbfThtSLexzWOlSQRJbdU2UwCWab5-wi2_f_FY_1zoy5mrPO8MtenMLQGFasDZOVAtP3kra3ICwnkLKIscQuvPCOhamlYxWwih90zvSD496GYyURbWwCyYYP1b_5V2AsAGdzoaCdKoZE_qD-6sNE-Iou9oTNFpEtH_2AKaZed_7ssUj_PsOn77bn7xoC1Wrsk5lN6jJSGR-AEfbEmn5cdm8Xdqh85yF7mnJdkFAv33"
              },
              {
                title: "Deep Focus Flow",
                desc: "Ambient soundscape for work",
                time: "20m",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYSMzTq0yqzQ17_6Et0l0roXCE0tqH9lo-dd_vbPSsyLmSp7wxrfyTvlwS688IO0_kCNe67rQzEQpdYY0nmZsQBTGIFfxTVWF11mXf4DOn1A4JIOhJ7nYRMFdvCXR-nrkz5Rpb-h4ZagAcBwC4G4pHcFC6LWUE5aQ1eJjCvLtf2NL1ZavOao5VfWt-m1AQjLxdwE5zq-EjBv9bc3lsw_zIyTfWzCq3jA9EgpRYUn3motXlLGmAt7aUuG1LC1XXBDegwUg7ae1DXXOW"
              },
              {
                title: "Stress Release",
                desc: "Breathing techniques for calm",
                time: "15m",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLs-RzEGJW9Ervw2S25eTa6U5lN-Sr-lkgUCg1_yo_KJrRCfs_VmTdjZEGvUbcb8wBbhFj8f_R_HU-Kc6V6zO8fjm0NeK-Ry-A7vDfddGhRajNSmQZP2Xnsw8_GxfwSlOxdEDdqGzh_M0U6TuadT90LTLyJ4pzbX1bynRpg9fN49IEwd6JZD7RPG8tI_Z94130G48QIuM9ecUpA64oaKJnXzhHYgthgTXtj65pXgUkSRA-wpHLBzPtuCKhubilGm9YHctzZzIqRZTm"
              },
              {
                title: "Power Reset",
                desc: "Short break to recharge mind",
                time: "8m",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBh-7tp8TmLD9gMY_gfpinAciglqtaAFiwq9C4n3vr_u2BGlsHzbb6ac_eXlES_3S_rCstUGIkB79Qd0ingfxCazoutFLz_Q1F9VOuKyjHFqeF0K_6uPEaROW8xKSHAjKj5Izzp5eg4tvqqQ8GZVEdOBL6OY3tckTSh42VbllOc0UHEhX7XHnNTokd3ewazAm8yxqdwkkWo6YsyD8YCRm0udiwHTXGeL6xjLZ-xf630dXfdcA-P0h9nSMv59Lbb55n8O-ogLLsiWpAm"
              }
            ].map((track, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => setActiveSession(track)}>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={track.title} src={track.img} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs" data-icon="schedule">schedule</span>
                    <span className="text-[10px] font-bold">{track.time}</span>
                  </div>
                </div>
                <h4 className="font-h3 text-[18px] text-on-surface m-0">{track.title}</h4>
                <p className="text-on-surface-variant font-body-sm m-0 mt-1">{track.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_-4px_20px_rgba(67,82,165,0.05)] transition-all duration-300 border-none">
        <div className="flex justify-around items-center py-3 px-4">
          <button className="flex flex-col items-center justify-center bg-primary-container/20 text-primary rounded-xl px-6 py-2 active:scale-95 transition-all duration-200 border-none cursor-pointer">
            <span className="material-symbols-outlined" data-icon="home" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="font-label-caps text-label-caps mt-1">Home</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center justify-center text-on-surface-variant/70 px-6 py-2 hover:bg-secondary-container/30 rounded-xl active:scale-95 transition-all duration-200 border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined" data-icon="person">person</span>
            <span className="font-label-caps text-label-caps mt-1">Profile</span>
          </button>
        </div>
      </nav>

      {/* Desktop Side Nav */}
      <div className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-20 flex-col items-center py-8 gap-8 bg-surface/40 backdrop-blur-sm z-40 border-r border-outline-variant/10">
        <button className="w-12 h-12 flex items-center justify-center text-primary bg-primary-container/20 rounded-xl border-none cursor-pointer" title="Home">
          <span className="material-symbols-outlined" data-icon="home" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        </button>
        <button 
          onClick={() => setShowInsights(true)}
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border-none bg-transparent cursor-pointer" 
          title="Insights"
        >
          <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
        </button>
        <button 
          onClick={() => setShowFavorites(true)}
          className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border-none bg-transparent cursor-pointer" 
          title="Favorites"
        >
          <span className="material-symbols-outlined" data-icon="favorite">favorite</span>
        </button>
        <div className="mt-auto pb-8">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border-none bg-transparent cursor-pointer" 
            title="Settings"
          >
            <span className="material-symbols-outlined" data-icon="settings">settings</span>
          </button>
        </div>
      </div>

      {/* Insights Modal */}
      {showInsights && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowInsights(false)}></div>
          <div className="relative w-full max-w-3xl glass-card rounded-2xl p-4 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] bg-surface/95 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-secondary">analytics</span>
                <h2 className="font-h2 text-h2 m-0 text-on-surface">Your Insights</h2>
              </div>
              <button 
                onClick={() => setShowInsights(false)}
                className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2 m-0">AVERAGE FOCUS</h4>
                  <p className="font-h1 text-4xl text-secondary m-0">0%</p>
                  <p className="text-body-sm text-on-surface-variant mt-2 m-0 flex items-center gap-1">
                    No data yet
                  </p>
                </div>
                <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
                  <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-2 m-0">TOTAL TIME MEDITATED</h4>
                  <p className="font-h1 text-4xl text-primary m-0">0h 0m</p>
                  <p className="text-body-sm text-on-surface-variant mt-2 m-0">Start a session to begin</p>
                </div>
              </div>

              {/* Mock Bar Chart */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
                <h3 className="font-h3 text-h3 text-on-surface mb-6 m-0">Weekly Activity</h3>
                <div className="flex items-end justify-between h-40 gap-2 sm:gap-4 pt-4 border-b border-outline-variant/20 pb-2">
                  {[0, 0, 0, 0, 0, 0, 0].map((height, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-2 group h-full">
                      <div className="w-full relative h-full flex items-end justify-center">
                        <div 
                          className="w-full max-w-[40px] bg-primary/30 group-hover:bg-primary/60 rounded-t-md transition-all duration-300 relative"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-variant text-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-sm">
                            {height}m
                          </div>
                        </div>
                      </div>
                      <span className="text-label-caps font-label-caps text-on-surface-variant">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Simulation Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveSession(null)}></div>
          <div className="relative w-full max-w-md glass-card rounded-2xl p-6 md:p-8 text-center shadow-2xl bg-surface/95 animate-in fade-in zoom-in duration-300">
            <span className="material-symbols-outlined text-6xl text-primary mb-4" data-icon="self_improvement">self_improvement</span>
            <h2 className="font-h2 text-h2 m-0 text-on-surface mb-2">{activeSession.title}</h2>
            <p className="text-body-md text-on-surface-variant m-0 mb-8">A {activeSession.time} guided session</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  const mins = parseInt(activeSession.time);
                  setTotalWatched(prev => prev + mins);
                  setTotalActual(prev => prev + mins);
                  setToastMessage(`Session completed! +${mins} mindful mins`);
                  setActiveSession(null);
                }}
                className="bg-primary text-on-primary px-6 py-4 rounded-xl font-h3 text-body-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all border-none cursor-pointer w-full"
              >
                <span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
                Complete Full Session
              </button>
              
              <button 
                onClick={() => {
                  const mins = parseInt(activeSession.time);
                  const watched = Math.max(1, Math.floor(mins / 3));
                  setTotalWatched(prev => prev + watched);
                  setTotalActual(prev => prev + mins);
                  setToastMessage(`Session ended early. +${watched} mindful mins`);
                  setActiveSession(null);
                }}
                className="bg-secondary-container/50 text-on-secondary-container px-6 py-4 rounded-xl font-h3 text-body-md flex items-center justify-center gap-2 hover:bg-secondary-container transition-all border-none cursor-pointer w-full"
              >
                <span className="material-symbols-outlined" data-icon="exit_to_app">exit_to_app</span>
                Leave Early
              </button>

              <button 
                onClick={() => setActiveSession(null)}
                className="text-on-surface-variant px-6 py-3 rounded-xl font-body-sm hover:underline transition-all border-none bg-transparent cursor-pointer w-full mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowInfoModal(false)}></div>
          <div className="relative w-full max-w-md glass-card rounded-2xl p-5 sm:p-8 shadow-2xl bg-surface/95 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-primary" data-icon="info">info</span>
                <h2 className="font-h2 text-h2 m-0 text-on-surface">Your Progress</h2>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <h4 className="font-h3 text-h3 text-primary m-0 mb-2">Mindful Minutes</h4>
                <p className="text-body-sm text-on-surface-variant m-0 leading-relaxed">
                  The total number of minutes you have actively watched or listened to sessions. The progress bar shows your progress towards a daily goal of 60 minutes.
                </p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <h4 className="font-h3 text-h3 text-secondary m-0 mb-2">Focus Score</h4>
                <p className="text-body-sm text-on-surface-variant m-0 leading-relaxed">
                  Your focus score is calculated based on how much of a session you complete. It's the ratio of your watched time to the actual session length. Higher completion rates mean higher focus scores!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowFavorites(false)}></div>
          <div className="relative w-full max-w-2xl glass-card rounded-2xl p-4 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] bg-surface/95 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-primary" data-icon="favorite" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                <h2 className="font-h2 text-h2 m-0 text-on-surface">Your Favorites</h2>
              </div>
              <button 
                onClick={() => setShowFavorites(false)}
                className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {favorites.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl mb-4 opacity-50">heart_broken</span>
                  <p className="font-h3 text-h3 m-0">No favorites yet</p>
                  <p className="text-body-sm m-0 mt-2">Tap the heart icon on any quote to save it here.</p>
                </div>
              ) : (
                favorites.map((fav, index) => (
                  <div key={index} className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex justify-between items-start gap-4 hover:border-primary/30 transition-colors">
                    <div>
                      <p className="font-body-md text-on-surface leading-relaxed m-0 italic">"{fav.text}"</p>
                      <p className="font-author-accent text-author-accent text-primary mt-3 m-0 uppercase tracking-wider">{fav.author}</p>
                    </div>
                    <button 
                      onClick={() => setFavorites(prev => prev.filter(q => q.text !== fav.text))}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors border-none bg-transparent cursor-pointer shrink-0"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowSettings(false)}></div>
          <div className="relative w-full max-w-2xl glass-card rounded-2xl p-4 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] bg-surface/95 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl text-primary">settings</span>
                <h2 className="font-h2 text-h2 m-0 text-on-surface">App Settings</h2>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Setting Items */}
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
                  <div>
                    <h4 className="font-h3 text-h3 text-on-surface m-0 text-lg">Dark Mode</h4>
                    <p className="text-body-sm text-on-surface-variant m-0">Toggle dark appearance</p>
                  </div>
                </div>
                <div 
                  className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${isDarkMode ? 'bg-primary' : 'bg-surface-variant'}`}
                  onClick={toggleDarkMode}
                >
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
                  <div>
                    <h4 className="font-h3 text-h3 text-on-surface m-0 text-lg">Daily Reminders</h4>
                    <p className="text-body-sm text-on-surface-variant m-0">Get notified for daily sessions</p>
                  </div>
                </div>
                <div 
                  className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${dailyReminders ? 'bg-primary' : 'bg-surface-variant'}`}
                  onClick={() => setDailyReminders(!dailyReminders)}
                >
                  <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${dailyReminders ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">language</span>
                  <div>
                    <h4 className="font-h3 text-h3 text-on-surface m-0 text-lg">Language</h4>
                    <p className="text-body-sm text-on-surface-variant m-0">English (US)</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
