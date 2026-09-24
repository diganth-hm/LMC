import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiderStats } from '../hooks/useRiderQueries';
import { ArrowLeft, Award } from 'lucide-react';

const tiers = [
  { name: 'Bronze', min: 0, max: 40, color: '#b45309', bgColor: '#fef3c7', benefits: 'Base green bonus rate' },
  { name: 'Silver', min: 40, max: 60, color: '#64748b', bgColor: '#f1f5f9', benefits: '1.25× bonus multiplier' },
  { name: 'Gold', min: 60, max: 80, color: '#b45309', bgColor: '#fef9c3', benefits: '1.5× bonus + priority assignments' },
  { name: 'Platinum', min: 80, max: 100, color: '#4338ca', bgColor: '#eef2ff', benefits: '2× bonus + priority + badge visibility' },
];

export const GreenScore: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats } = useRiderStats();
  const score = stats?.grsScore || 74;
  const currentTier = stats?.currentTier || 'Gold';
  const currentTierData = tiers.find(t => t.name === currentTier);

  return (
    <div className="min-h-screen bg-[#FBFAF7] pb-20">
      <div className="px-5 pt-12 mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
        <h1 className="text-xl font-bold text-gray-900">Green Score & Badge</h1>
      </div>

      {/* Large badge */}
      <div className="px-5 text-center mb-8">
        <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center shadow-lg mb-4`} style={{ backgroundColor: currentTierData?.bgColor }}>
          <Award className="w-14 h-14" style={{ color: currentTierData?.color }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{currentTier}</h2>
        <p className="text-4xl font-bold text-[#0F6E56] mt-2">{score}<span className="text-base font-normal text-gray-400">/100</span></p>
        <p className="text-xs text-gray-500 mt-1">Green Route Score</p>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-md border border-gray-200 p-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Progress to next tier</span>
            <span className="font-medium text-[#0F6E56]">{stats?.nextTierThreshold || 80} GRS needed</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0F6E56] to-[#1a9474] rounded-full transition-all" style={{ width: `${score}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{(stats?.nextTierThreshold || 80) - score} points to Platinum</p>
        </div>
      </div>

      {/* Tier comparison table */}
      <div className="px-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">All Tiers</h3>
        <div className="space-y-2">
          {tiers.map(tier => (
            <div key={tier.name} className={`rounded-md border p-3 flex items-center gap-3 ${tier.name === currentTier ? 'border-[#0F6E56] bg-[#E1F5EE]' : 'border-gray-200 bg-white'}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: tier.bgColor }}>
                <Award className="w-5 h-5" style={{ color: tier.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{tier.name}</p>
                  <p className="text-xs text-gray-400">{tier.min}–{tier.max} GRS</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{tier.benefits}</p>
              </div>
              {tier.name === currentTier && <span className="text-[10px] font-bold text-[#0F6E56] uppercase">Current</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
