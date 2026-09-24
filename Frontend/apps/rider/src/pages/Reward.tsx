import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';
import { CheckCircle, Wallet } from 'lucide-react';

export const Reward: React.FC = () => {
  const navigate = useNavigate();
  const result = useDeliveryStore(s => s.deliveryResult);
  const resetDelivery = useDeliveryStore(s => s.resetDelivery);

  const handleHome = () => { resetDelivery(); navigate('/home'); };
  const handleWallet = () => { resetDelivery(); navigate('/wallet'); };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Confetti-like decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-40 animate-bounce"
            style={{
              backgroundColor: ['#0F6E56', '#f59e0b', '#D85A30', '#5B4B8A'][i % 4],
              left: `${10 + (i * 7.5)}%`,
              top: `${15 + Math.sin(i) * 20}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1.5 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10 max-w-sm">
        <div className="w-20 h-20 rounded-full bg-[#E1F5EE] mx-auto flex items-center justify-center mb-4">
          <span className="text-4xl">🎉</span>
        </div>

        <p className="text-sm text-gray-500 mb-1">Green Bonus Earned</p>
        <p className="text-5xl font-bold text-[#0F6E56] mb-2">₹{result?.rewardRupees || 5.10}</p>

        <div className="flex items-center justify-center gap-2 text-sm text-[#0F6E56] bg-[#E1F5EE] px-4 py-2 rounded-full mb-6">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Paid instantly to your wallet</span>
        </div>

        <p className="text-xs text-gray-400 mb-8">
          Delivery #{result?.deliveryId || 'DEL-99301'} · Today's total: ₹92
        </p>

        <div className="space-y-3">
          <button onClick={handleHome} className="w-full py-3.5 bg-[#0F6E56] text-white font-semibold rounded-md text-base hover:bg-[#0c5945] transition-colors">
            Back to Home
          </button>
          <button onClick={handleWallet} className="w-full py-3 border border-[#0F6E56] text-[#0F6E56] font-medium rounded-md text-sm hover:bg-[#E1F5EE] transition-colors flex items-center justify-center gap-2">
            <Wallet className="w-4 h-4" /> View Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
