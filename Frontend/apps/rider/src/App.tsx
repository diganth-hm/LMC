import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TabLayout } from './layouts/TabLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DeliveryAssignment } from './pages/DeliveryAssignment';
import { RouteComparison } from './pages/RouteComparison';
import { RouteSelection } from './pages/RouteSelection';
import { LiveTracking } from './pages/LiveTracking';
import { DeliveryCompletion } from './pages/DeliveryCompletion';
import { CO2Reveal } from './pages/CO2Reveal';
import { Reward } from './pages/Reward';
import { WalletPage } from './pages/Wallet';
import { CO2History } from './pages/CO2History';
import { RouteHistory } from './pages/RouteHistory';
import { Profile } from './pages/Profile';
import { GreenScore } from './pages/GreenScore';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="max-w-[430px] mx-auto min-h-screen bg-[#FBFAF7] relative shadow-2xl">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Tab screens */}
            <Route element={<TabLayout />}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/co2-history" element={<CO2History />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Delivery flow (no tabs) */}
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
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
