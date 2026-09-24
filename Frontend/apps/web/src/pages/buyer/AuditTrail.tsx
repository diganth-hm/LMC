import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuditTrail } from '../../hooks/useBuyerQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, ArrowLeft, Users, Truck, Leaf, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { data: audit, isLoading, error, refetch } = useAuditTrail(batchId || '');
  const [expandedRecords, setExpandedRecords] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading) return <LoadingSkeleton variant="list" count={4} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!audit) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(audit.verificationHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(`/buyer/inventory/${batchId}`)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Batch Details
      </button>

      <div>
        <h1 className="text-xl font-bold text-gray-900">Verification / Audit Trail</h1>
        <p className="text-sm text-gray-500 mt-0.5">Full provenance and verification chain for this credit batch</p>
      </div>

      {/* 1. Verification Method Banner */}
      <div className="bg-gradient-to-r from-[#E1F5EE] to-[#d0f0e4] rounded-md border border-emerald-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8 text-[#0F6E56]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="verification">{audit.isoBadge}</Badge>
            </div>
            <h2 className="text-base font-bold text-gray-900">{audit.verificationStandard}</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Each delivery in this batch has been individually scored against a vehicle-specific baseline emission factor,
              verified by a third-party auditor, and aggregated into a certified carbon credit tonne.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Aggregation Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#F3F0F9] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#5B4B8A]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Contributing Riders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{audit.contributingRidersCount.toLocaleString()}</p>
        </Card>
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#FDF2EE] flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#D85A30]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Verified Deliveries</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{audit.totalDeliveriesCount.toLocaleString()}</p>
        </Card>
        <Card variant="stat">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-md bg-[#E1F5EE] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#0F6E56]" />
            </div>
            <span className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Total CO₂ Aggregated</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{(audit.totalCo2SavedKg / 1000).toFixed(1)} tonnes</p>
          <p className="text-xs text-gray-400">{audit.totalCo2SavedKg.toLocaleString()} kg</p>
        </Card>
      </div>

      {/* 3. Sample Delivery Records */}
      <div className="bg-white rounded-md border border-gray-200">
        <button
          onClick={() => setExpandedRecords(!expandedRecords)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-800 text-left">Sample Verified Delivery Records</h2>
            <p className="text-xs text-gray-400 text-left">{audit.sampleRecords.length} sample entries from {audit.totalDeliveriesCount.toLocaleString()} total</p>
          </div>
          {expandedRecords ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {expandedRecords && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">Delivery Ref</th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">Rider (Anonymized)</th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">Route Type</th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">CO₂ Saved</th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">Timestamp</th>
                  <th className="text-left py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">City</th>
                </tr>
              </thead>
              <tbody>
                {audit.sampleRecords.map((rec, idx) => (
                  <tr key={rec.id} className={`border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <td className="py-3 px-4 font-mono text-xs text-gray-700">{rec.deliveryRef}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">{rec.anonymizedRiderId}</td>
                    <td className="py-3 px-4"><Badge variant="status" status="green">{rec.routeType}</Badge></td>
                    <td className="py-3 px-4 text-xs font-semibold text-[#0F6E56]">{rec.co2SavedKg} kg</td>
                    <td className="py-3 px-4 text-xs text-gray-400">{rec.timestamp}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">{rec.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Verification Hash Footer */}
      <div className="bg-gray-900 rounded-md p-5">
        <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">Batch Verification Hash</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-sm font-mono text-emerald-400 break-all">{audit.verificationHash}</code>
          <button
            onClick={handleCopyHash}
            className="shrink-0 p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            title="Copy hash"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" themeAccent="coral" onClick={() => navigate(`/buyer/inventory/${batchId}`)}>
          Back to Batch Details
        </Button>
        <Button variant="primary" themeAccent="coral" onClick={() => navigate(`/buyer/inventory/${batchId}/purchase`)}>
          Proceed to Purchase
        </Button>
      </div>
    </div>
  );
};
