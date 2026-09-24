import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBatchDetails } from '../../hooks/useBuyerQueries';
import { useBuyerPurchaseStore } from '../../store/buyerPurchaseStore';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, MapPin, Users, Truck, Calendar, ArrowLeft, Eye } from 'lucide-react';

export const CreditBatchDetail: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { data: batch, isLoading, error, refetch } = useBatchDetails(batchId || '');
  const setSelectedBatch = useBuyerPurchaseStore((s) => s.setSelectedBatch);
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing'>('overview');

  if (isLoading) return <LoadingSkeleton variant="card" count={2} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!batch) return null;

  const handleBuyNow = () => {
    setSelectedBatch(batch);
    navigate(`/buyer/inventory/${batch.id}/purchase`);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/buyer/inventory')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Inventory
      </button>

      {/* Batch header */}
      <div className="bg-white rounded-md border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="verification">
                <ShieldCheck className="w-3 h-3" /> {batch.verificationStatus}
              </Badge>
              <Badge variant="status" status="purple">{batch.verificationStandard}</Badge>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{batch.title}</h1>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5" /> {batch.region} · {batch.sourcePeriod}
            </div>
            <p className="text-sm text-gray-600 mt-3">{batch.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold text-[#D85A30]">₹{batch.pricePerTonneRupees.toLocaleString()}</p>
            <p className="text-xs text-gray-400">per tonne</p>
            <p className="text-lg font-bold text-gray-900 mt-2">{batch.availableTonnes} <span className="text-sm font-normal text-gray-500">tonnes available</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{batch.contributingRidersCount.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">riders</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{batch.totalDeliveriesCount.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">deliveries</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{batch.issueDate}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">issued</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{batch.verificationHash.slice(0, 12)}…</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">hash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200">
        {(['overview', 'pricing'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'text-[#D85A30] border-[#D85A30]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Batch Overview</h3>
            <p className="text-sm text-gray-600">
              This batch aggregates verified CO₂ emission avoidances from {batch.contributingRidersCount.toLocaleString()} delivery riders
              completing {batch.totalDeliveriesCount.toLocaleString()} deliveries across {batch.region} during {batch.sourcePeriod}.
              Each delivery's route choice was individually scored and verified under {batch.verificationStandard}.
            </p>
          </Card>
          <Button variant="outline" themeAccent="coral" onClick={() => navigate(`/buyer/inventory/${batch.id}/audit-trail`)}>
            <Eye className="w-4 h-4 mr-2" /> View Full Audit Trail
          </Button>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Standard', range: '1–5 tonnes', price: '₹2,200', discount: '', popular: false },
            { name: 'Bulk ESG', range: '6–20 tonnes', price: '₹2,050', discount: '6.8% off', popular: true },
            { name: 'Enterprise', range: '21+ tonnes', price: '₹1,900', discount: '13.6% off', popular: false },
          ].map((tier) => (
            <Card key={tier.name} variant={tier.popular ? 'elevated' : 'basic'} className={tier.popular ? 'ring-2 ring-[#D85A30] border-[#D85A30]' : ''}>
              {tier.popular && <Badge variant="status" status="coral" className="mb-3">Best Value</Badge>}
              <h3 className="text-sm font-semibold text-gray-900">{tier.name} Tier</h3>
              <p className="text-xs text-gray-400 mb-3">{tier.range}</p>
              <p className="text-2xl font-bold text-gray-900">{tier.price}<span className="text-xs font-normal text-gray-400">/tonne</span></p>
              {tier.discount && <p className="text-xs text-emerald-600 font-medium mt-1">{tier.discount}</p>}
            </Card>
          ))}
        </div>
      )}

      {/* Sticky buy now */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{batch.availableTonnes} tonnes available at ₹{batch.pricePerTonneRupees.toLocaleString()}/t</p>
        </div>
        <Button variant="primary" themeAccent="coral" size="lg" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
};
