import React, { useState } from 'react';
import { useWalletBalance, useWalletTransactions, useWeeklyEarnings, useWithdrawBonus, useRiderProfile } from '../hooks/useRiderQueries';
import { Wallet as WalletIcon, ArrowUpRight, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export const WalletPage: React.FC = () => {
  const { data: balance } = useWalletBalance();
  const { data: transactions, isLoading } = useWalletTransactions();
  const { data: weeklyData } = useWeeklyEarnings();
  const { data: profile } = useRiderProfile();
  const withdrawMutation = useWithdrawBonus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('guru@upi');
  const [successPayout, setSuccessPayout] = useState<{ payoutId: string; amountInr: number; newBalance: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentBalance = balance || 3218;

  const handleOpenModal = () => {
    setWithdrawAmount(String(currentBalance));
    setUpiId(profile?.payoutAccount || 'guru@upi');
    setErrorMsg('');
    setSuccessPayout(null);
    setIsModalOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setErrorMsg('Enter a valid withdrawal amount');
      return;
    }
    if (amt > currentBalance) {
      setErrorMsg('Amount exceeds current wallet balance');
      return;
    }
    setErrorMsg('');

    withdrawMutation.mutate(
      { amount: amt, upiId },
      {
        onSuccess: (data) => {
          setSuccessPayout(data);
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          setErrorMsg(apiErr?.message || 'Withdrawal failed. Please check your balance.');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] pb-20">
      {/* Balance card */}
      <div className="bg-[#0F6E56] px-5 pt-12 pb-8 rounded-b-[24px]">
        <div className="flex items-center gap-2 mb-2">
          <WalletIcon className="w-5 h-5 text-white/70" />
          <span className="text-sm text-white/70">Wallet Balance</span>
        </div>
        <p className="text-4xl font-bold text-white">₹{currentBalance.toLocaleString()}</p>
        <button
          onClick={handleOpenModal}
          className="mt-4 px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-md hover:bg-white/30 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <ArrowUpRight className="w-4 h-4" /> Instant Payout
        </button>
      </div>

      {/* Weekly earnings chart */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">This Week's Earnings</h2>
        <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData || []}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis hide />
                <Bar dataKey="amount" fill="#0F6E56" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Recent Rewards & Payouts</h2>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse" />)}</div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No rewards yet. Complete a green delivery to start earning!</div>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-white rounded-md border border-gray-100 p-3 flex items-center justify-between shadow-xs">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {tx.type === 'withdrawal' ? 'Instant UPI Payout' : 'Green Bonus'}
                  </p>
                  <p className="text-xs text-gray-400">{tx.date} · {tx.deliveryRef || 'RazorpayX'}</p>
                </div>
                <p className={`text-sm font-bold ${tx.type === 'withdrawal' ? 'text-amber-600' : 'text-[#0F6E56]'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}₹{tx.amountRupees.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instant Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!successPayout ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#E1F5EE] flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-[#0F6E56]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Instant UPI Payout</h3>
                    <p className="text-[11px] text-gray-500">Powered by RazorpayX Payouts</p>
                  </div>
                </div>

                <div className="space-y-3.5 my-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Withdrawal Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40"
                      placeholder="Enter amount"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Available balance: ₹{currentBalance.toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      Destination UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40"
                      placeholder="e.g. guru@upi"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleConfirmWithdrawal}
                  disabled={withdrawMutation.isPending}
                  className="w-full py-3 bg-[#0F6E56] text-white font-bold rounded-md hover:bg-[#0c5945] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {withdrawMutation.isPending && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  Transfer ₹{withdrawAmount || '0'} to UPI
                </button>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-3 text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Payout Processed! 🎉</h3>
                <p className="text-xs text-gray-500 mt-1">
                  ₹{successPayout.amountInr} transferred to <strong>{upiId}</strong>
                </p>

                <div className="bg-gray-50 rounded-lg p-3 my-4 text-left space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between"><span className="text-gray-400">Payout ID:</span><span className="font-mono font-bold text-gray-800">{successPayout.payoutId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Status:</span><span className="font-bold text-emerald-700">PROCESSED ✓</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">New Balance:</span><span className="font-bold text-gray-800">₹{successPayout.newBalance.toLocaleString()}</span></div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 bg-[#0F6E56] text-white font-semibold rounded-md text-sm hover:bg-[#0c5945] transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
