import React, { useState } from 'react';
import { useRouteHistory } from '../hooks/useRiderQueries';
import { Leaf, MapPin } from 'lucide-react';

export const RouteHistory: React.FC = () => {
  const { data: history, isLoading } = useRouteHistory();
  const [filter, setFilter] = useState<'all' | 'green'>('all');

  const filtered = filter === 'green' ? (history || []).filter(h => h.routeType === 'Green') : (history || []);

  return (
    <div className="min-h-screen bg-[#FBFAF7] pb-20">
      <div className="px-5 pt-12 mb-4">
        <h1 className="text-xl font-bold text-gray-900">Route History</h1>
        <p className="text-sm text-gray-500 mt-0.5">Past deliveries and route choices</p>
      </div>

      {/* Filter chips */}
      <div className="px-5 mb-4 flex gap-2">
        {(['all', 'green'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-[#0F6E56] text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            {f === 'green' && <Leaf className="w-3 h-3 inline mr-1" />}{f === 'all' ? 'All routes' : 'Green only'}
          </button>
        ))}
      </div>

      <div className="px-5">
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-md animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No deliveries yet</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-md border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{item.date}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.routeType === 'Green' ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-gray-100 text-gray-500'}`}>
                    {item.routeType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{item.distanceKm} km</span>
                    <span className="flex items-center gap-1 text-[#0F6E56] font-medium"><Leaf className="w-3 h-3" />{item.co2SavedKg} kg</span>
                  </div>
                  <p className="text-sm font-bold text-[#0F6E56]">+₹{item.rewardRupees.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
