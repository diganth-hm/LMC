import React from 'react';
import { useWalletBalance, useWalletTransactions, useWeeklyEarnings } from '../hooks/useRiderQueries';
import { Wallet as WalletIcon, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export const WalletPage: React.FC = () => {
  const { data: balance } = useWalletBalance();
  const { data: transactions, isLoading } = useWalletTransactions();
  const { data: weeklyData } = useWeeklyEarnings();

  return (
    <div className="min-h-screen bg-[#FBFAF7] pb-20">
      {/* Balance card */}
      <div className="bg-[#0F6E56] px-5 pt-12 pb-8 rounded-b-[24px]">
        <div className="flex items-center gap-2 mb-2">
          <WalletIcon className="w-5 h-5 text-white/70" />
          <span className="text-sm text-white/70">Wallet Balance</span>
        </div>
        <p className="text-4xl font-bold text-white">₹{(balance || 3218).toLocaleString()}</p>
        <button className="mt-4 px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 transition-colors flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
        </button>
      </div>

      {/* Weekly earnings chart */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">This Week's Earnings</h2>
        <div className="bg-white rounded-md border border-gray-200 p-4">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData || []}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#ccc" />
                <YAxis hide />
                <Bar dataKey="amount" fill="#0F6E56" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Recent Rewards</h2>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse" />)}</div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No rewards yet. Complete a green delivery to start earning!</div>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-white rounded-md border border-gray-100 p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">Green Bonus</p>
                  <p className="text-xs text-gray-400">{tx.date} · {tx.deliveryRef}</p>
                </div>
                <p className="text-sm font-bold text-[#0F6E56]">+₹{tx.amountRupees.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
