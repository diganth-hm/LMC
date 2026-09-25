import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutes, useDeliveryAssignment } from '../hooks/useRiderQueries';
import { useDeliveryStore } from '../store/deliveryStore';
import { ArrowLeft, Leaf, Clock, MapPin, Fuel } from 'lucide-react';
import { MapComponent, RoutePolyline } from '../components/MapComponent';

export const RouteComparison: React.FC = () => {
  const navigate = useNavigate();
  const storeAssignment = useDeliveryStore(s => s.currentAssignment);
  const selectedRoute = useDeliveryStore(s => s.selectedRoute);
  const setSelectedRoute = useDeliveryStore(s => s.setSelectedRoute);
  
  const { data: fetchedAssignment } = useDeliveryAssignment();
  const assignment = storeAssignment || fetchedAssignment;

  const { data: routes, isLoading } = useRoutes(assignment?.id || '');

  const pickupLat = 12.9141;
  const pickupLng = 74.8560;
  const dropLat = 12.9341;
  const dropLng = 74.8760;

  // Convert routes into polyline data for MapComponent
  const polylineRoutes: RoutePolyline[] = (routes || []).map((r, idx) => {
    // Generate curved coordinates between pickup and drop
    const offsetFactor = (idx - 1) * 0.008;
    const midLat = pickupLat + (dropLat - pickupLat) * 0.5 + offsetFactor;
    const midLng = pickupLng + (dropLng - pickupLng) * 0.5 - offsetFactor;
    return {
      id: r.id,
      name: r.name,
      color: r.color || (idx === 0 ? '#0F6E56' : idx === 1 ? '#3b82f6' : '#f59e0b'),
      isGreenest: r.grsScore >= 75 || r.isGreenest,
      coordinates: [
        [pickupLat, pickupLng],
        [midLat, midLng],
        [dropLat, dropLng],
      ],
    };
  });

  // Determine highest GRS route ID for badge
  const topGrsRouteId = (routes || []).reduce(
    (maxId, r) => (r.grsScore > ((routes || []).find((x) => x.id === maxId)?.grsScore || 0) ? r.id : maxId),
    routes?.[0]?.id || ''
  );

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col">
      <div className="absolute top-3 left-3 z-30">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-gray-700 hover:bg-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      {/* Map Component with Polylines */}
      <div className="h-[38vh] relative">
        <MapComponent
          pickup={{ lat: pickupLat, lng: pickupLng, name: assignment?.pickupName || 'Pickup' }}
          drop={{ lat: dropLat, lng: dropLng, name: 'Drop' }}
          routes={polylineRoutes}
          selectedRouteId={selectedRoute?.id}
          className="h-full w-full"
        />
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 px-4 pointer-events-none">
          {(routes || []).map((r) => (
            <div key={r.id} className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold shadow text-gray-800">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
              {r.name.split('—')[0].trim()}
            </div>
          ))}
        </div>
      </div>

      {/* Route cards */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-4 relative z-10 px-5 pt-5 pb-24">
        <h2 className="text-base font-bold text-gray-900 mb-1">Choose Your Route</h2>
        <p className="text-xs text-gray-500 mb-4">Tap a route to see details. Green route saves more CO₂.</p>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-md animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {(routes || []).map(route => {
              const isGreenestRoute = route.id === topGrsRouteId;
              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`w-full text-left p-4 rounded-md border-2 transition-all duration-200 ${
                    selectedRoute?.id === route.id
                      ? 'border-[#0F6E56] bg-[#E1F5EE] shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                      <span className="text-sm font-semibold text-gray-900">{route.name}</span>
                    </div>
                    {isGreenestRoute && (
                      <span className="text-[10px] font-bold uppercase bg-[#0F6E56] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Leaf className="w-2.5 h-2.5" /> Greenest
                      </span>
                    )}
                  </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-600">{route.distanceKm} km</span></div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-600">{route.durationMin} min</span></div>
                  <div className="flex items-center gap-1"><Leaf className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-600">{route.co2Kg} kg</span></div>
                  <div className="flex items-center gap-1"><Fuel className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-600">₹{route.fuelCostRupees}</span></div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400">GRS Score</span>
                    <span className="font-bold" style={{ color: route.color }}>{route.grsScore}/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${route.grsScore}%`, backgroundColor: route.color }} />
                  </div>
                </div>
              </button>
            );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button
          onClick={() => selectedRoute && navigate('/delivery/route-selection')}
          disabled={!selectedRoute}
          className="w-full py-3.5 bg-[#0F6E56] text-white font-semibold rounded-md disabled:opacity-40 transition-colors text-base"
        >
          {selectedRoute ? `Select ${selectedRoute.name.split('—')[0].trim()}` : 'Choose a route'}
        </button>
      </div>
    </div>
  );
};
