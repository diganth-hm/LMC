import React from 'react';
import { useCityStats } from '../../hooks/usePlatformQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const FleetAnalytics: React.FC = () => {
  const { data: cities, isLoading, error, refetch } = useCityStats();

  if (isLoading) return <LoadingSkeleton variant="chart" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const chartData = (cities || []).map((c) => ({ name: c.name, co2: (c.co2SavedKg / 1000).toFixed(1), riders: c.activeRiders }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Fleet / City Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Performance breakdown by city and region</p>
      </div>

      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">CO₂ Saved by City (tonnes)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#ccc" />
              <YAxis tick={{ fontSize: 11 }} stroke="#ccc" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="co2" fill="#5B4B8A" radius={[4, 4, 0, 0]} name="CO₂ Saved (t)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">City Breakdown</h2>
        </div>
        <DataTable
          columns={[
            { key: 'name', header: 'City', sortable: true },
            { key: 'activeRiders', header: 'Active Riders', sortable: true, render: (item) => <span className="font-medium">{(item as Record<string, unknown>).activeRiders as number}</span> },
            { key: 'co2SavedKg', header: 'CO₂ Saved (kg)', sortable: true, render: (item) => <span>{((item as Record<string, unknown>).co2SavedKg as number).toLocaleString()} kg</span> },
            { key: 'avgGRS', header: 'Avg GRS', sortable: true },
            { key: 'greenAdoptionPct', header: 'Green Adoption', sortable: true, render: (item) => (
              <Badge variant="status" status={(item as Record<string, unknown>).greenAdoptionPct as number >= 80 ? 'green' : 'amber'}>
                {(item as Record<string, unknown>).greenAdoptionPct as number}%
              </Badge>
            )},
          ]}
          data={cities || []}
        />
      </div>
    </div>
  );
};
