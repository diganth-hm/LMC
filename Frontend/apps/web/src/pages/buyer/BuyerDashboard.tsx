import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePurchaseHistory, useBuyerImpact } from '../../hooks/useBuyerQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TreePine, Car, Award, ArrowRight } from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: impact, isLoading, error, refetch } = useBuyerImpact();
  const { data: orders } = usePurchaseHistory();

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!impact) return <EmptyState title="Make your first purchase" description="Browse our verified carbon credit inventory to offset your organization's emissions." actionLabel="Browse Inventory" onAction={() => navigate('/buyer/inventory')} themeAccent="coral" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manipal Group ESG Solutions — offset position at a glance</p>
        </div>
        <Button variant="primary" themeAccent="coral" onClick={() => navigate('/buyer/inventory')}>
          Browse Inventory <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#FDF2EE] flex items-center justify-center">
              <span className="text-lg">🏭</span>
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Total Purchased</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{impact.totalTonnesPurchased} tonnes</p>
        </Card>
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#E1F5EE] flex items-center justify-center">
              <TreePine className="w-4 h-4 text-[#0F6E56]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Equivalent Impact</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{impact.equivalentTreesPlanted.toLocaleString()} trees</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Car className="w-3 h-3" /> {impact.equivalentCarsOffRoad} cars off road for a year</p>
        </Card>
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#FDF2EE] flex items-center justify-center">
              <Award className="w-4 h-4 text-[#D85A30]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Active Certificates</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{impact.activeCertificatesCount}</p>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-md border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h2>
        {(orders || []).length === 0 ? (
          <p className="text-sm text-gray-400">No purchases yet</p>
        ) : (
          <div className="space-y-3">
            {(orders || []).slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.batchTitle}</p>
                  <p className="text-xs text-gray-400">{order.timestamp} · Order #{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{order.quantityTonnes} tonnes</p>
                  <p className="text-xs text-gray-400">₹{order.subtotalRupees.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
