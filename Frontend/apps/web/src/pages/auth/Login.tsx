import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

export const Login: React.FC = () => {
  const { login, switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handlePlatformLogin = () => {
    switchRole('platform_admin');
    login(
      { id: 'usr-platform-01', name: 'Swiggy Ops Admin', email: 'ops@swiggy.in', role: 'platform_admin', companyName: 'Swiggy' },
      'mock-jwt-token-12345'
    );
    navigate('/platform');
  };

  const handleBuyerLogin = () => {
    switchRole('corporate_buyer');
    login(
      { id: 'usr-buyer-01', name: 'Manipal ESG Lead', email: 'esg@manipal.edu', role: 'corporate_buyer', companyName: 'Manipal Group ESG Solutions' },
      'mock-jwt-token-67890'
    );
    navigate('/buyer');
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

        {/* Login cards */}
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
            <Button variant="primary" themeAccent="purple" className="w-full" onClick={handlePlatformLogin}>
              Sign in as Platform Admin
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
            <Button variant="primary" themeAccent="coral" className="w-full" onClick={handleBuyerLogin}>
              Sign in as Corporate Buyer
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">Demo environment · Mock data enabled</p>
      </div>
    </div>
  );
};
