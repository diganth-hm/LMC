import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryAssignment } from '../hooks/useRiderQueries';
import { useDeliveryStore } from '../store/deliveryStore';
import { MapPin, ArrowLeft, Leaf } from 'lucide-react';
import { MapComponent } from '../components/MapComponent';

export const DeliveryAssignment: React.FC = () => {
  const navigate = useNavigate();
  const { data: assignment, isLoading } = useDeliveryAssignment();
  const setAssignment = useDeliveryStore(s => s.setAssignment);

  const handleViewRoutes = () => {
    if (assignment) {
      setAssignment(assignment);
      navigate('/delivery/route-comparison');
    }
  };

  const pickupLat = 12.9141;
  const pickupLng = 74.8560;
  const dropLat = 12.9341;
  const dropLng = 74.8760;

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col">
      <div className="absolute top-3 left-3 z-30">
        <button onClick={() => navigate('/home')} className="flex items-center gap-1 text-xs font-semibold bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-gray-700 hover:bg-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      {/* Map component */}
      <div className="h-[42vh] relative">
        <MapComponent
          pickup={{ lat: pickupLat, lng: pickupLng, name: assignment?.pickupName || 'Machali Kitchen' }}
          drop={{ lat: dropLat, lng: dropLng, name: 'Customer Location' }}
          className="h-full w-full"
        />
      </div>

      {/* Delivery details card */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-6 relative z-10 px-5 pt-6 pb-24">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-64" />
            <div className="h-4 bg-gray-100 rounded w-40" />
          </div>
        ) : assignment ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F6E56] bg-[#E1F5EE] px-2 py-0.5 rounded-full">New Delivery</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mt-2">{assignment.pickupName}</h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center mt-0.5 shrink-0">
                  <MapPin className="w-4 h-4 text-[#0F6E56]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Pickup</p>
                  <p className="text-sm text-gray-800">{assignment.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mt-0.5 shrink-0">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Drop</p>
                  <p className="text-sm text-gray-800">{assignment.dropAddress}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-5 py-3 border-t border-gray-100">
              <div><p className="text-lg font-bold text-gray-900">{assignment.distanceKm} km</p><p className="text-[10px] text-gray-400">Distance</p></div>
              <div><p className="text-lg font-bold text-gray-900">₹{assignment.baseFeeRupees}</p><p className="text-[10px] text-gray-400">Base fee</p></div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#0F6E56] bg-[#E1F5EE] px-3 py-2 rounded-md">
              <Leaf className="w-3.5 h-3.5 animate-pulse" />
              <span>Calculating green routes...</span>
            </div>
          </>
        ) : null}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button
          onClick={handleViewRoutes}
          disabled={isLoading}
          className="w-full py-3.5 bg-[#0F6E56] text-white font-semibold rounded-md disabled:opacity-40 hover:bg-[#0c5945] transition-colors text-base"
        >
          View Routes
        </button>
      </div>
    </div>
  );
};
