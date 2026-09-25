import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { apiClient } from '../services/api/client';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!phone || phone.length < 10) { setError('Enter a valid phone number'); return; }
    setError('');

    if (USE_MOCKS) {
      setStep('otp');
      return;
    }

    // Real mode: POST /auth/rider/login
    setLoading(true);
    try {
      await apiClient.post('/auth/rider/login', { phone });
      setStep('otp');
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    if (USE_MOCKS) {
      setTimeout(() => {
        if (otp.length >= 4) {
          localStorage.setItem('lmc_rider_token', 'mock-rider-token');
          navigate('/home');
        } else {
          setError('Invalid OTP');
          setLoading(false);
        }
      }, 500);
      return;
    }

    // Real mode: POST /auth/rider/verify-otp
    try {
      const res = await apiClient.post('/auth/rider/verify-otp', { phone, otp });
      const data = res.data;
      localStorage.setItem('lmc_rider_token', data?.token || '');
      navigate('/home');
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#0F6E56] mx-auto flex items-center justify-center mb-4 shadow-lg">
            <Leaf className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LastMile Carbon</h1>
          <p className="text-sm text-gray-500 mt-1">Earn green bonuses every delivery</p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56]"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={handleContinue}
              disabled={!phone || loading}
              className="w-full py-3 bg-[#0F6E56] text-white font-semibold rounded-md disabled:opacity-40 hover:bg-[#0c5945] transition-colors flex items-center justify-center gap-2"
            >
              {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              Continue
            </button>

            {/* Quick Demo Fill button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setPhone('9876543210');
                  setStep('otp');
                  setOtp('1234');
                }}
                className="w-full p-2.5 bg-[#E1F5EE] hover:bg-[#d0f0e4] border border-[#0F6E56]/30 rounded-md text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0F6E56]">⚡ Quick Demo Rider</span>
                    <span className="text-[10px] bg-[#0F6E56] text-white px-1.5 py-0.2 rounded font-semibold">Guru Prasad</span>
                  </div>
                  <p className="text-[11px] text-[#0F6E56]/80">+91 98765 43210 · OTP: 1234</p>
                </div>
                <span className="text-xs font-semibold text-[#0F6E56] group-hover:translate-x-0.5 transition-transform">Auto-Fill →</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Enter the OTP sent to <strong>{phone}</strong></p>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d?$/.test(val)) {
                      const newOtp = otp.split('');
                      newOtp[i] = val;
                      setOtp(newOtp.join(''));
                      if (val && i < 3) {
                        const next = e.target.nextElementSibling as HTMLInputElement;
                        next?.focus();
                      }
                    }
                  }}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56]"
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-500 text-center animate-pulse">{error}</p>}
            <button
              onClick={handleVerify}
              disabled={loading || otp.length < 4}
              className="w-full py-3 bg-[#0F6E56] text-white font-semibold rounded-md disabled:opacity-40 hover:bg-[#0c5945] transition-colors flex items-center justify-center gap-2"
            >
              {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              Verify & Login
            </button>
            <p className="text-xs text-center text-gray-400">
              {USE_MOCKS ? 'Demo · Enter any 4-digit OTP' : 'OTP: 1234 (demo mode)'}
            </p>
          </div>
        )}

        <p className="text-xs text-center text-gray-400 mt-8">{USE_MOCKS ? 'Demo · Mock data enabled' : 'Connected to live backend'}</p>
      </div>
    </div>
  );
};
