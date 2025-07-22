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
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gradient-to-br from-[#FDFBF7] to-[#F6F6F6] animate-gradientShift">
      <ToastContainer />
      {/* === LEFT === */}
      <div className="relative flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16 z-10">
        <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-2xl shadow-2xl hover:scale-[1.005] transition-all">
          <h2 className="text-4xl font-extrabold text-[#775522] text-center mb-8">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join Refurnish NG!'}
          </h2>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg overflow-hidden mb-8 shadow-inner">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 font-bold text-lg ${activeTab === 'login' ? 'bg-[#775522] text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'} rounded-l-lg transition-all`}
            >
              LOGIN
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-3 font-bold text-lg ${activeTab === 'signup' ? 'bg-[#775522] text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'} rounded-r-lg transition-all`}
            >
              SIGN UP
            </button>
          </div>

          {/* === LOGIN === */}
          {activeTab === 'login' && (
            <div className="animate-fade-in-up">
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
                    className="w-full bg-[#775522] text-white py-3.5 font-semibold rounded-lg hover:bg-[#5E441B] transition-all hover:-translate-y-1 shadow-lg"
                  >
                    Login
                  </button>
                  <div className="text-right mt-2">
                    <a href="#" className="text-sm text-[#775522] hover:underline">Forgot password?</a>
                  </div>
                </>
              ) : (
                <GoogleButton label="Login with Google" />
              )}
            </div>
          )}

          {/* === SIGN UP === */}
          {activeTab === 'signup' && (
            <div className="animate-fade-in-up">
              <MethodTabs current={signupMethod} setMethod={setSignupMethod} />
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <InputField type="text" placeholder="Full Name" required />
                {signupMethod !== 'google' && (
                  <>
                    <InputField type={signupMethod === 'email' ? 'email' : 'tel'} placeholder={signupMethod === 'email' ? 'Email Address' : 'Phone Number'} required />
                    <InputField type="password" placeholder="Password" required />
                    <InputField type="password" placeholder="Confirm Password" required />
                    <div className="flex items-start">
                      <input type="checkbox" required id="terms" className="w-4 h-4 mt-1 mr-2" />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-[#775522] underline hover:text-[#5E441B]">terms and conditions</a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#E8CEB0] text-[#775522] py-3.5 font-semibold rounded-lg hover:bg-[#D4B598] transition-all hover:-translate-y-1 shadow-lg"
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

      {/* === RIGHT === */}
      <div className="hidden lg:flex flex-1 relative">
        <Image src="/hero.png" alt="Furniture" layout="fill" objectFit="cover" className="brightness-90" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent text-white flex flex-col justify-end p-12 text-center">
          <h2 className="text-4xl font-extrabold mb-4 animate-slide-in-up">Refurnish NG</h2>
          <p className="text-lg leading-relaxed animate-slide-in-up">Discover and sell exquisite, quality furniture across Nigeria.</p>
        </div>
      </div>
    </div>
  );
}

// === Input ===
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const InputField: React.FC<InputFieldProps> = (props) => (
  <input
    {...props}
    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#775522] placeholder-gray-500 text-gray-800 transition-all"
  />
);

// === Tabs ===
const MethodTabs = ({
  current,
  setMethod,
}: {
  current: 'email' | 'phone' | 'google';
  setMethod: (method: 'email' | 'phone' | 'google') => void;
}) => (
  <div className="flex bg-gray-50 rounded-md overflow-hidden mb-6">
    {['email', 'phone', 'google'].map((method, i) => (
      <button
        key={method}
        onClick={() => setMethod(method as any)}
        className={`flex-1 py-2 text-sm font-medium transition-all ${
          current === method
            ? 'bg-[#E8CEB0] text-[#775522] shadow-inner'
            : 'text-gray-600 hover:bg-gray-100'
        } ${i === 0 ? 'rounded-l-md' : i === 2 ? 'rounded-r-md' : ''}`}
      >
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </button>
    ))}
  </div>
);

// === Google Button ===
const GoogleButton = ({ label }: { label: string }) => (
  <button
    type="button"
    onClick={() => alert('Google sign-in coming soon!')}
    className="w-full flex justify-center items-center gap-3 bg-[#775522] text-white py-3 font-semibold rounded-lg hover:bg-[#E8CEB0] transition-all hover:-translate-y-1 shadow-lg"
  >
    <FaGoogle className="text-xl" />
    {label}
  </button>
);
