import React from 'react';
import { useInvoices } from '../../hooks/usePlatformQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Download, CreditCard } from 'lucide-react';

export const Billing: React.FC = () => {
  const { data: invoices, isLoading, error, refetch } = useInvoices();

  if (isLoading) return <LoadingSkeleton variant="card" count={2} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const current = invoices?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Rewards / Billing</h1>
        <p className="text-sm text-gray-500 mt-0.5">SaaS billing and rider green bonus payouts</p>
      </div>

      {/* Current invoice summary */}
      {current && (
        <Card variant="elevated" className="bg-gradient-to-br from-[#5B4B8A] to-[#7c6bab] text-white border-none">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70 mb-1">Current Billing Period</p>
              <h2 className="text-lg font-bold">{current.period}</h2>
              <p className="text-sm text-white/80 mt-1">
                {current.riderCount.toLocaleString()} riders × ₹{current.ratePerRider} = <strong>₹{current.amountRupees.toLocaleString()}</strong>
              </p>
            </div>
            <div className="text-right">
              <Badge variant="status" status={current.status === 'Paid' ? 'green' : current.status === 'Pending' ? 'amber' : 'coral'}>
                {current.status}
              </Badge>
              <p className="text-xs text-white/60 mt-2">Green bonuses paid: ₹{current.bonusPayoutTotalRupees.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Invoice history table */}
      <div className="bg-white rounded-md border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Invoice History</h2>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Payment method on file</span>
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'period', header: 'Period', render: (item) => <span className="font-medium">{(item as Record<string, unknown>).period as string}</span> },
            { key: 'riderCount', header: 'Riders' },
            { key: 'amountRupees', header: 'Amount', render: (item) => <span className="font-semibold">₹{((item as Record<string, unknown>).amountRupees as number).toLocaleString()}</span> },
            { key: 'status', header: 'Status', render: (item) => {
              const status = (item as Record<string, unknown>).status as string;
              return <Badge variant="status" status={status === 'Paid' ? 'green' : status === 'Pending' ? 'amber' : 'coral'}>{status}</Badge>;
            }},
            { key: 'bonusPayoutTotalRupees', header: 'Rider Bonuses', render: (item) => <span className="text-gray-500">₹{((item as Record<string, unknown>).bonusPayoutTotalRupees as number).toLocaleString()}</span> },
            { key: 'actions', header: '', render: () => (
              <Button variant="tertiary" size="sm" className="text-[#5B4B8A]">
                <Download className="w-3.5 h-3.5 mr-1" /> Invoice
              </Button>
            )},
          ]}
          data={invoices || []}
        />
      </div>
    </div>
  );
};
