import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBuyerPurchaseStore } from '../../store/buyerPurchaseStore';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Award, ArrowRight } from 'lucide-react';

export const PurchaseConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { completedOrder, resetPurchaseFlow } = useBuyerPurchaseStore();
  const order = completedOrder;

  const handleViewCertificate = () => {
    if (order?.certificateId) {
      navigate(`/buyer/certificates/${order.certificateId}`);
    }
  };

  const handleBackToDashboard = () => {
    resetPurchaseFlow();
    navigate('/buyer');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md text-center space-y-6">
        {/* Success animation stand-in */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 mx-auto flex items-center justify-center animate-bounce">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Purchase Confirmed!</h1>
          <p className="text-sm text-gray-500">Your carbon credit purchase has been processed successfully.</p>
        </div>

        {order ? (
          <div className="bg-white rounded-md border border-gray-200 p-5 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-medium text-gray-900">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">{order.quantityTonnes} tonnes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-gray-900">₹{order.subtotalRupees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="text-gray-700">{order.timestamp}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="text-gray-700">{order.paymentMethod}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-md border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Order #{orderId} confirmed</p>
          </div>
        )}

        <div className="space-y-3">
          <Button variant="primary" themeAccent="coral" size="lg" className="w-full" onClick={handleViewCertificate}>
            <Award className="w-4 h-4 mr-2" /> View Certificate
          </Button>
          <Button variant="tertiary" className="w-full" onClick={handleBackToDashboard}>
            Back to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
