import React, { useState } from 'react';
import { useCO2History } from '../hooks/useRiderQueries';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { Leaf, TreePine, TrendingDown } from 'lucide-react';

export const CO2History: React.FC = () => {
  const navigate = useNavigate();
  const { data: history } = useCO2History();
  const [range, setRange] = useState<'week' | 'month'>('month');

  const displayData = range === 'week' ? (history || []).slice(-7) : (history || []);
  const totalSaved = displayData.reduce((s, h) => s + h.co2SavedKg, 0);
  const treeEquiv = Math.round(totalSaved / 21.77);

  return (
    <div className="min-h-screen bg-[#FBFAF7] pb-20">
      <div className="px-5 pt-12 mb-6">
        <h1 className="text-xl font-bold text-gray-900">CO₂ History</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your 30-day environmental impact trend</p>
      </div>

      {/* Date range toggle */}
      <div className="px-5 mb-4">
        <div className="flex rounded-md border border-gray-200 overflow-hidden w-fit">
          {(['week', 'month'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${range === r ? 'bg-[#0F6E56] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{r}</button>
          ))}
        </div>
      </div>

      {/* Line chart */}
      <div className="px-5">
        <div className="bg-white rounded-md border border-gray-200 p-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#ccc" />
                <YAxis tick={{ fontSize: 10 }} stroke="#ccc" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="co2SavedKg" stroke="#0F6E56" strokeWidth={2} dot={false} name="CO₂ Saved (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-md border border-gray-100 p-3 text-center">
          <Leaf className="w-5 h-5 text-[#0F6E56] mx-auto mb-1" />
          <p className="text-base font-bold">{totalSaved.toFixed(1)} kg</p>
          <p className="text-[10px] text-gray-400">Total saved</p>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-3 text-center">
          <TreePine className="w-5 h-5 text-[#0F6E56] mx-auto mb-1" />
          <p className="text-base font-bold">{treeEquiv}</p>
          <p className="text-[10px] text-gray-400">Tree equiv.</p>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-3 text-center">
          <TrendingDown className="w-5 h-5 text-[#0F6E56] mx-auto mb-1" />
          <p className="text-base font-bold">78%</p>
          <p className="text-[10px] text-gray-400">Reduction</p>
        </div>
      </div>

      <div className="px-5 mt-4">
        <button onClick={() => navigate('/route-history')} className="text-sm text-[#0F6E56] font-medium hover:underline">
          View Route History →
        </button>
      </div>
    </div>
  );
};
