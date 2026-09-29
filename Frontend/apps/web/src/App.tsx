import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PlatformLayout } from './layouts/PlatformLayout';
import { BuyerLayout } from './layouts/BuyerLayout';

import HomePage from './pages/landing/HomePage';
import InstallLanding from './pages/landing/InstallLanding';
import IntroSplash from './components/landing/IntroSplash';

import { Login } from './pages/auth/Login';
import { DashboardOverview } from './pages/platform/DashboardOverview';
import { FleetAnalytics } from './pages/platform/FleetAnalytics';
import { Emissions } from './pages/platform/Emissions';
import { Leaderboard } from './pages/platform/Leaderboard';
import { DeliveryAnalytics } from './pages/platform/DeliveryAnalytics';
import { Billing } from './pages/platform/Billing';
import { Reports } from './pages/platform/Reports';

import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { CreditInventory } from './pages/buyer/CreditInventory';
import { CreditBatchDetail } from './pages/buyer/CreditBatchDetail';
import { AuditTrail } from './pages/buyer/AuditTrail';
import { QuantitySelection } from './pages/buyer/QuantitySelection';
import { PurchaseFlow } from './pages/buyer/PurchaseFlow';
import { PurchaseConfirmation } from './pages/buyer/PurchaseConfirmation';
import { PurchaseHistory } from './pages/buyer/PurchaseHistory';
import { CertificateView } from './pages/buyer/Certificate';
import { ImpactSummary } from './pages/buyer/ImpactSummary';
import { BuyerSettings } from './pages/buyer/BuyerSettings';

import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <IntroSplash />
        <Routes>
          {/* Landing & Home */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/install" element={<InstallLanding />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Platform Dashboard */}
          <Route
            path="/platform"
            element={
              <ProtectedRoute allowedRoles={['platform_admin']}>
                <PlatformLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="fleet-analytics" element={<FleetAnalytics />} />
            <Route path="emissions" element={<Emissions />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="delivery-analytics" element={<DeliveryAnalytics />} />
            <Route path="billing" element={<Billing />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Buyer Portal */}
          <Route
            path="/buyer"
            element={
              <ProtectedRoute allowedRoles={['corporate_buyer']}>
                <BuyerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<BuyerDashboard />} />
            <Route path="inventory" element={<CreditInventory />} />
            <Route path="inventory/:batchId" element={<CreditBatchDetail />} />
            <Route path="inventory/:batchId/audit-trail" element={<AuditTrail />} />
            <Route path="inventory/:batchId/purchase" element={<QuantitySelection />} />
            <Route path="purchase/:orderId/confirmation" element={<PurchaseConfirmation />} />
            <Route path="history" element={<PurchaseHistory />} />
            <Route path="certificates/:certId" element={<CertificateView />} />
            <Route path="impact" element={<ImpactSummary />} />
            <Route path="settings" element={<BuyerSettings />} />
          </Route>

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

