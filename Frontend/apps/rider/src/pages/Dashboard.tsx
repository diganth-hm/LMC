import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiderStats, useRiderProfile, useDeliveryAssignment } from '../hooks/useRiderQueries';
import { Leaf, Wallet, Zap, Award } from 'lucide-react';

const tierColors: Record<string, string> = { Bronze: 'bg-orange-100 text-orange-700', Silver: 'bg-slate-100 text-slate-700', Gold: 'bg-yellow-100 text-yellow-700', Platinum: 'bg-indigo-100 text-indigo-700' };

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useRiderStats();
  const { data: profile } = useRiderProfile();
  const { data: assignment } = useDeliveryAssignment();

  return (
    <div className="min-h-screen bg-[#FBFAF7] pb-20">
      {/* Header */}
      <div className="bg-[#0F6E56] px-5 pt-12 pb-8 rounded-b-[24px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm">Good afternoon,</p>
            <h1 className="text-xl font-bold text-white">{profile?.name || 'Rider'} 👋</h1>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${tierColors[stats?.currentTier || 'Gold']}`}>
            {stats?.currentTier || 'Gold'}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white/15 rounded-md h-[72px] animate-pulse" />)
          ) : (
            <>
              <div className="bg-white/15 backdrop-blur-sm rounded-md p-3">
                <div className="flex items-center gap-1.5 mb-1"><Zap className="w-3.5 h-3.5 text-white/70" /><span className="text-[10px] text-white/70 uppercase">Deliveries</span></div>
                <p className="text-xl font-bold text-white">{stats?.todayDeliveries || 4}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-md p-3">
                <div className="flex items-center gap-1.5 mb-1"><Leaf className="w-3.5 h-3.5 text-white/70" /><span className="text-[10px] text-white/70 uppercase">CO₂ Saved</span></div>
                <p className="text-xl font-bold text-white">{stats?.todayCO2SavedKg || 2.4} kg</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-md p-3">
                <div className="flex items-center gap-1.5 mb-1"><Wallet className="w-3.5 h-3.5 text-white/70" /><span className="text-[10px] text-white/70 uppercase">Earned</span></div>
                <p className="text-xl font-bold text-white">₹{stats?.todayEarningsRupees || 48}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-md p-3">
                <div className="flex items-center gap-1.5 mb-1"><Award className="w-3.5 h-3.5 text-white/70" /><span className="text-[10px] text-white/70 uppercase">GRS Score</span></div>
                <p className="text-xl font-bold text-white">{stats?.grsScore || 78}/100</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active delivery card */}
      <div className="px-5 mt-6">
        <button
          onClick={() => navigate('/delivery/assignment')}
          className="w-full bg-white rounded-lg border border-gray-200 p-5 text-left hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F6E56]">● New Delivery</span>
            <span className="text-xs text-gray-400 group-hover:text-[#0F6E56] transition-colors">Tap to view →</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{assignment?.pickupName || 'Machali (Seafood Kitchen)'}</p>
          <p className="text-xs text-gray-500 mt-0.5">{assignment?.pickupAddress || 'Hampankatta'} → {assignment?.dropAddress || 'Kadri Hills'} · {assignment?.distanceKm || 4.8} km</p>
          <div className="mt-3 h-1 bg-[#E1F5EE] rounded-full overflow-hidden">
            <div className="h-full bg-[#0F6E56] rounded-full animate-pulse-subtle" style={{ width: '30%' }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Calculating green routes...</p>
        </button>
      </div>

      {/* Quick stats row */}
      <div className="px-5 mt-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Today's impact</p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🌿 {stats?.todayCO2SavedKg || 0} kg saved</span>
          <span className="text-gray-300">·</span>
          <span>= brewing {Math.round((stats?.todayCO2SavedKg || 0) * 50)} cups of tea</span>
        </div>
      </div>
    </div>
  );
};
