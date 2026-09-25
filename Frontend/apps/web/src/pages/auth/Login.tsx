import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/api/auth';

export const Login: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role] = useState<'corporate_buyer'>('corporate_buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRealLogin = async (loginEmail: string, loginPassword: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await authService.login(loginEmail, loginPassword);
      login(result.user, result.token);
      const target = result.user.role === 'corporate_buyer' ? '/buyer' : '/platform';
      navigate(target);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || 'Login failed. Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRealSignup = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await authService.signup({ email, password, role: 'corporate_buyer', companyName });
      login(result.user, result.token);
      navigate('/buyer');
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setErrorMsg(apiErr?.message || 'Sign up failed. Please try again.');
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
      await handleRealLogin(email, password);
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
          <p className="text-sm text-gray-500 mt-1">Verified last-mile carbon credit platform</p>
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
            Create Buyer Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="bg-white rounded-b-lg border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 text-base">{isSignUp ? 'Create a Corporate Buyer account' : 'Sign in to your account'}</h3>
          
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
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40"
                  placeholder="e.g. Manipal Group or Infosys ESG"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
                <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-2.5 font-medium flex items-center justify-between">
                  <span>🏢 Corporate Buyer (Carbon Credit Procurement)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Standard</span>
                </div>
              </div>
            </>
          )}

          <Button variant="primary" themeAccent={isSignUp ? 'coral' : 'purple'} className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (isSignUp ? 'Creating Account…' : 'Signing in…') : (isSignUp ? 'Register & Sign In' : 'Sign In')}
          </Button>
        </form>
      </div>
    </div>
  );
};
