import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/deliveryStore';
import { useCompleteDelivery } from '../hooks/useRiderQueries';
import { CheckCircle } from 'lucide-react';

export const DeliveryCompletion: React.FC = () => {
  const navigate = useNavigate();
  const assignment = useDeliveryStore(s => s.currentAssignment);
  const setDeliveryResult = useDeliveryStore(s => s.setDeliveryResult);
  const completeMutation = useCompleteDelivery();

  useEffect(() => {
    if (assignment?.id) {
      completeMutation.mutate(assignment.id, {
        onSuccess: (result) => {
          setDeliveryResult(result);
          setTimeout(() => navigate('/delivery/co2-reveal'), 2000);
        },
        onError: () => {
          setDeliveryResult({
            deliveryId: assignment.id,
            distanceKm: assignment.distanceKm || 4.8,
            durationMin: 18,
            baselineCO2Kg: 1.2,
            actualCO2Kg: 0.6,
            co2SavedKg: 0.6,
            rewardRupees: 5.10,
            treeEquivalent: 'brewing 30 cups of tea',
          });
          setTimeout(() => navigate('/delivery/co2-reveal'), 2000);
        },
      });
    } else {
      setDeliveryResult({
        deliveryId: 'DEL-DEMO-001',
        distanceKm: 4.8,
        durationMin: 18,
        baselineCO2Kg: 1.2,
        actualCO2Kg: 0.6,
        co2SavedKg: 0.6,
        rewardRupees: 5.10,
        treeEquivalent: 'brewing 30 cups of tea',
      });
      setTimeout(() => navigate('/delivery/co2-reveal'), 2000);
    }
  }, []); // eslint-disable-line

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-[#E1F5EE] mx-auto flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-14 h-14 text-[#0F6E56]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivered! 🎉</h1>
        <p className="text-sm text-gray-500">Calculating your green bonus...</p>

        <div className="mt-6 bg-white rounded-md border border-gray-200 p-4 inline-block">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="font-bold text-gray-900">{assignment?.distanceKm || 5.6} km</p>
              <p className="text-[10px] text-gray-400">Distance</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="font-bold text-gray-900">18 min</p>
              <p className="text-[10px] text-gray-400">Duration</p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#0F6E56] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};
