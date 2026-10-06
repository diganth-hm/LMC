import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ProtectedRoute } from './components/ProtectedRoute';
import RiderRedirect from './components/RiderRedirect';

// ─── Eagerly loaded — shown on first paint ──────────────────────────────────
import HomePage from './pages/landing/HomePage';
import IntroSplash from './components/landing/IntroSplash';

// ─── Lazy-loaded chunks ──────────────────────────────────────────────────────
const InstallLanding       = lazy(() => import('./pages/landing/InstallLanding'));
const Login                = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));

// Platform Admin pages
const PlatformLayout       = lazy(() => import('./layouts/PlatformLayout').then(m => ({ default: m.PlatformLayout })));
const DashboardOverview    = lazy(() => import('./pages/platform/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const FleetAnalytics       = lazy(() => import('./pages/platform/FleetAnalytics').then(m => ({ default: m.FleetAnalytics })));
const Emissions            = lazy(() => import('./pages/platform/Emissions').then(m => ({ default: m.Emissions })));
const Leaderboard          = lazy(() => import('./pages/platform/Leaderboard').then(m => ({ default: m.Leaderboard })));
const DeliveryAnalytics    = lazy(() => import('./pages/platform/DeliveryAnalytics').then(m => ({ default: m.DeliveryAnalytics })));
const Billing              = lazy(() => import('./pages/platform/Billing').then(m => ({ default: m.Billing })));
const Reports              = lazy(() => import('./pages/platform/Reports').then(m => ({ default: m.Reports })));

// Corporate Buyer pages
const BuyerLayout          = lazy(() => import('./layouts/BuyerLayout').then(m => ({ default: m.BuyerLayout })));
const BuyerDashboard       = lazy(() => import('./pages/buyer/BuyerDashboard').then(m => ({ default: m.BuyerDashboard })));
const CreditInventory      = lazy(() => import('./pages/buyer/CreditInventory').then(m => ({ default: m.CreditInventory })));
const CreditBatchDetail    = lazy(() => import('./pages/buyer/CreditBatchDetail').then(m => ({ default: m.CreditBatchDetail })));
const AuditTrail           = lazy(() => import('./pages/buyer/AuditTrail').then(m => ({ default: m.AuditTrail })));
const QuantitySelection    = lazy(() => import('./pages/buyer/QuantitySelection').then(m => ({ default: m.QuantitySelection })));
const PurchaseFlow         = lazy(() => import('./pages/buyer/PurchaseFlow').then(m => ({ default: m.PurchaseFlow })));
const PurchaseConfirmation = lazy(() => import('./pages/buyer/PurchaseConfirmation').then(m => ({ default: m.PurchaseConfirmation })));
const PurchaseHistory      = lazy(() => import('./pages/buyer/PurchaseHistory').then(m => ({ default: m.PurchaseHistory })));
const CertificateView      = lazy(() => import('./pages/buyer/Certificate').then(m => ({ default: m.CertificateView })));
const ImpactSummary        = lazy(() => import('./pages/buyer/ImpactSummary').then(m => ({ default: m.ImpactSummary })));
const BuyerSettings        = lazy(() => import('./pages/buyer/BuyerSettings').then(m => ({ default: m.BuyerSettings })));

// ─── Fallback spinner ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Landing & Home — eager, no extra chunk */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/install" element={<InstallLanding />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Rider App — separate SPA on :5174 */}
            <Route path="/rider" element={<RiderRedirect />} />
            <Route path="/rider/*" element={<RiderRedirect />} />

            {/* Platform Admin Dashboard */}
            <Route
              path="/admin"
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

            {/* Corporate Buyer Portal */}
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
              <Route path="purchase/:orderId" element={<PurchaseFlow />} />
              <Route path="purchase/:orderId/confirmation" element={<PurchaseConfirmation />} />
              <Route path="history" element={<PurchaseHistory />} />
              <Route path="certificates/:certId" element={<CertificateView />} />
              <Route path="impact" element={<ImpactSummary />} />
              <Route path="settings" element={<BuyerSettings />} />
            </Route>

            {/* Default fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
