import React, { useEffect } from 'react';

/**
 * RiderRedirect — hard-redirects the browser to the Rider App.
 * The Rider App is a separate Vite SPA running on its own port (5174).
 * A client-side redirect is the correct approach since it can't be proxied as an SPA.
 */
export const RiderRedirect: React.FC = () => {
  useEffect(() => {
    // Determine the rider app URL based on current environment
    const riderPort = 5174;
    const riderUrl = `${window.location.protocol}//${window.location.hostname}:${riderPort}/login`;
    window.location.replace(riderUrl);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFAF7]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#0F6E56] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Launching Rider App…</p>
      </div>
    </div>
  );
};

export default RiderRedirect;
