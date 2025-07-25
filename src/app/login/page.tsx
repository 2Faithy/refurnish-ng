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
    if (tab === 'login') {
      setLoginMethod('email');
      setIdentifier('');
      setPassword('');
    } else {
      setSignupMethod('email');
    }
    window.location.hash = tab;
  };

  const handleLogin = async () => {
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
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gradient-to-br from-[#f8f5f0] to-[#e8e2d7] overflow-hidden">
      <ToastContainer />
      {/* === LEFT: Form Section === */}
      <div className="relative flex-1 flex items-center justify-center p-6 sm:p-10 md:p-16 z-10">
        <div className="w-full max-w-lg bg-white bg-opacity-95 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-3xl transform transition-all duration-500 hover:scale-[1.01] border border-gray-100">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#5a4a3a] text-center mb-8 animate-fade-in-down">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join Refurnish NG!'}
          </h2>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl overflow-hidden mb-8 shadow-inner-lg">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 sm:py-4 font-bold text-lg sm:text-xl ${activeTab === 'login' ? 'bg-[#7a624f] text-white shadow-lg-inner' : 'text-gray-700 hover:bg-gray-200'} rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5`}
            >
              LOGIN
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-3 sm:py-4 font-bold text-lg sm:text-xl ${activeTab === 'signup' ? 'bg-[#7a624f] text-white shadow-lg-inner' : 'text-gray-700 hover:bg-gray-200'} rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5`}
            >
              SIGN UP
            </button>
          </div>

          {/* === LOGIN FORM === */}
          {activeTab === 'login' && (
            <div className="animate-fade-in-up space-y-6">
              <MethodTabs current={loginMethod} setMethod={setLoginMethod} />

              {loginMethod !== 'google' ? (
                <>
                  <InputField
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                  <InputField
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full bg-[#7a624f] text-white py-3.5 font-semibold rounded-xl hover:bg-[#5e4d3f] transition-all duration-300 hover:-translate-y-1 shadow-lg transform hover:scale-[1.005]"
                  >
                    Login
                  </button>
                  <div className="text-right mt-2">
                    <a href="#" className="text-sm text-[#7a624f] hover:underline transition-colors duration-200">Forgot password?</a>
                  </div>
                </>
              ) : (
                <GoogleButton label="Login with Google" />
              )}
            </div>
          )}

          {/* === SIGN UP FORM === */}
          {activeTab === 'signup' && (
            <div className="animate-fade-in-up space-y-6">
              <MethodTabs current={signupMethod} setMethod={setSignupMethod} />
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <InputField type="text" placeholder="Full Name" required />
                {signupMethod !== 'google' && (
                  <>
                    <InputField type={signupMethod === 'email' ? 'email' : 'tel'} placeholder={signupMethod === 'email' ? 'Email Address' : 'Phone Number'} required />
                    <InputField type="password" placeholder="Password" required />
                    <InputField type="password" placeholder="Confirm Password" required />
                    <div className="flex items-start">
                      <input type="checkbox" required id="terms" className="w-4 h-4 mt-1 mr-2 accent-[#7a624f]" />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-[#7a624f] underline hover:text-[#5e4d3f] transition-colors duration-200">terms and conditions</a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#c9b7a6] text-[#5a4a3a] py-3.5 font-semibold rounded-xl hover:bg-[#a69687] transition-all duration-300 hover:-translate-y-1 shadow-lg transform hover:scale-[1.005]"
                    >
                      Sign Up
                    </button>
                  </>
                )}
                {signupMethod === 'google' && <GoogleButton label="Sign up with Google" />}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* === RIGHT: Image Section === */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden rounded-l-3xl shadow-2xl">
        <Image
          src="/login-bg.png"
          alt="Elegant Furniture"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="filter brightness-90 saturate-110 contrast-105 transform scale-105 transition-transform duration-1000 ease-out animate-zoom-in"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex flex-col justify-end p-12 text-center z-10">
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg animate-slide-in-up-slow">Refurnish NG</h2>
          <p className="text-lg leading-relaxed font-light drop-shadow animate-slide-in-up-slow delay-200">
            Discover and sell exquisite, quality furniture across Nigeria. <br /> Your home deserves the best.
          </p>
        </div>
      </div>
    </div>
  );
}

// === Input Field Component ===
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const InputField: React.FC<InputFieldProps> = (props) => (
  <input
    {...props}
    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-[#7a624f] focus:border-transparent placeholder-gray-500 text-gray-800 transition-all duration-300 shadow-sm outline-none"
  />
);

// === Method Tabs Component ===
const MethodTabs = ({
  current,
  setMethod,
}: {
  current: 'email' | 'phone' | 'google';
  setMethod: (method: 'email' | 'phone' | 'google') => void;
}) => (
  <div className="flex bg-gray-50 rounded-xl overflow-hidden mb-6 shadow-md">
    {['email', 'phone', 'google'].map((method, i) => (
      <button
        key={method}
        onClick={() => setMethod(method as any)}
        className={`flex-1 py-2 text-sm sm:text-base font-medium transition-all duration-300 ease-in-out ${
          current === method
            ? 'bg-[#b6a492] text-[#5a4a3a] shadow-inner-sm'
            : 'text-gray-600 hover:bg-gray-100'
        } ${i === 0 ? 'rounded-l-xl' : i === 2 ? 'rounded-r-xl' : ''} transform hover:scale-[1.02]`}
      >
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </button>
    ))}
  </div>
);

// === Google Button Component ===
const GoogleButton = ({ label }: { label: string }) => (
  <button
    type="button"
    onClick={() => toast.info('Google sign-in feature is coming soon!', { position: 'top-center' })}
    className="w-full flex justify-center items-center gap-3 bg-[#7a624f] text-white py-3.5 font-semibold rounded-xl hover:bg-[#5e4d3f] transition-all duration-300 hover:-translate-y-1 shadow-lg transform hover:scale-[1.005]"
  >
    <FaGoogle className="text-xl" />
    {label}
  </button>
);