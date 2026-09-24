import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';
import { Leaf, Navigation } from 'lucide-react';

export const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const route = useDeliveryStore(s => s.selectedRoute);
  const [co2Accumulated, setCo2Accumulated] = useState(0);
  const [distRemaining, setDistRemaining] = useState(route?.distanceKm || 5.6);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Accumulated(prev => {
        const next = Math.min(prev + 0.02, route?.co2Kg || 0.6);
        if (next >= (route?.co2Kg || 0.6) - 0.05) setArrived(true);
        return next;
      });
      setDistRemaining(prev => Math.max(0, prev - 0.15));
    }, 300);
    return () => clearInterval(interval);
  }, [route]);

  const handleMarkDelivered = () => {
    navigate('/delivery/completion');
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col relative">
      {/* Full-screen map */}
      <div className="flex-1 bg-gradient-to-b from-[#d0f0e4] to-[#E1F5EE] flex items-center justify-center relative">
        <div className="w-14 h-14 rounded-full bg-[#0F6E56] flex items-center justify-center shadow-lg animate-bounce">
          <Navigation className="w-7 h-7 text-white" />
        </div>
        {/* Route line visualization */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
            <div className="h-full bg-[#0F6E56] rounded-full transition-all duration-300" style={{ width: `${((1 - distRemaining / (route?.distanceKm || 5.6)) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Bottom bar with live CO₂ */}
      <div className="bg-white border-t border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E1F5EE] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-[#0F6E56]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F6E56]">{co2Accumulated.toFixed(2)} kg</p>
              <p className="text-[10px] text-gray-400 uppercase">CO₂ saved so far</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{distRemaining.toFixed(1)} km</p>
            <p className="text-[10px] text-gray-400 uppercase">remaining</p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mb-3">
          ETA: {Math.ceil(distRemaining * 3.4)} min
        </div>

        {arrived ? (
          <button onClick={handleMarkDelivered} className="w-full py-4 bg-[#0F6E56] text-white font-bold rounded-md text-lg hover:bg-[#0c5945] transition-colors">
            Mark Delivered ✓
          </button>
        ) : (
          <div className="w-full py-3 bg-gray-100 text-gray-400 font-medium rounded-md text-center text-sm">
            Tracking in progress...
          </div>
        )}
      </div>
    </div>
  );
};
