import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePurchaseHistory } from '../../hooks/useBuyerQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { DataTable } from '../../components/ui/DataTable';
import { Download } from 'lucide-react';

export const PurchaseHistory: React.FC = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error, refetch } = usePurchaseHistory();

  if (isLoading) return <LoadingSkeleton variant="list" count={4} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!orders || orders.length === 0) return <EmptyState title="No purchases yet" description="Browse our carbon credit inventory to make your first offset purchase." actionLabel="Browse Inventory" onAction={() => navigate('/buyer/inventory')} themeAccent="coral" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Purchase History</h1>
        <p className="text-sm text-gray-500 mt-0.5">Complete record of all carbon credit purchases</p>
      </div>

      <div className="bg-white rounded-md border border-gray-200">
        <DataTable
          columns={[
            { key: 'timestamp', header: 'Date', render: (item) => <span className="text-sm">{(item as Record<string, unknown>).timestamp as string}</span> },
            { key: 'id', header: 'Order ID', render: (item) => <span className="font-mono text-xs text-gray-500">#{(item as Record<string, unknown>).id as string}</span> },
            { key: 'batchTitle', header: 'Batch', render: (item) => <span className="text-sm font-medium truncate max-w-[200px] block">{(item as Record<string, unknown>).batchTitle as string}</span> },
            { key: 'quantityTonnes', header: 'Tonnes', render: (item) => <span className="font-semibold">{(item as Record<string, unknown>).quantityTonnes as number}</span> },
            { key: 'subtotalRupees', header: 'Amount', render: (item) => <span className="font-semibold">₹{((item as Record<string, unknown>).subtotalRupees as number).toLocaleString()}</span> },
            { key: 'status', header: 'Status', render: (item) => {
              const status = (item as Record<string, unknown>).status as string;
              return <Badge variant="status" status={status === 'Completed' ? 'green' : status === 'Processing' ? 'amber' : 'coral'}>{status}</Badge>;
            }},
            { key: 'cert', header: '', render: (item) => (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/buyer/certificates/${(item as Record<string, unknown>).certificateId as string}`); }}
                className="text-xs text-[#D85A30] hover:underline font-medium flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Certificate
              </button>
            )},
          ]}
          data={orders}
          onRowClick={(item) => navigate(`/buyer/certificates/${(item as Record<string, unknown>).certificateId as string}`)}
        />
      </div>
    </div>
  );
};
