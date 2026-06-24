import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [pinProtection, setPinProtection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [profileImage, setProfileImage] = useState('/profile.webp');
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('quantum_user_data');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        if (userData.name) setName(userData.name);
        if (userData.email) setEmail(userData.email);
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

  return (
    <div className="font-body-md text-body-md min-h-screen bg-background text-on-surface transition-colors duration-300">
      {/* TopAppBar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 h-16 ${scrolled ? 'bg-surface/95 shadow-md' : 'bg-surface/80 backdrop-blur-xl shadow-sm'}`}>
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max-width mx-auto">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/home')}
          >
            <img src="/logo.png" alt="Quantum Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            <div className="flex flex-col">
              <h1 className="font-h3 text-h3 font-bold tracking-tight text-primary m-0 leading-none">Quantum</h1>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mt-0.5">Mindset Companion</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('/home')} className="text-on-surface-variant hover:opacity-80 transition-opacity font-label-caps text-label-caps border-none bg-transparent cursor-pointer">Home</button>
              <button className="text-primary font-label-caps text-label-caps font-bold border-none bg-transparent cursor-pointer">Profile</button>
            </nav>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
              <img alt="User Profile" className="w-full h-full object-cover" src={profileImage} />
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Side Nav */}
      <div className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-20 flex-col items-center py-8 gap-8 bg-surface/40 backdrop-blur-sm z-40 border-r border-outline-variant/10">
        <button onClick={() => navigate('/home')} className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border-none bg-transparent cursor-pointer" title="Home">
          <span className="material-symbols-outlined" data-icon="home">home</span>
        </button>
        <button onClick={() => navigate('/home')} className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border-none bg-transparent cursor-pointer" title="Insights">
          <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
        </button>
        <button onClick={() => navigate('/home')} className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border-none bg-transparent cursor-pointer" title="Favorites">
          <span className="material-symbols-outlined" data-icon="favorite">favorite</span>
        </button>
        <button onClick={() => navigate('/home')} className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant rounded-xl transition-colors border-none bg-transparent cursor-pointer mt-auto" title="Settings">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
        </button>
      </div>

      <main className="pt-24 pb-24 md:pt-32 md:pb-32 px-margin-mobile md:pl-[calc(theme(spacing.margin-desktop)+80px)] md:pr-margin-desktop max-w-container-max-width mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Left Column: User Identity */}
          <section className="md:col-span-4 flex flex-col gap-8">
            <div className="glass-card rounded-xl p-6 md:p-8 text-center flex flex-col items-center relative">
              {toastMessage && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-surface-variant text-on-surface px-4 py-2 rounded-full text-sm font-semibold shadow-md z-50 transition-opacity">
                  {toastMessage}
                </div>
              )}
              <div className="relative w-32 h-32 mb-6">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          const newImg = event.target.result as string;
                          setProfileImage(newImg);
                          const stored = localStorage.getItem('quantum_user_data');
                          let userData = stored ? JSON.parse(stored) : {};
                          userData.profileImage = newImg;
                          localStorage.setItem('quantum_user_data', JSON.stringify(userData));
                          setToastMessage('Profile image updated');
                          setTimeout(() => setToastMessage(''), 3000);
                        }
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
                <img alt={name} className="w-full h-full rounded-full object-cover shadow-lg" src={profileImage} />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-md hover:scale-105 transition-transform border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
              
              {isEditing ? (
                <div className="w-full flex flex-col gap-3 mb-6">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface"
                  />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface"
                  />
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      const stored = localStorage.getItem('quantum_user_data');
                      let userData = stored ? JSON.parse(stored) : {};
                      userData.name = name;
                      userData.email = email;
                      localStorage.setItem('quantum_user_data', JSON.stringify(userData));
                      setToastMessage('Profile updated');
                      setTimeout(() => setToastMessage(''), 3000);
                    }} 
                    className="w-full py-2 bg-primary text-on-primary rounded-xl font-semibold border-none cursor-pointer hover:opacity-90"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-h2 text-h2 text-on-surface m-0">{name}</h2>
                  <p className="text-on-surface-variant mb-6 m-0 mt-1">{email}</p>
                </>
              )}
              
              <div className="w-full flex flex-col gap-3">
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 px-6 bg-primary text-on-primary rounded-xl font-body-md font-semibold hover:opacity-90 transition-all border-none cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setToastMessage('Profile link copied!');
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                  className="w-full py-3 px-6 bg-secondary-container/30 text-on-secondary-container rounded-xl font-body-md font-semibold hover:bg-secondary-container/50 transition-all border-none cursor-pointer"
                >
                  Share Profile
                </button>
              </div>
            </div>

            {/* Settings / PIN Management */}
            <div className="glass-card rounded-xl p-6 md:p-8 flex flex-col gap-6">
              <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-3 m-0">
                <span className="material-symbols-outlined text-primary">security</span>
                Security
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-surface-container-low">
                  <div className="flex flex-col">
                    <span className="font-body-md font-semibold text-on-surface">PIN Protection</span>
                    <span className="text-body-sm text-on-surface-variant">Secure your private quotes</span>
                  </div>
                  <div 
                    onClick={() => setPinProtection(!pinProtection)}
                    className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${pinProtection ? 'bg-primary' : 'bg-primary/20'}`}
                  >
                    <div 
                      className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${pinProtection ? 'translate-x-6' : 'translate-x-0'}`}
                    ></div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const newPin = window.prompt("Enter new 4-digit PIN");
                    if (newPin && newPin.length === 4) {
                      setToastMessage('Security PIN updated');
                      setTimeout(() => setToastMessage(''), 3000);
                    }
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all bg-transparent cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">lock_reset</span>
                    <span className="font-body-md text-on-surface">Change Security PIN</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to sign out?")) {
                      navigate('/signin');
                    }
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-lg border border-error/20 text-error hover:bg-error/5 transition-all bg-transparent cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">logout</span>
                    <span className="font-body-md font-semibold">Sign Out</span>
                  </div>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {/* Right Column: Quotes & Activity */}
          <section className="md:col-span-8 flex flex-col gap-gutter">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
              <div className="glass-card p-4 md:p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="font-h2 text-h2 text-primary">0</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">SAVED QUOTES</span>
              </div>
              <div className="glass-card p-4 md:p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="font-h2 text-h2 text-primary">0</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">COLLECTIONS</span>
              </div>
              <div className="glass-card p-4 md:p-6 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="font-h2 text-h2 text-primary">0</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant">POINTS</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl shadow-lg flex justify-around items-center py-3 px-4 z-50">
        <button 
          onClick={() => navigate('/home')}
          className="flex flex-col items-center justify-center text-on-surface-variant/70 px-6 py-2 hover:bg-secondary-container/30 rounded-xl active:scale-95 transition-all duration-200 border-none bg-transparent cursor-pointer"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-label-caps mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-primary-container/20 text-primary rounded-xl px-6 py-2 active:scale-95 transition-all duration-200 border-none cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-label-caps text-label-caps mt-1 font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
}
