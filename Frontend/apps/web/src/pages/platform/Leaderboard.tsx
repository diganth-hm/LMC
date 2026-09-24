import React, { useState } from 'react';
import { useRiderLeaderboard } from '../../hooks/usePlatformQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Search } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { data: riders, isLoading, error, refetch } = useRiderLeaderboard();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'co2SavedKg' | 'greenAdoptionPct' | 'totalDeliveries'>('co2SavedKg');

  if (isLoading) return <LoadingSkeleton variant="list" count={5} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const filtered = (riders || [])
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Rider Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ranked by green performance across the fleet</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search riders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5B4B8A]/30 focus:border-[#5B4B8A] bg-white"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5B4B8A]/30"
        >
          <option value="co2SavedKg">Sort by CO₂ Saved</option>
          <option value="greenAdoptionPct">Sort by Green Adoption %</option>
          <option value="totalDeliveries">Sort by Total Deliveries</option>
        </select>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No riders match your search</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((rider, idx) => (
              <div key={rider.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                <span className={`text-sm font-bold w-8 text-center ${rider.rank <= 3 ? 'text-[#5B4B8A]' : 'text-gray-400'}`}>
                  #{rider.rank}
                </span>
                <img src={rider.avatarUrl} alt={rider.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{rider.name}</p>
                  <p className="text-xs text-gray-400">{rider.city}</p>
                </div>
                <Badge variant="tier" tier={rider.tier}>{rider.tier}</Badge>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{rider.co2SavedKg} kg</p>
                  <p className="text-xs text-gray-400">CO₂ saved</p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">{rider.greenAdoptionPct}%</p>
                  <p className="text-xs text-gray-400">green routes</p>
                </div>
                <div className="hidden lg:block text-right">
                  <p className="text-sm text-gray-600">{rider.totalDeliveries}</p>
                  <p className="text-xs text-gray-400">deliveries</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
