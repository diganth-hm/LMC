import { env } from '../config/env';
import { ROUTE_CANDIDATES_COUNT } from '../config/constants';

export interface MapboxCandidateRoute {
  distanceKm: number;
  durationMin: number;
  congestionScore: number; // 0 (low) to 100 (high congestion)
  geometry?: string;
}

/**
 * Calculate approximate Haversine distance between two coordinates in km
 */
export function calculateHaversineDistance(
  pickupLat: number,
  pickupLng: number,
  dropLat: number,
  dropLng: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((dropLat - pickupLat) * Math.PI) / 180;
  const dLng = ((dropLng - pickupLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pickupLat * Math.PI) / 180) *
      Math.cos((dropLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(0.5, Math.round(R * c * 100) / 100);
}

/**
 * Fetch 3 candidate routes between pickup and drop points
 * Uses Mapbox Directions API if access token is available, otherwise uses deterministic fallback route generation.
 */
export async function getRouteCandidates(
  pickupLat: number,
  pickupLng: number,
  dropLat: number,
  dropLng: number
): Promise<MapboxCandidateRoute[]> {
  const baseDistance = calculateHaversineDistance(pickupLat, pickupLng, dropLat, dropLng);

  if (env.MAPBOX_ACCESS_TOKEN && env.MAPBOX_ACCESS_TOKEN !== 'mock_token') {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${pickupLng},${pickupLat};${dropLng},${dropLat}?alternatives=true&annotations=congestion,speed&access_token=${env.MAPBOX_ACCESS_TOKEN}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = (await response.json()) as { routes?: Array<{ distance: number; duration: number; geometry?: string }> };
        if (data.routes && data.routes.length > 0) {
          const mapboxRoutes: MapboxCandidateRoute[] = data.routes.slice(0, ROUTE_CANDIDATES_COUNT).map((r, idx) => ({
            distanceKm: Math.round((r.distance / 1000) * 100) / 100,
            durationMin: Math.round((r.duration / 60) * 10) / 10,
            congestionScore: Math.round((idx === 0 ? 25 : idx === 1 ? 15 : 65) + Math.random() * 10),
            geometry: r.geometry,
          }));

          // Ensure we always return 3 candidates
          while (mapboxRoutes.length < ROUTE_CANDIDATES_COUNT) {
            const mult = mapboxRoutes.length === 1 ? 1.15 : 1.35;
            mapboxRoutes.push({
              distanceKm: Math.round(baseDistance * mult * 100) / 100,
              durationMin: Math.round(((baseDistance * mult) / 20) * 60 * 10) / 10,
              congestionScore: mapboxRoutes.length === 1 ? 20 : 70,
            });
          }
          return mapboxRoutes;
        }
      }
    } catch (err) {
      console.warn('[MapboxClient] Falling back to deterministic route generator:', (err as Error).message);
    }
  }

  // Fallback candidate routes generator
  return [
    {
      distanceKm: Math.round(baseDistance * 1.05 * 100) / 100,
      durationMin: Math.round(((baseDistance * 1.05) / 25) * 60 * 10) / 10,
      congestionScore: 35,
    },
    {
      distanceKm: Math.round(baseDistance * 0.95 * 100) / 100,
      durationMin: Math.round(((baseDistance * 0.95) / 30) * 60 * 10) / 10,
      congestionScore: 15,
    },
    {
      distanceKm: Math.round(baseDistance * 1.30 * 100) / 100,
      durationMin: Math.round(((baseDistance * 1.30) / 18) * 60 * 10) / 10,
      congestionScore: 75,
    },
  ];
}
