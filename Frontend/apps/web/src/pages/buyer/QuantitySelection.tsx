import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBatchDetails, usePricingTiers } from '../../hooks/useBuyerQueries';
import { useBuyerPurchaseStore } from '../../store/buyerPurchaseStore';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Minus, Plus, AlertTriangle } from 'lucide-react';

export const QuantitySelection: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { data: batch, isLoading: batchLoading } = useBatchDetails(batchId || '');
  const { data: tiers, isLoading: tiersLoading } = usePricingTiers();
  const { quantityTonnes, setQuantityTonnes, setSelectedBatch } = useBuyerPurchaseStore();

  useEffect(() => {
    if (batch) setSelectedBatch(batch);
  }, [batch, setSelectedBatch]);

  if (batchLoading || tiersLoading) return <LoadingSkeleton variant="card" count={2} />;
  if (!batch) return <ErrorState message="Batch not found" />;

  const activeTier = (tiers || []).find(
    (t) => quantityTonnes >= t.minTonnes && (t.maxTonnes === null || quantityTonnes <= t.maxTonnes)
  );
  const unitPrice = activeTier?.pricePerTonneRupees ?? batch.pricePerTonneRupees;
  const subtotal = quantityTonnes * unitPrice;
  const exceedsInventory = quantityTonnes > batch.availableTonnes;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(`/buyer/inventory/${batchId}`)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Batch Details
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900">Select Quantity</h1>
        <p className="text-sm text-gray-500 mt-0.5">{batch.title}</p>
      </div>

      <div className="max-w-lg mx-auto">
        <Card variant="elevated" className="p-8">
          {/* Quantity stepper */}
          <div className="text-center mb-6">
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500 mb-3">Tonnes to Purchase</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantityTonnes(Math.max(1, quantityTonnes - 1))}
                className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="number"
                min={1}
                max={batch.availableTonnes}
                value={quantityTonnes}
                onChange={(e) => setQuantityTonnes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 h-16 text-center text-3xl font-bold border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 focus:border-[#D85A30]"
              />
              <button
                onClick={() => setQuantityTonnes(Math.min(batch.availableTonnes, quantityTonnes + 1))}
                className="w-12 h-12 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">{batch.availableTonnes} tonnes available</p>
          </div>

          {/* Error */}
          {exceedsInventory && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-md p-3 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Quantity exceeds available inventory</span>
            </div>
          )}

          {/* Price breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Unit price</span>
              <span className="font-medium">₹{unitPrice.toLocaleString()} / tonne</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">× {quantityTonnes} tonnes</span>
            </div>
            {activeTier && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Applied tier</span>
                <Badge variant="status" status={activeTier.isPopular ? 'coral' : 'gray'}>{activeTier.name}</Badge>
              </div>
            )}
            {activeTier && activeTier.discountPct > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Discount</span>
                <span className="text-emerald-600 font-medium">-{activeTier.discountPct}%</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-base font-semibold text-gray-900">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <Button
            variant="primary"
            themeAccent="coral"
            size="lg"
            className="w-full mt-6"
            disabled={exceedsInventory || quantityTonnes < 1}
            onClick={() => navigate(`/buyer/inventory/${batchId}/purchase`, { state: { step: 'checkout' } })}
          >
            Proceed to Purchase
          </Button>
        </Card>
      </div>
    </div>
  );
};
