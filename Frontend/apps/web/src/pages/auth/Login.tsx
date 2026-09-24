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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    // Real mode: login as platform admin using hardcoded demo credentials
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
    // Real mode: login as buyer using hardcoded demo credentials
    await handleRealLogin('esg@manipal.edu', 'buyer123', '/buyer');
  };

  // ── Real mode: email + password form ──
  const handleRealLogin = async (loginEmail: string, loginPassword: string, redirectTo: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await authService.login(loginEmail, loginPassword);
      login(result.user, result.token);
      navigate(redirectTo);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || 'Login failed. Check credentials.');
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
    await handleRealLogin(email, password, '/platform');
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
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

        {/* Real login form (shown only when mocks are off) */}
        {!USE_MOCKS && (
          <form onSubmit={handleFormSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Sign in with credentials</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4B8A]/40"
                placeholder="ops@swiggy.in"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4B8A]/40"
                placeholder="Enter your password"
              />
            </div>
            <Button variant="primary" themeAccent="purple" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        )}

        {/* Quick login cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-[#F3F0F9] flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Platform Admin</h3>
                <p className="text-xs text-gray-500">Fleet management & sustainability ops</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Sign in as <strong>Swiggy Ops Admin</strong> to view fleet analytics, rider leaderboard, emissions data, and billing.</p>
            <Button variant="primary" themeAccent="purple" className="w-full" onClick={handlePlatformLogin} disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in as Platform Admin'}
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-[#FDF2EE] flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Corporate Buyer</h3>
                <p className="text-xs text-gray-500">Carbon credit procurement & ESG</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Sign in as <strong>Manipal Group ESG</strong> to browse verified carbon credit inventory, purchase, and download certificates.</p>
            <Button variant="primary" themeAccent="coral" className="w-full" onClick={handleBuyerLogin} disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in as Corporate Buyer'}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">{USE_MOCKS ? 'Demo environment · Mock data enabled' : 'Connected to live backend'}</p>
      </div>
    </div>
  );
};
