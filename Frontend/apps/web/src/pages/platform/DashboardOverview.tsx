import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Leaf, DollarSign, Target } from 'lucide-react';
import { KPICard } from '../../components/platform/KPICard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { useFleetOverview, useEmissionsStats, useRiderLeaderboard } from '../../hooks/usePlatformQueries';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { data: overview, isLoading, error, refetch } = useFleetOverview();
  const { data: emissions } = useEmissionsStats();
  const { data: leaders } = useRiderLeaderboard();

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!overview) return null;

  const chartData = emissions?.slice(-14).map((e, i) => ({ name: `Day ${i + 1}`, saved: e.savedKg })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fleet-wide sustainability performance</p>
        </div>
        <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-600">
          Last 30 Days
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Riders"
          value={overview.activeRiders.toLocaleString()}
          trend={overview.riderTrend}
          trendLabel="vs prev"
          icon={<Users className="w-4 h-4 text-[#5B4B8A]" />}
          accentColor="bg-[#F3F0F9]"
          onClick={() => navigate('/platform/fleet-analytics')}
        />
        <KPICard
          label="CO₂ Saved"
          value={`${overview.totalCO2SavedTonnes} t`}
          trend={overview.co2Trend}
          trendLabel="vs prev"
          icon={<Leaf className="w-4 h-4 text-[#0F6E56]" />}
          accentColor="bg-[#E1F5EE]"
          onClick={() => navigate('/platform/emissions')}
        />
        <KPICard
          label="Green Bonuses Paid"
          value={`₹${(overview.totalGreenBonusesPaidRupees / 1000).toFixed(0)}K`}
          trend={overview.bonusTrend}
          trendLabel="vs prev"
          icon={<DollarSign className="w-4 h-4 text-[#854F0B]" />}
          accentColor="bg-[#FEF3C7]"
          onClick={() => navigate('/platform/billing')}
        />
        <KPICard
          label="Avg GRS Score"
          value={overview.avgGRSScore}
          trend={overview.grsTrend}
          trendLabel="vs prev"
          icon={<Target className="w-4 h-4 text-[#5B4B8A]" />}
          accentColor="bg-[#F3F0F9]"
          onClick={() => navigate('/platform/leaderboard')}
        />
      </div>

      {/* Chart + Mini Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CO₂ Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-md border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">CO₂ Saved Trend (kg)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#ccc" />
                <YAxis tick={{ fontSize: 11 }} stroke="#ccc" />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  formatter={(value: number) => [`${value.toFixed(0)} kg`, 'CO₂ Saved']}
                />
                <Line type="monotone" dataKey="saved" stroke="#5B4B8A" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div className="bg-white rounded-md border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Top Riders</h2>
            <button onClick={() => navigate('/platform/leaderboard')} className="text-xs text-[#5B4B8A] hover:underline font-medium">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {(leaders || []).slice(0, 5).map((rider) => (
              <div key={rider.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">#{rider.rank}</span>
                <img src={rider.avatarUrl} alt={rider.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{rider.name}</p>
                  <p className="text-xs text-gray-400">{rider.co2SavedKg} kg saved</p>
                </div>
                <Badge variant="tier" tier={rider.tier}>{rider.tier}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
