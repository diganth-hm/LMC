import React from 'react';
import { useBuyerImpact } from '../../hooks/useBuyerQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TreePine, Car, Leaf, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const ImpactSummary: React.FC = () => {
  const { data: impact, isLoading, error, refetch } = useBuyerImpact();

  if (isLoading) return <LoadingSkeleton variant="chart" />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!impact || impact.totalTonnesPurchased === 0) return <EmptyState title="No impact data yet" description="Purchase carbon credits to see your environmental impact story here." themeAccent="coral" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Impact Summary</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your organization's cumulative environmental impact</p>
        </div>
        <Button variant="outline" themeAccent="coral" size="sm">
          <Download className="w-3.5 h-3.5 mr-1" /> Export Summary
        </Button>
      </div>

      {/* Headline stat */}
      <div className="bg-gradient-to-br from-[#D85A30] to-[#e87a56] rounded-lg p-8 text-white text-center">
        <p className="text-sm text-white/70 uppercase tracking-wider mb-2">Total CO₂ Offset to Date</p>
        <p className="text-6xl font-bold">{impact.totalTonnesPurchased}</p>
        <p className="text-xl mt-1">Tonnes CO₂e</p>
      </div>

      {/* Equivalences */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="stat" className="text-center">
          <TreePine className="w-10 h-10 text-[#0F6E56] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{impact.equivalentTreesPlanted.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Trees Planted Equivalent</p>
        </Card>
        <Card variant="stat" className="text-center">
          <Car className="w-10 h-10 text-[#5B4B8A] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{impact.equivalentCarsOffRoad}</p>
          <p className="text-xs text-gray-500">Cars Off Road for 1 Year</p>
        </Card>
        <Card variant="stat" className="text-center">
          <Leaf className="w-10 h-10 text-[#D85A30] mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{impact.activeCertificatesCount}</p>
          <p className="text-xs text-gray-500">Active Certificates</p>
        </Card>
      </div>

      {/* Purchase trend */}
      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Purchase Trend Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={impact.purchaseHistoryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#ccc" />
              <YAxis tick={{ fontSize: 11 }} stroke="#ccc" label={{ value: 'Tonnes', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="tonnes" fill="#D85A30" radius={[4, 4, 0, 0]} name="Tonnes Purchased" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
