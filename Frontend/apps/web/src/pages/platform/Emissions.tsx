import React from 'react';
import { useEmissionsStats } from '../../hooks/usePlatformQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Leaf, TreePine, TrendingDown } from 'lucide-react';

export const Emissions: React.FC = () => {
  const { data: emissions, isLoading, error, refetch } = useEmissionsStats();

  if (isLoading) return <LoadingSkeleton variant="chart" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const totalBaseline = (emissions || []).reduce((s, e) => s + e.baselineKg, 0);
  const totalActual = (emissions || []).reduce((s, e) => s + e.actualKg, 0);
  const totalSaved = totalBaseline - totalActual;
  const reductionPct = totalBaseline > 0 ? ((totalSaved / totalBaseline) * 100).toFixed(1) : '0';
  const treeEquiv = Math.round(totalSaved / 21.77);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">CO₂ Emissions & Savings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Baseline vs actual fleet emissions — the core sustainability metric</p>
      </div>

      {/* Area chart */}
      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Baseline vs Actual CO₂ (kg)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={emissions || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#ccc" />
              <YAxis tick={{ fontSize: 11 }} stroke="#ccc" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Area type="monotone" dataKey="baselineKg" stroke="#d4d4d8" fill="#f4f4f5" strokeWidth={1.5} name="Baseline (kg)" />
              <Area type="monotone" dataKey="actualKg" stroke="#5B4B8A" fill="#F3F0F9" strokeWidth={2} name="Actual (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#E1F5EE] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#0F6E56]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Total CO₂ Saved</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(totalSaved / 1000).toFixed(1)} tonnes</p>
        </Card>
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#F3F0F9] flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#5B4B8A]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">% Reduction</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{reductionPct}%</p>
        </Card>
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#E1F5EE] flex items-center justify-center">
              <TreePine className="w-4 h-4 text-[#0F6E56]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Tree Equivalent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{treeEquiv.toLocaleString()} trees</p>
        </Card>
      </div>
    </div>
  );
};
