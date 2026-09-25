import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';
import { ArrowLeft, Leaf, MapPin, Clock, Fuel, DollarSign } from 'lucide-react';
import { MapComponent } from '../components/MapComponent';

export const RouteSelection: React.FC = () => {
  const navigate = useNavigate();
  const route = useDeliveryStore(s => s.selectedRoute);
  const setIsTracking = useDeliveryStore(s => s.setIsTracking);

  if (!route) { navigate(-1); return null; }

  const handleStart = () => {
    setIsTracking(true);
    navigate('/delivery/live-tracking');
  };

  const pickupLat = 12.9141;
  const pickupLng = 74.8560;
  const dropLat = 12.9341;
  const dropLng = 74.8760;

  const polylineRoute = {
    id: route.id,
    name: route.name,
    color: route.color || '#0F6E56',
    coordinates: [
      [pickupLat, pickupLng] as [number, number],
      [pickupLat + 0.01, pickupLng + 0.01] as [number, number],
      [dropLat, dropLng] as [number, number],
    ],
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col">
      <div className="absolute top-3 left-3 z-30">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-gray-700 hover:bg-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      {/* Map with single route */}
      <div className="h-[40vh] relative">
        <MapComponent
          pickup={{ lat: pickupLat, lng: pickupLng, name: 'Pickup' }}
          drop={{ lat: dropLat, lng: dropLng, name: 'Drop' }}
          routes={[polylineRoute]}
          selectedRouteId={route.id}
          className="h-full w-full"
        />
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-xs font-bold" style={{ color: route.color }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: route.color }} />
            {route.name}
          </div>
        </div>
      </div>

      {/* Route summary */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-4 relative z-10 px-5 pt-6 pb-28">
        <h2 className="text-base font-bold text-gray-900 mb-1">Confirm Route</h2>
        {route.isGreenest && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-[#0F6E56] text-white px-2 py-0.5 rounded-full mb-3">
            <Leaf className="w-2.5 h-2.5" /> Greenest Route
          </span>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-md p-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div><p className="text-sm font-bold">{route.distanceKm} km</p><p className="text-[10px] text-gray-400">Distance</p></div>
          </div>
          <div className="bg-gray-50 rounded-md p-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div><p className="text-sm font-bold">{route.durationMin} min</p><p className="text-[10px] text-gray-400">Duration</p></div>
          </div>
          <div className="bg-[#E1F5EE] rounded-md p-3 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#0F6E56]" />
            <div><p className="text-sm font-bold text-[#0F6E56]">{route.co2Kg} kg</p><p className="text-[10px] text-gray-400">CO₂</p></div>
          </div>
          <div className="bg-gray-50 rounded-md p-3 flex items-center gap-2">
            <Fuel className="w-4 h-4 text-gray-400" />
            <div><p className="text-sm font-bold">₹{route.fuelCostRupees}</p><p className="text-[10px] text-gray-400">Est. fuel</p></div>
          </div>
        </div>

        <div className="mt-5 bg-[#E1F5EE] rounded-md p-4 flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-[#0F6E56]" />
          <div>
            <p className="text-sm font-semibold text-[#0F6E56]">Estimated Green Bonus</p>
            <p className="text-xs text-gray-600">₹3 – ₹8 depending on conditions</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button onClick={handleStart} className="w-full py-3.5 bg-[#0F6E56] text-white font-bold rounded-md text-base hover:bg-[#0c5945] transition-colors">
          Start Delivery
        </button>
      </div>
    </div>
  );
};
