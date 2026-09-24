import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useBatchDetails, usePricingTiers, usePurchaseCredits } from '../../hooks/useBuyerQueries';
import { useBuyerPurchaseStore } from '../../store/buyerPurchaseStore';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, CreditCard, Building2, ShieldCheck, AlertCircle } from 'lucide-react';

export const PurchaseFlow: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckout = (location.state as { step?: string })?.step === 'checkout';
  const { data: batch } = useBatchDetails(batchId || '');
  const { data: tiers } = usePricingTiers();

  const { quantityTonnes, paymentMethod, setPaymentMethod, agreedToTerms, setAgreedToTerms, setCompletedOrder } = useBuyerPurchaseStore();
  const purchaseMutation = usePurchaseCredits();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  if (!batch) return <LoadingSkeleton variant="card" count={1} />;

  const activeTier = (tiers || []).find(
    (t) => quantityTonnes >= t.minTonnes && (t.maxTonnes === null || quantityTonnes <= t.maxTonnes)
  );
  const unitPrice = activeTier?.pricePerTonneRupees ?? batch.pricePerTonneRupees;
  const subtotal = quantityTonnes * unitPrice;

  // If not in checkout step, show quantity selection
  if (!isCheckout) {
    navigate(`/buyer/inventory/${batchId}/purchase`, { replace: true });
  }

  const handleConfirm = () => {
    setPurchaseError(null);
    purchaseMutation.mutate(
      { batchId: batch.id, quantityTonnes, paymentMethod },
      {
        onSuccess: (order) => {
          setCompletedOrder(order);
          navigate(`/buyer/purchase/${order.id}/confirmation`);
        },
        onError: () => {
          setPurchaseError('Payment processing failed. Please try again.');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900">Review & Purchase</h1>
        <p className="text-sm text-gray-500 mt-0.5">Final review before completing your carbon credit purchase</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Order summary */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Batch</span><span className="font-medium text-gray-900 text-right max-w-[60%] truncate">{batch.title}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Quantity</span><span className="font-medium">{quantityTonnes} tonnes</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Unit Price</span><span className="font-medium">₹{unitPrice.toLocaleString()}/t</span></div>
            {activeTier && activeTier.discountPct > 0 && (
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tier Discount</span><span className="text-emerald-600 font-medium">-{activeTier.discountPct}%</span></div>
            )}
            <div className="flex justify-between pt-3 mt-2 border-t border-gray-200">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Payment method */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Payment Method</h3>
          <div className="space-y-2">
            {[
              { value: 'Corporate Wire / RTGS', icon: Building2, label: 'Corporate Wire Transfer / RTGS' },
              { value: 'Corporate Credit Card', icon: CreditCard, label: 'Corporate Credit Card' },
            ].map(({ value, icon: Icon, label }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all ${paymentMethod === value ? 'border-[#D85A30] bg-[#FDF2EE]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                  className="accent-[#D85A30]"
                />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Terms */}
        <Card>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 accent-[#D85A30]"
            />
            <span className="text-sm text-gray-600">
              I agree to the <span className="text-[#D85A30] font-medium">Terms of Purchase</span> and acknowledge that carbon credits
              are verified under {batch.verificationStandard} and are non-refundable once a certificate is issued.
            </span>
          </label>
        </Card>

        {/* Error */}
        {purchaseError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-md p-4 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{purchaseError}</span>
            <Button variant="outline" size="sm" onClick={handleConfirm} className="ml-auto text-red-600 border-red-300">
              Retry
            </Button>
          </div>
        )}

        {/* Confirm */}
        <div className="flex items-center gap-2 bg-[#E1F5EE] rounded-md p-3 text-sm text-emerald-700">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Your purchase is protected by ISO 14064-2 verification</span>
        </div>

        <Button
          variant="primary"
          themeAccent="coral"
          size="lg"
          className="w-full"
          disabled={!agreedToTerms}
          isLoading={purchaseMutation.isPending}
          onClick={handleConfirm}
        >
          Confirm Purchase — ₹{subtotal.toLocaleString()}
        </Button>
      </div>
    </div>
  );
};
