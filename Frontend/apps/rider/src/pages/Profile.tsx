import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiderProfile, useUpdateVehicle } from '../hooks/useRiderQueries';
import { ChevronRight, LogOut, Bell, CreditCard, HelpCircle, Award, Bike, Zap, Car } from 'lucide-react';

const vehicleIcons: Record<string, React.ReactNode> = {
  'Petrol 2W': <Bike className="w-5 h-5 text-gray-600" />,
  'EV 2W': <Zap className="w-5 h-5 text-[#0F6E56]" />,
  'CNG 3W': <Car className="w-5 h-5 text-amber-600" />,
  'Diesel 3W': <Car className="w-5 h-5 text-gray-600" />,
};

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile } = useRiderProfile();
  const updateVehicleMutation = useUpdateVehicle();

  const handleLogout = () => {
    localStorage.removeItem('lmc_rider_token');
    navigate('/login');
  };

  const handleVehicleChange = (type: string) => {
    updateVehicleMutation.mutate(type);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] pb-20">
      {/* Profile header */}
      <div className="bg-[#0F6E56] px-5 pt-12 pb-8 rounded-b-[24px]">
        <div className="flex items-center gap-4">
          <img src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={profile?.name} className="w-16 h-16 rounded-full border-2 border-white/30 object-cover" />
          <div>
            <h1 className="text-lg font-bold text-white">{profile?.name || 'Rider'}</h1>
            <p className="text-sm text-white/70">{profile?.phone}</p>
            <p className="text-xs text-white/50 mt-0.5">Member since {profile?.memberSince || '2026'}</p>
          </div>
        </div>
      </div>

      {/* Vehicle type selector */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Vehicle Type</h2>
        <div className="grid grid-cols-2 gap-2">
          {(['Petrol 2W', 'EV 2W', 'CNG 3W', 'Diesel 3W'] as const).map(type => (
            <div
              key={type}
              onClick={() => handleVehicleChange(type)}
              className={`p-3 rounded-md border-2 flex items-center gap-2 cursor-pointer transition-all ${profile?.vehicleType === type ? 'border-[#0F6E56] bg-[#E1F5EE]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              {vehicleIcons[type]}
              <span className="text-xs font-medium text-gray-700">{type}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Changing vehicle type affects your CO₂ calculations</p>
      </div>

      {/* Settings list */}
      <div className="px-5 mt-6 space-y-1">
        <button onClick={() => navigate('/green-score')} className="w-full flex items-center justify-between p-3 bg-white rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3"><Award className="w-4 h-4 text-[#0F6E56]" /><span className="text-sm text-gray-800">View my tier & GRS</span></div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-3 bg-white rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3"><Bell className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-800">Notifications</span></div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-3 bg-white rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-800">Payout account ****{profile?.payoutAccount?.slice(-4) || '4832'}</span></div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-3 bg-white rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3"><HelpCircle className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-800">Support</span></div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="px-5 mt-6">
        <button onClick={handleLogout} className="w-full py-3 border border-red-200 text-red-500 font-medium rounded-md text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
};
