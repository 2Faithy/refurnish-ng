'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaGoogle, FaEnvelope, FaPhoneAlt, FaLock, FaUser, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

// --- DEFINED COLOR PALETTE ---
const PRIMARY_BRAND = '#775522'; // Deep Gold/Brown - Main Buttons, Active Tabs, Focus
const ACCENT_GREEN = '#5F7161'; // Muted Forest Green/Sage - Hover, Secondary Accent
const LIGHT_BG = '#FBFBFB'; // Near White Base Background
const CONTAINER_BG = '#E8CEB0'; // Muted Cream/Tan - Card Background

// Custom Toast System (To replace react-toastify's default look)
// =============================================================

interface CustomToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, type, isVisible }) => {
  const colors = {
    success: { bg: ACCENT_GREEN, icon: FaCheckCircle },
    error: { bg: '#A50000', icon: FaTimesCircle }, // Rich Red for strong error
    info: { bg: PRIMARY_BRAND, icon: FaInfoCircle },
  };

  const { bg, icon: Icon } = colors[type];

  // Only render if a message exists
  if (!message) return null;

  return (
    <div 
        className={`fixed top-6 right-6 z-[9999] p-4 pr-6 rounded-xl shadow-2xl transition-all duration-500 ease-out transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'}
        `}
        style={{ backgroundColor: bg, minWidth: '320px', transitionProperty: 'opacity, transform', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className="flex items-center">
        <Icon className="text-white text-xl mr-4 flex-shrink-0" />
        <p className="text-white font-semibold text-sm tracking-wide">{message}</p>
      </div>
    </div>
  );
};


// Main Auth Page Component
// =============================================================

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'google'>('email');
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone' | 'google'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [isToastVisible, setIsToastVisible] = useState(false);
  
  const showCustomToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
      setToastMessage(message);
      setToastType(type);
      setIsToastVisible(true);

      const timer = setTimeout(() => {
          setIsToastVisible(false);
          // Optional: clear message after animation
          setTimeout(() => setToastMessage(''), 500); 
      }, 4000); // 4 seconds visible

      return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#signup') setActiveTab('signup');
      else if (hash === '#login') setActiveTab('login');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setIdentifier('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setAgreedToTerms(false);
    if (tab === 'login') {
      setLoginMethod('email');
    } else {
      setSignupMethod('email');
    }
    window.location.hash = tab;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === 'google') {
      showCustomToast('Google Sign-In: feature coming soon.', 'info');
      return;
    }

    // Basic Validation
    if (!identifier || !password) {
        showCustomToast('Email/Phone and Password are required.', 'error');
        return;
    }

    try {
      // NOTE: Using local JSON file for demo
      const res = await fetch('/users.json'); 
      const users = await res.json();

      const user = users.find((u: any) =>
        loginMethod === 'email'
          ? u.email === identifier && u.password === password
          : u.phone === identifier && u.password === password
      );

      if (user) {
        localStorage.setItem('current_user', JSON.stringify(user));
        showCustomToast('Login successful! Welcome back.', 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        showCustomToast('Authentication failed: Invalid credentials.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showCustomToast('Error connecting to server. Please try again later.', 'error');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupMethod === 'google') {
      showCustomToast('Google Sign-Up: feature coming soon.', 'info');
      return;
    }

    if (!agreedToTerms) {
      showCustomToast('You must agree to the terms and privacy policy to continue.', 'error');
      return;
    }

    if (password.length < 6) {
        showCustomToast('Password must be at least 6 characters long.', 'error');
        return;
    }

    if (password !== confirmPassword) {
      showCustomToast('Password mismatch: Please ensure both fields match.', 'error');
      return;
    }

    if (fullName.trim() === '' || identifier.trim() === '' || password.trim() === '') {
      showCustomToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      // Simulate successful API call for signup
      showCustomToast('Account successfully created! Please log in now.', 'success');
      setTimeout(() => {
          handleTabChange('login');
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      showCustomToast('Something went wrong during account creation.', 'error');
    }
  };

  return (
    // Only applied pt-20 to the main container to push content down
    <div className={`min-h-screen flex flex-col lg:flex-row font-serif bg-[${LIGHT_BG}] pt-20`}> 
      
      {/* Custom Toast Display */}
      <CustomToast 
          message={toastMessage} 
          type={toastType}
          isVisible={isToastVisible}
      />
      
      {/* === LEFT: Auth Form (Earthy/Premium Container) === */}
      <div className="relative flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 z-10">
        <div className={`w-full max-w-xl p-10 md:p-12 lg:p-14 rounded-3xl shadow-2xl transition-all duration-500 border-t-8 border-r-4 border-[${PRIMARY_BRAND}]`}
             style={{ backgroundColor: CONTAINER_BG }}>
          <h2 className={`text-4xl font-extrabold text-[${PRIMARY_BRAND}] text-center mb-2 tracking-wide`}>
            {activeTab === 'login' ? 'Access Your Space' : 'Begin Your Collection'}
          </h2>
          <p className="text-center text-gray-700 mb-10 font-light">
            {activeTab === 'login' ? 'Sign in below for a tailored experience.' : 'Curate your space today with sustainable luxury.'}
          </p>

          {/* Tab Navigation (Pill-shaped, high contrast) */}
          <div className="flex rounded-full overflow-hidden mb-10 p-1 shadow-inner bg-white/70" role="tablist">
            <TabButton 
                label="LOG IN" 
                isActive={activeTab === 'login'} 
                onClick={() => handleTabChange('login')} 
                primary={PRIMARY_BRAND}
                accent={ACCENT_GREEN}
            />
            <TabButton 
                label="SIGN UP" 
                isActive={activeTab === 'signup'} 
                onClick={() => handleTabChange('signup')} 
                primary={PRIMARY_BRAND}
                accent={ACCENT_GREEN}
            />
          </div>

          {/* === FORM CONTAINER === */}
          {activeTab === 'login' && (
            <div className="animate-fade-in" role="tabpanel" id="login-panel" aria-labelledby="login-tab">
              <MethodTabs 
                current={loginMethod} 
                setMethod={setLoginMethod} 
                primary={PRIMARY_BRAND}
                accent={ACCENT_GREEN}
              />

              <form onSubmit={handleLogin} className="space-y-6">
                {loginMethod !== 'google' ? (
                  <>
                    <InputField
                      type={loginMethod === 'email' ? 'email' : 'tel'}
                      placeholder={loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      autoComplete={loginMethod === 'email' ? 'email' : 'tel'}
                      icon={loginMethod === 'email' ? FaEnvelope : FaPhoneAlt}
                      primary={PRIMARY_BRAND}
                    />
                    <InputField
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      icon={FaLock}
                      primary={PRIMARY_BRAND}
                    />
                    <div className="flex justify-between items-center text-sm pt-1">
                      <a href="#" className={`font-medium text-[${ACCENT_GREEN}] hover:text-[${PRIMARY_BRAND}] transition-colors`}>
                        Forgot Password?
                      </a>
                    </div>
                    <SubmitButton 
                        label="Log In Securely" 
                        primary={PRIMARY_BRAND}
                        accent={ACCENT_GREEN}
                        isPrimary
                    />
                  </>
                ) : (
                  <GoogleButton label="Login with Google" onClick={() => showCustomToast('Google Sign-In: feature coming soon.', 'info')} />
                )}
              </form>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="animate-fade-in" role="tabpanel" id="signup-panel" aria-labelledby="signup-tab">
              <MethodTabs 
                current={signupMethod} 
                setMethod={setSignupMethod} 
                primary={PRIMARY_BRAND}
                accent={ACCENT_GREEN}
              />
              <form className="space-y-6" onSubmit={handleSignup}>
                <InputField
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  icon={FaUser}
                  primary={PRIMARY_BRAND}
                />
                {signupMethod !== 'google' ? (
                  <>
                    <InputField
                      type={signupMethod === 'email' ? 'email' : 'tel'}
                      placeholder={signupMethod === 'email' ? 'Email Address' : 'Phone Number'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      autoComplete={signupMethod === 'email' ? 'email' : 'tel'}
                      icon={signupMethod === 'email' ? FaEnvelope : FaPhoneAlt}
                      primary={PRIMARY_BRAND}
                    />
                    <InputField
                      type="password"
                      placeholder="Create Password (Min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      icon={FaLock}
                      primary={PRIMARY_BRAND}
                    />
                    <InputField
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      icon={FaLock}
                      primary={PRIMARY_BRAND}
                    />
                    <div className="flex items-start pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className={`w-4 h-4 mt-1 mr-2 accent-[${PRIMARY_BRAND}] cursor-pointer`}
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer select-none">
                        I agree to the{' '}
                        <a href="/terms" className={`text-[${PRIMARY_BRAND}] underline hover:text-[${ACCENT_GREEN}] font-medium transition-colors`}>terms and privacy policy</a>.
                      </label>
                    </div>
                    <SubmitButton 
                        label="Create My Account" 
                        primary={PRIMARY_BRAND}
                        accent={ACCENT_GREEN}
                        isPrimary={false}
                    />
                  </>
                ) : (
                  <GoogleButton label="Sign up with Google" onClick={() => showCustomToast('Google Sign-Up: feature coming soon.', 'info')} />
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* === RIGHT: Decorative Section (Dark, Premium Background) === */}
      <div className={`hidden lg:flex flex-1 relative bg-[${PRIMARY_BRAND}]`}>
        <Image
          src="/login-bg.png"
          alt="Earthy and premium furniture setting"
          layout="fill"
          objectFit="cover"
          className="opacity-60"
          priority
        />
        {/* Dark, subtle overlay with premium typography */}
        <div className="absolute inset-0 bg-black/50 text-white flex flex-col justify-end p-12 lg:p-20 text-center">
          <h2 className="text-6xl font-serif font-bold italic mb-4 tracking-tight drop-shadow-xl">
            Refurnish NG
          </h2>
          <p className="text-xl font-light mb-8 opacity-90">
            **Timeless Design. Sustainable Future.**
          </p>
          <p className="text-sm opacity-70 border-t border-white/30 pt-4 max-w-sm mx-auto">
            "We believe in furniture that tells a story and lasts a lifetime, blending Nigerian craftsmanship with global style."
          </p>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------------------------------------------------
// Reusable Components
// --------------------------------------------------------------------------------------------------------------------------------

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    primary: string;
    accent: string;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, primary, accent }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 font-bold text-base transition-all duration-300 rounded-full tracking-wider ${
            isActive ? `bg-[${primary}] text-white shadow-lg` : `text-gray-600 hover:bg-white`
        }`}
        role="tab"
        aria-selected={isActive}
    >
        {label}
    </button>
);


interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  primary: string;
}

const InputField: React.FC<InputFieldProps> = ({ className, icon: Icon, primary, ...props }) => (
  <div className="relative">
    <Icon className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-[${primary}] text-lg`} />
    <input
      {...props}
      className={`w-full pl-12 pr-5 py-3.5 border-2 border-gray-300 rounded-xl focus:border-[${primary}] placeholder-gray-500 text-gray-800 transition-all duration-200 outline-none shadow-sm font-light bg-white`}
    />
  </div>
);

interface MethodTabsProps {
  current: 'email' | 'phone' | 'google';
  setMethod: (method: 'email' | 'phone' | 'google') => void;
  primary: string;
  accent: string;
}

const MethodTabs: React.FC<MethodTabsProps> = ({
  current,
  setMethod,
  primary,
  accent,
}) => (
  <div className="flex bg-white/70 rounded-full overflow-hidden mb-8 p-1 border border-gray-300" role="tablist">
    {[
      { method: 'email', Icon: FaEnvelope },
      { method: 'phone', Icon: FaPhoneAlt },
      { method: 'google', Icon: FaGoogle }
    ].map(({ method, Icon }, i) => (
      <button
        key={method}
        onClick={() => setMethod(method as any)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-all duration-200 rounded-full tracking-tight ${
          current === method
            ? `bg-[${primary}] text-white shadow-md`
            : `text-gray-700 hover:bg-white`
        }`}
        role="tab"
        aria-selected={current === method}
      >
        <Icon className="text-base" />
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </button>
    ))}
  </div>
);

interface GoogleButtonProps {
  label: string;
  onClick: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex justify-center items-center gap-3 bg-white text-gray-700 py-3.5 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-md"
  >
    <FaGoogle className="text-xl text-red-500" />
    {label}
  </button>
);

interface SubmitButtonProps {
    label: string;
    primary: string;
    accent: string;
    isPrimary: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, primary, accent, isPrimary }) => {
    const bg = isPrimary ? primary : accent;
    const hoverBg = isPrimary ? accent : primary;
    
    return (
        <button
          type="submit"
          className={`w-full text-white py-4 font-extrabold rounded-xl transition-all duration-300 shadow-lg transform hover:scale-[1.01] tracking-wider`}
          style={{ backgroundColor: bg, boxShadow: `0 6px 20px rgba(0, 0, 0, 0.2)` }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bg)}
        >
          {label}
        </button>
    );
};