import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // Auto-focus previous input on backspace if current is empty
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate PIN here. For now, just navigate.
    navigate('/home');
  };

  return (
    <div className="text-on-background min-h-screen font-body-md overflow-x-hidden antialiased bg-background relative selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center h-16 px-gutter transition-all duration-300 border-none shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-primary scale-105 duration-300" data-weight="fill">
            bolt
          </span>
          <div className="flex flex-col items-start">
            <h1 className="font-headline-md text-headline-md tracking-tighter text-primary leading-none m-0">QUANTUM</h1>
            <span className="font-label-sm text-[12px] text-on-surface-variant mt-1 uppercase tracking-widest">
              Unlock Your Potential
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex flex-col items-center justify-center min-h-screen px-margin-mobile md:px-margin-desktop pt-16 pb-24 md:pt-24 md:pb-32 relative z-10 w-full max-w-container-max mx-auto">
        {/* Central Soft White Card */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_rgba(67,82,165,0.08)] border border-outline-variant p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:shadow-[0_12px_48px_rgba(67,82,165,0.12)]">
          <div className="text-center mb-10">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 mt-0">
              Welcome Back
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant m-0">
              Enter your PIN to authenticate
            </p>
          </div>

          <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
            {/* Dedicated PIN Input Section */}
            <div className="space-y-4" id="pin-section">
              <div className="flex justify-between gap-2 sm:gap-3">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    className="w-full h-16 text-center text-2xl font-semibold bg-surface-container-lowest rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface transition-all duration-300"
                    maxLength={1}
                    pattern="[0-9]"
                    type={showPin ? "text" : "password"}
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-2">
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="flex items-center gap-1 font-label-sm text-[12px] text-on-surface-variant hover:text-on-surface transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  <span className="material-symbols-outlined text-[16px]">{showPin ? "visibility" : "visibility_off"}</span>
                  {showPin ? "Hide PIN" : "Show PIN"}
                </button>
                <a className="font-label-sm text-[12px] text-primary hover:text-primary-container transition-colors" href="#forgot">
                  Forgot PIN?
                </a>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-[#5b6bc0] font-headline-md text-[18px] text-on-primary flex items-center justify-center space-x-2 shadow-md hover:shadow-lg hover:opacity-95 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-container border-none cursor-pointer"
              type="submit"
            >
              <span>Authenticate</span>
              <span className="material-symbols-outlined">lock_open</span>
            </button>
          </form>

          {/* New User Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="font-label-sm text-[14px] text-primary hover:text-primary-container transition-colors font-semibold border-none bg-transparent cursor-pointer p-0"
            >
              New user? Create an account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
