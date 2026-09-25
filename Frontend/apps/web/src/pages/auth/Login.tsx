import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/api/auth';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const Login: React.FC = () => {
  const { login, switchRole } = useAuthStore();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<'platform_admin' | 'corporate_buyer'>('platform_admin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ── Mock mode: quick-login buttons ──
  const handlePlatformLogin = async () => {
    if (USE_MOCKS) {
      switchRole('platform_admin');
      login(
        { id: 'usr-platform-01', name: 'Swiggy Ops Admin', email: 'ops@swiggy.in', role: 'platform_admin', companyName: 'Swiggy' },
        'mock-jwt-token-12345'
      );
      navigate('/platform');
      return;
    }
    await handleRealLogin('admin@lastmilecarbon.org', 'admin123', '/platform');
  };

  const handleBuyerLogin = async () => {
    if (USE_MOCKS) {
      switchRole('corporate_buyer');
      login(
        { id: 'usr-buyer-01', name: 'Manipal ESG Lead', email: 'esg@manipal.edu', role: 'corporate_buyer', companyName: 'Manipal Group ESG Solutions' },
        'mock-jwt-token-67890'
      );
      navigate('/buyer');
      return;
    }
    await handleRealLogin('esg@manipal.edu', 'buyer123', '/buyer');
  };

  // ── Real mode: email + password login/signup form ──
  const handleRealLogin = async (loginEmail: string, loginPassword: string, fallbackRedirect: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await authService.login(loginEmail, loginPassword);
      login(result.user, result.token);
      const target = result.user.role === 'corporate_buyer' ? '/buyer' : '/platform';
      navigate(target);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || 'Login failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRealSignup = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await authService.signup({ email, password, role, companyName });
      login(result.user, result.token);
      const target = result.user.role === 'corporate_buyer' ? '/buyer' : '/platform';
      navigate(target);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || 'Sign up failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email and password are required');
      return;
    }
    if (isSignUp) {
      await handleRealSignup();
    } else {
      await handleRealLogin(email, password, '/platform');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#0F6E56] mx-auto flex items-center justify-center mb-4 shadow-lg">
            <Leaf className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LastMile Carbon</h1>
          <p className="text-sm text-gray-500 mt-1">Verified last-mile carbon credits</p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Mode switcher tabs */}
        <div className="flex border-b border-gray-200 mb-4 bg-white rounded-t-lg">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 ${!isSignUp ? 'border-[#0F6E56] text-[#0F6E56]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 ${isSignUp ? 'border-[#0F6E56] text-[#0F6E56]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6 mb-4 space-y-4">
          <h3 className="font-semibold text-gray-900">{isSignUp ? 'Create a new account' : 'Sign in with credentials'}</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40"
                  placeholder="e.g. Swiggy or Manipal Group"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'platform_admin' | 'corporate_buyer')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40 bg-white"
                >
                  <option value="platform_admin">Platform Admin (Fleet & Operations)</option>
                  <option value="corporate_buyer">Corporate Buyer (ESG & Carbon Credits)</option>
                </select>
              </div>
            </>
          )}

          <Button variant="primary" themeAccent={role === 'corporate_buyer' ? 'coral' : 'purple'} className="w-full" disabled={isLoading}>
            {isLoading ? (isSignUp ? 'Creating Account…' : 'Signing in…') : (isSignUp ? 'Register & Sign In' : 'Sign In')}
          </Button>
        </form>

        {/* Quick demo login cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-md bg-[#F3F0F9] flex items-center justify-center">
                <span className="text-base">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Demo Platform Admin</h3>
                <p className="text-xs text-gray-500">Fleet management & sustainability ops</p>
              </div>
            </div>
            <Button variant="primary" themeAccent="purple" className="w-full text-xs py-2" onClick={handlePlatformLogin} disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Demo Sign in as Platform Admin'}
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-md bg-[#FDF2EE] flex items-center justify-center">
                <span className="text-base">🏢</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Demo Corporate Buyer</h3>
                <p className="text-xs text-gray-500">Carbon credit procurement & ESG</p>
              </div>
            </div>
            <Button variant="primary" themeAccent="coral" className="w-full text-xs py-2" onClick={handleBuyerLogin} disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Demo Sign in as Corporate Buyer'}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">{USE_MOCKS ? 'Demo environment · Mock data enabled' : 'Connected to live backend'}</p>
      </div>
    </div>
  );
};
