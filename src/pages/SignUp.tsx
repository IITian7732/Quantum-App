import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

export default function SignUp() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [profileImage, setProfileImage] = useState('/profile.webp');
  const [showPin, setShowPin] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store in localStorage
    const userData = {
      name: name || 'John Doe',
      email: email || 'john@example.com',
      phone,
      pin,
      profileImage
    };
    localStorage.setItem('quantum_user_data', JSON.stringify(userData));
    
    navigate('/home');
  };

  return (
    <div className="antialiased min-h-screen flex flex-col items-center justify-center relative font-sora text-ethereal-text pb-24 md:pb-0 bg-ethereal-bg">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full bg-transparent flex items-center justify-center h-16 px-gutter z-50">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-brand-primary scale-105 duration-300">blur_on</span>
          <span className="font-headline-md text-headline-md tracking-tighter text-brand-primary m-0">QUANTUM</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-md px-margin-mobile md:px-0 pt-16 pb-6 md:pt-20 md:pb-8 flex-grow flex flex-col justify-center relative z-10">
        {/* Registration Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_32px_rgba(67,82,165,0.08)] border border-gray-100 w-full p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ethereal-text mb-2 mt-0">
              Start Your Journey
            </h1>
            <p className="font-body-md text-body-md text-ethereal-text-variant font-sora m-0">
              Access the next generation of productivity.
            </p>
          </div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center justify-center space-y-4 mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center group cursor-pointer hover:border-brand-primary transition-colors"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                <img
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  src={profileImage}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-ethereal-text-variant uppercase font-sora">Upload Photo</span>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-ethereal-text-variant uppercase block font-sora" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">person</span>
                <input
                  className="w-full h-12 rounded-lg pl-12 pr-4 text-ethereal-text bg-gray-50 border border-gray-200 placeholder:text-gray-400 font-body-md text-body-md focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-ethereal-text-variant uppercase block font-sora" htmlFor="email">
                Email ID
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                <input
                  className="w-full h-12 rounded-lg pl-12 pr-4 text-ethereal-text bg-gray-50 border border-gray-200 placeholder:text-gray-400 font-body-md text-body-md focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                  id="email"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-ethereal-text-variant uppercase block font-sora" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">call</span>
                <input
                  className="w-full h-12 rounded-lg pl-12 pr-4 text-ethereal-text bg-gray-50 border border-gray-200 placeholder:text-gray-400 font-body-md text-body-md focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* PIN Number Field */}
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-ethereal-text-variant uppercase block font-sora" htmlFor="pin">
                PIN Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">pin</span>
                <input
                  className="w-full h-12 rounded-lg pl-12 pr-4 text-ethereal-text bg-gray-50 border border-gray-200 placeholder:text-gray-400 font-body-md text-body-md focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                  id="pin"
                  maxLength={4}
                  placeholder="••••"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ethereal-text transition-colors bg-transparent border-none cursor-pointer"
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPin ? "visibility" : "visibility_off"}</span>
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-3 mt-4">
              <input
                className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary flex-shrink-0 cursor-pointer"
                id="terms"
                type="checkbox"
              />
              <label className="font-body-md text-[14px] text-ethereal-text-variant select-none font-sora m-0" htmlFor="terms">
                I agree to the <a className="text-brand-primary hover:text-opacity-80 transition-colors underline underline-offset-2" href="#terms">Terms of Service</a> and <a className="text-brand-primary hover:text-opacity-80 transition-colors underline underline-offset-2" href="#privacy">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full h-14 rounded-full font-headline-md text-[16px] text-white flex items-center justify-center space-x-2 mt-6 md:mt-8 bg-brand-primary hover:bg-opacity-90 shadow-md hover:shadow-lg transition-all border-none cursor-pointer"
              type="submit"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          {/* Mobile login link fallback */}
          <div className="mt-8 text-center">
            <span className="font-body-md text-[14px] text-ethereal-text-variant font-sora">Already have an account? </span>
            <button
              onClick={() => navigate('/signin')}
              className="font-body-md text-[14px] text-brand-primary hover:text-opacity-80 transition-colors font-sora border-none bg-transparent cursor-pointer p-0"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
