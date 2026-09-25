import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';
import { Leaf } from 'lucide-react';
import { MapComponent } from '../components/MapComponent';

export const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const route = useDeliveryStore(s => s.selectedRoute);
  const [co2Accumulated, setCo2Accumulated] = useState(0);
  const [distRemaining, setDistRemaining] = useState(route?.distanceKm || 5.6);
  const [arrived, setArrived] = useState(false);
  const [riderProgress, setRiderProgress] = useState(0);

  const initialDistance = route?.distanceKm || 5.6;

  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Accumulated(prev => {
        const next = Math.min(prev + 0.02, route?.co2Kg || 0.6);
        if (next >= (route?.co2Kg || 0.6) - 0.05) setArrived(true);
        return next;
      });
      setDistRemaining(prev => {
        const nextDist = Math.max(0, prev - 0.15);
        const progress = Math.min(1, 1 - (nextDist / initialDistance));
        setRiderProgress(progress);
        return nextDist;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [route, initialDistance]);

  const handleMarkDelivered = () => {
    navigate('/delivery/completion');
  };

  const pickupLat = 12.9141;
  const pickupLng = 74.8560;
  const dropLat = 12.9341;
  const dropLng = 74.8760;

  const activeRoute = {
    id: route?.id || 'live-route',
    name: route?.name || 'Green Route',
    color: route?.color || '#0F6E56',
    coordinates: [
      [pickupLat, pickupLng] as [number, number],
      [pickupLat + 0.01, pickupLng + 0.008] as [number, number],
      [dropLat, dropLng] as [number, number],
    ],
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col relative">
      {/* Full-screen map */}
      <div className="flex-1 relative min-h-[45vh]">
        <MapComponent
          pickup={{ lat: pickupLat, lng: pickupLng, name: 'Vendor' }}
          drop={{ lat: dropLat, lng: dropLng, name: 'Customer' }}
          routes={[activeRoute]}
          selectedRouteId={activeRoute.id}
          isTracking={true}
          riderProgress={riderProgress}
          className="h-full w-full absolute inset-0"
        />
        {/* Progress bar overlay on map */}
        <div className="absolute bottom-4 left-6 right-6 z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-md">
            <div className="flex justify-between text-[10px] font-bold text-gray-700 mb-1">
              <span>PROGRESS</span>
              <span>{Math.round(riderProgress * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0F6E56] rounded-full transition-all duration-300" style={{ width: `${riderProgress * 100}%` }} />
            </div>
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
