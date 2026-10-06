import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TabLayout } from './layouts/TabLayout';

// ─── Eagerly loaded — the very first screen riders see ──────────────────────
import { Login } from './pages/Login';

// ─── Lazy-loaded chunks — only downloaded when navigated to ─────────────────
// Tab screens
const Dashboard        = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const WalletPage       = lazy(() => import('./pages/Wallet').then(m => ({ default: m.WalletPage })));
const CO2History       = lazy(() => import('./pages/CO2History').then(m => ({ default: m.CO2History })));
const Profile          = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));

// Delivery flow — all use MapComponent (Leaflet), split into their own chunks
const DeliveryAssignment  = lazy(() => import('./pages/DeliveryAssignment').then(m => ({ default: m.DeliveryAssignment })));
const RouteComparison     = lazy(() => import('./pages/RouteComparison').then(m => ({ default: m.RouteComparison })));
const RouteSelection      = lazy(() => import('./pages/RouteSelection').then(m => ({ default: m.RouteSelection })));
const LiveTracking        = lazy(() => import('./pages/LiveTracking').then(m => ({ default: m.LiveTracking })));
const DeliveryCompletion  = lazy(() => import('./pages/DeliveryCompletion').then(m => ({ default: m.DeliveryCompletion })));
const CO2Reveal           = lazy(() => import('./pages/CO2Reveal').then(m => ({ default: m.CO2Reveal })));
const Reward              = lazy(() => import('./pages/Reward').then(m => ({ default: m.Reward })));

// Secondary screens
const RouteHistory = lazy(() => import('./pages/RouteHistory').then(m => ({ default: m.RouteHistory })));
const GreenScore   = lazy(() => import('./pages/GreenScore').then(m => ({ default: m.GreenScore })));

// ─── Fallback spinner ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFAF7]">
      <div className="w-10 h-10 border-4 border-[#0F6E56] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: false } },
});

const basename = '/';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <div className="max-w-[430px] mx-auto min-h-screen bg-[#FBFAF7] relative shadow-2xl">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth — eager, shown immediately on app load */}
              <Route path="/login" element={<Login />} />
              <Route path="/login/rider" element={<Login />} />
              <Route path="/rider/login" element={<Login />} />

              {/* Tab screens */}
              <Route element={<TabLayout />}>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/co2-history" element={<CO2History />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Delivery flow (no tabs) — Leaflet/map heavy, split per page */}
              <Route path="/delivery/assignment" element={<DeliveryAssignment />} />
              <Route path="/delivery/route-comparison" element={<RouteComparison />} />
              <Route path="/delivery/route-selection" element={<RouteSelection />} />
              <Route path="/delivery/live-tracking" element={<LiveTracking />} />
              <Route path="/delivery/completion" element={<DeliveryCompletion />} />
              <Route path="/delivery/co2-reveal" element={<CO2Reveal />} />
              <Route path="/delivery/reward" element={<Reward />} />

              {/* Secondary */}
              <Route path="/route-history" element={<RouteHistory />} />
              <Route path="/green-score" element={<GreenScore />} />

              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

