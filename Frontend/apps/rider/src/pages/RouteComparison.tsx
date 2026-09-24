import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutes } from '../hooks/useRiderQueries';
import { useDeliveryStore } from '../store/deliveryStore';
import { ArrowLeft, Leaf, Clock, MapPin, Fuel } from 'lucide-react';

export const RouteComparison: React.FC = () => {
  const navigate = useNavigate();
  const assignment = useDeliveryStore(s => s.currentAssignment);
  const selectedRoute = useDeliveryStore(s => s.selectedRoute);
  const setSelectedRoute = useDeliveryStore(s => s.setSelectedRoute);
  const { data: routes, isLoading } = useRoutes(assignment?.id || '');

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 p-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Map with route polylines placeholder */}
      <div className="h-[35vh] bg-gradient-to-b from-[#E1F5EE] to-[#c8ead9] relative flex items-end justify-center pb-4">
        <div className="flex gap-2">
          {(routes || []).map(r => (
            <div key={r.id} className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-[10px] font-medium shadow-sm" style={{ color: r.color }}>
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
            {(routes || []).map(route => (
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
                  {route.isGreenest && (
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
            ))}
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
