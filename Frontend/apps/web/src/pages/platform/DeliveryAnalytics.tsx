import React from 'react';
import { useDeliveryAnalytics } from '../../hooks/usePlatformQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Clock } from 'lucide-react';

export const DeliveryAnalytics: React.FC = () => {
  const { data, isLoading, error, refetch } = useDeliveryAnalytics();

  if (isLoading) return <LoadingSkeleton variant="chart" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const analytics = data || [];
  const avgGreenTime = analytics.length > 0 ? (analytics.reduce((s, d) => s + d.avgTimeGreenMin, 0) / analytics.length).toFixed(1) : '0';
  const avgDefaultTime = analytics.length > 0 ? (analytics.reduce((s, d) => s + d.avgTimeDefaultMin, 0) / analytics.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Delivery Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Operational view of delivery volume and route choice patterns</p>
      </div>

      {/* Delivery volume line chart */}
      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Deliveries Per Day</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#ccc" />
              <YAxis tick={{ fontSize: 11 }} stroke="#ccc" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="totalDeliveries" stroke="#5B4B8A" strokeWidth={2.5} dot={{ r: 4, fill: '#5B4B8A' }} name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Green vs Default bar chart */}
      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Green vs Default Route Adoption</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#ccc" />
              <YAxis tick={{ fontSize: 11 }} stroke="#ccc" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="greenDeliveries" fill="#0F6E56" radius={[4, 4, 0, 0]} name="Green Routes" stackId="stack" />
              <Bar dataKey="defaultDeliveries" fill="#d4d4d8" radius={[4, 4, 0, 0]} name="Default Routes" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Avg delivery time comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#E1F5EE] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#0F6E56]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Avg Green Route Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgGreenTime} min</p>
        </Card>
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Avg Default Route Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgDefaultTime} min</p>
        </Card>
      </div>
    </div>
  );
};
