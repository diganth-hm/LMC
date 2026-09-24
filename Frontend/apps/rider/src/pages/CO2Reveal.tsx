import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';
import { Leaf } from 'lucide-react';

export const CO2Reveal: React.FC = () => {
  const navigate = useNavigate();
  const result = useDeliveryStore(s => s.deliveryResult);
  const [displayedValue, setDisplayedValue] = useState(0);
  const targetValue = result?.co2SavedKg || 0.6;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 2000;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedValue(Number((eased * targetValue).toFixed(2)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetValue]);

  const baselineWidth = 100;
  const actualWidth = result ? (result.actualCO2Kg / result.baselineCO2Kg) * 100 : 50;

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-[#E1F5EE] mx-auto flex items-center justify-center mb-6">
          <Leaf className="w-10 h-10 text-[#0F6E56]" />
        </div>

        <p className="text-sm text-gray-500 mb-2">You saved</p>
        <p className="text-6xl font-bold text-[#0F6E56] mb-1">{displayedValue}</p>
        <p className="text-xl font-semibold text-gray-600">kg CO₂</p>

        {/* Baseline vs actual comparison */}
        <div className="mt-8 space-y-3 text-left">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Baseline (default route)</span>
              <span className="font-medium">{result?.baselineCO2Kg || 1.2} kg</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-400 rounded-full" style={{ width: `${baselineWidth}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#0F6E56] font-medium">Your route (green)</span>
              <span className="font-medium text-[#0F6E56]">{result?.actualCO2Kg || 0.6} kg</span>
            </div>
            <div className="h-4 bg-[#E1F5EE] rounded-full overflow-hidden">
              <div className="h-full bg-[#0F6E56] rounded-full transition-all duration-1000" style={{ width: `${actualWidth}%` }} />
            </div>
          </div>
        </div>

        {/* Equivalence */}
        <div className="mt-6 bg-[#E1F5EE] rounded-md p-3 text-sm text-[#0F6E56]">
          ☕ = {result?.treeEquivalent || 'brewing 30 cups of tea'}
        </div>

        <button
          onClick={() => navigate('/delivery/reward')}
          className="mt-8 w-full py-3.5 bg-[#0F6E56] text-white font-semibold rounded-md text-base hover:bg-[#0c5945] transition-colors"
        >
          See Your Reward →
        </button>
      </div>
    </div>
  );
};
