import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreditInventory } from '../../hooks/useBuyerQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { MapPin, ShieldCheck } from 'lucide-react';

export const CreditInventory: React.FC = () => {
  const navigate = useNavigate();
  const { data: batches, isLoading, error, refetch } = useCreditInventory();

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!batches || batches.length === 0) return <EmptyState title="No inventory currently available" description="All credit batches have been sold out. Check back soon for new verified batches." themeAccent="coral" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Carbon Credit Inventory</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse and purchase verified carbon credit batches</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {batches.map((batch) => (
          <div
            key={batch.id}
            onClick={() => navigate(`/buyer/inventory/${batch.id}`)}
            className="bg-white rounded-md border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <Badge variant="verification">
                <ShieldCheck className="w-3 h-3" />
                {batch.verificationStatus}
              </Badge>
              <span className="text-lg font-bold text-[#D85A30]">₹{batch.pricePerTonneRupees.toLocaleString()}<span className="text-xs font-normal text-gray-400">/t</span></span>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#D85A30] transition-colors">{batch.title}</h3>

            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <MapPin className="w-3 h-3" />
              <span>{batch.region} · {batch.sourcePeriod}</span>
            </div>

            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{batch.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-lg font-bold text-gray-900">{batch.availableTonnes}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">tonnes available</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{batch.contributingRidersCount.toLocaleString()} riders</p>
                <p className="text-xs text-gray-500">{batch.totalDeliveriesCount.toLocaleString()} deliveries</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
