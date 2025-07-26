'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle } from 'react-icons/fa';

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
    // Reset form fields when changing tabs
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
    e.preventDefault(); // Prevent default form submission

    if (loginMethod === 'google') {
      toast.info('Google sign-in is coming soon!');
      return;
    }

    try {
      const res = await fetch('/users.json');
      const users = await res.json();

      const user = users.find((u: any) =>
        loginMethod === 'email'
          ? u.email === identifier && u.password === password
          : u.phone === identifier && u.password === password
      );

      if (user) {
        localStorage.setItem('current_user', JSON.stringify(user));
        toast.success('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong during login.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (signupMethod === 'google') {
      toast.info('Google sign-up is coming soon!');
      return;
    }

    if (!agreedToTerms) {
      toast.error('You must agree to the terms and conditions.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Basic client-side validation for demonstration
    if (fullName.trim() === '' || identifier.trim() === '' || password.trim() === '') {
      toast.error('Please fill in all required fields.');
      return;
    }

    // In a real application, you'd send this data to your backend
    console.log('Signup data:', {
      fullName,
      identifier, // email or phone
      password,
      signupMethod,
    });

    // Simulate API call
    try {
      // const res = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fullName, identifier, password, signupMethod }),
      // });
      // const data = await res.json();

      // if (res.ok) {
        toast.success('Account created successfully! Please log in.');
        setTimeout(() => {
            handleTabChange('login'); // Redirect to login tab after successful signup
        }, 1500);
      // } else {
      //   toast.error(data.message || 'Signup failed. Please try again.');
      // }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Something went wrong during signup.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gradient-to-br from-[#FDFBF7] to-[#F6F6F6] animate-gradientShift">
      <ToastContainer />
      {/* === LEFT: Auth Form === */}
      <div className="relative flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16 z-10">
        <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-2xl shadow-2xl hover:scale-[1.005] transition-all duration-300">
          <h2 className="text-4xl font-extrabold text-[#775522] text-center mb-8">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join Refurnish NG!'}
          </h2>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg overflow-hidden mb-8 shadow-inner" role="tablist">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 font-bold text-lg ${activeTab === 'login' ? 'bg-[#775522] text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'} rounded-l-lg transition-all duration-300`}
              role="tab"
              aria-selected={activeTab === 'login'}
              id="login-tab"
              aria-controls="login-panel"
            >
              LOGIN
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-3 font-bold text-lg ${activeTab === 'signup' ? 'bg-[#775522] text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'} rounded-r-lg transition-all duration-300`}
              role="tab"
              aria-selected={activeTab === 'signup'}
              id="signup-tab"
              aria-controls="signup-panel"
            >
              SIGN UP
            </button>
          </div>

          {/* === LOGIN FORM === */}
          {activeTab === 'login' && (
            <div className="animate-fade-in-up" role="tabpanel" id="login-panel" aria-labelledby="login-tab">
              <MethodTabs current={loginMethod} setMethod={setLoginMethod} />

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
                    />
                    <InputField
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#775522] text-white py-3.5 font-semibold rounded-lg hover:bg-[#5E441B] transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      Login
                    </button>
                    <div className="text-right mt-2">
                      <a href="#" className="text-sm text-[#775522] hover:underline hover:text-[#5E441B] transition-colors">Forgot password?</a>
                    </div>
                  </>
                ) : (
                  <GoogleButton label="Login with Google" onClick={() => toast.info('Google sign-in is coming soon!')} />
                )}
              </form>
            </div>
          )}

          {/* === SIGN UP FORM === */}
          {activeTab === 'signup' && (
            <div className="animate-fade-in-up" role="tabpanel" id="signup-panel" aria-labelledby="signup-tab">
              <MethodTabs current={signupMethod} setMethod={setSignupMethod} />
              <form className="space-y-6" onSubmit={handleSignup}>
                <InputField
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
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
                    />
                    <InputField
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <InputField
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-4 h-4 mt-1 mr-2 accent-[#775522] cursor-pointer"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                        I agree to the{' '}
                        <a href="/terms" className="text-[#775522] underline hover:text-[#5E441B] transition-colors">terms and conditions</a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#E8CEB0] text-[#775522] py-3.5 font-semibold rounded-lg hover:bg-[#D4B598] transition-all duration-300 hover:-translate-y-1 shadow-lg"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <GoogleButton label="Sign up with Google" onClick={() => toast.info('Google sign-up is coming soon!')} />
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* === RIGHT: Decorative Section with Image and Write-up === */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/login-bg.png"
          alt="Beautifully furnished room"
          layout="fill"
          objectFit="cover"
          className="brightness-90 animate-zoomIn"
          priority
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex flex-col justify-end p-12 text-center">
          <h2 className="text-5xl font-extrabold mb-4 animate-slide-in-up drop-shadow-lg">
            Refurnish NG
          </h2>
          <p className="text-sm mt-4 italic opacity-80 animate-fade-in delay-300">
            &quot;Bringing elegance and comfort to every home.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable Components

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField: React.FC<InputFieldProps> = ({ className, ...props }) => (
  <input
    {...props}
    className={`w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522] placeholder-gray-500 text-gray-800 transition-all duration-200 ${className || ''}`}
  />
);

interface MethodTabsProps {
  current: 'email' | 'phone' | 'google';
  setMethod: (method: 'email' | 'phone' | 'google') => void;
}

const MethodTabs: React.FC<MethodTabsProps> = ({
  current,
  setMethod,
}) => (
  <div className="flex bg-gray-50 rounded-md overflow-hidden mb-6" role="tablist">
    {['email', 'phone', 'google'].map((method, i) => (
      <button
        key={method}
        onClick={() => setMethod(method as any)}
        className={`flex-1 py-2 text-sm font-medium transition-all duration-200 ${
          current === method
            ? 'bg-[#E8CEB0] text-[#775522] shadow-inner'
            : 'text-gray-600 hover:bg-gray-100'
        } ${i === 0 ? 'rounded-l-md' : i === 2 ? 'rounded-r-md' : ''}`}
        role="tab"
        aria-selected={current === method}
        id={`${method}-method-tab`}
        aria-controls={`${method}-method-panel`}
      >
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
    className="w-full flex justify-center items-center gap-3 bg-[#775522] text-white py-3 font-semibold rounded-lg hover:bg-[#5E441B] transition-all duration-300 hover:-translate-y-1 shadow-lg"
  >
    <FaGoogle className="text-xl" />
    {label}
  </button>
);