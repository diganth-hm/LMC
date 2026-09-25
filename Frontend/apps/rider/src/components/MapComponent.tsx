import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon URLs in bundler environments
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface RoutePolyline {
  id: string;
  name: string;
  color: string;
  isGreenest?: boolean;
  coordinates: [number, number][]; // [lat, lng]
}

interface MapComponentProps {
  pickup?: { lat: number; lng: number; name?: string };
  drop?: { lat: number; lng: number; name?: string };
  routes?: RoutePolyline[];
  selectedRouteId?: string;
  isTracking?: boolean;
  riderProgress?: number; // 0 to 1
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  pickup = { lat: 12.9141, lng: 74.8560, name: 'Pickup Location' },
  drop = { lat: 12.9341, lng: 74.8760, name: 'Drop Location' },
  routes = [],
  selectedRouteId,
  isTracking = false,
  riderProgress = 0,
  className = 'h-full w-full min-h-[250px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '***REMOVED***';

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([pickup.lat, pickup.lng], 13);

    mapInstanceRef.current = map;

    // Trigger invalidateSize to ensure tiles render across container bounds
    const resizeTimer1 = setTimeout(() => map.invalidateSize(), 50);
    const resizeTimer2 = setTimeout(() => map.invalidateSize(), 250);

    const hasValidMapboxToken = MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.') && !MAPBOX_TOKEN.includes('sample');
    const tileUrl = hasValidMapboxToken
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      tileSize: hasValidMapboxToken ? 512 : 256,
      zoomOffset: hasValidMapboxToken ? -1 : 0,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom HTML icons
    const pickupIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background-color: #0F6E56; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          <span style="color: white; font-weight: bold; font-size: 14px;">P</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const dropIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          <span style="color: white; font-weight: bold; font-size: 14px;">D</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const bounds = L.latLngBounds([]);

    // Add Pickup & Drop Markers
    if (pickup.lat && pickup.lng) {
      L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>Pickup:</b> ${pickup.name || 'Vendor'}`);
      bounds.extend([pickup.lat, pickup.lng]);
    }

    if (drop.lat && drop.lng) {
      L.marker([drop.lat, drop.lng], { icon: dropIcon })
        .addTo(map)
        .bindPopup(`<b>Drop:</b> ${drop.name || 'Customer Address'}`);
      bounds.extend([drop.lat, drop.lng]);
    }

    // Default route polyline if routes prop is empty
    const effectiveRoutes: RoutePolyline[] = routes.length > 0
      ? routes
      : [
          {
            id: 'default-route',
            name: 'Green Route',
            color: '#0F6E56',
            coordinates: [
              [pickup.lat, pickup.lng],
              [pickup.lat + (drop.lat - pickup.lat) * 0.4, pickup.lng + (drop.lng - pickup.lng) * 0.2],
              [pickup.lat + (drop.lat - pickup.lat) * 0.7, pickup.lng + (drop.lng - pickup.lng) * 0.8],
              [drop.lat, drop.lng],
            ],
          },
        ];

    // Render Polylines
    effectiveRoutes.forEach((route) => {
      const isSelected = selectedRouteId ? route.id === selectedRouteId : route.isGreenest || route.color === '#0F6E56';
      const weight = isSelected ? 6 : 4;
      const opacity = isSelected ? 0.9 : 0.4;

      const polyline = L.polyline(route.coordinates, {
        color: route.color || '#0F6E56',
        weight,
        opacity,
        dashArray: isSelected ? undefined : '6, 6',
      }).addTo(map);

      route.coordinates.forEach((coord) => bounds.extend(coord));

      if (isSelected) {
        polyline.bringToFront();
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    // Live Rider Tracking Marker
    if (isTracking && effectiveRoutes.length > 0) {
      const activeRoute = effectiveRoutes.find((r) => r.id === selectedRouteId) || effectiveRoutes[0];
      const coords = activeRoute.coordinates;
      const startCoord = coords[0];

      const riderIcon = L.divIcon({
        className: 'rider-gps-marker',
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(15, 110, 86, 0.4); animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;"></div>
            <div style="background-color: #0F6E56; width: 28px; height: 28px; border-radius: 50%; display: flex; items-center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 2;">
              <span style="font-size: 14px;">🛵</span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const riderMarker = L.marker(startCoord, { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
      riderMarkerRef.current = riderMarker;
    }

    return () => {
      clearTimeout(resizeTimer1);
      clearTimeout(resizeTimer2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickup.lat, pickup.lng, drop.lat, drop.lng, selectedRouteId, isTracking]);

  // Update Rider position during live tracking
  useEffect(() => {
    if (!isTracking || !riderMarkerRef.current || routes.length === 0) return;
    const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
    const coords = activeRoute.coordinates;
    if (coords.length < 2) return;

    const totalSegments = coords.length - 1;
    const progressSegment = riderProgress * totalSegments;
    const segmentIdx = Math.min(Math.floor(progressSegment), totalSegments - 1);
    const segmentSubProgress = progressSegment - segmentIdx;

    const p1 = coords[segmentIdx];
    const p2 = coords[segmentIdx + 1];

    const currentLat = p1[0] + (p2[0] - p1[0]) * segmentSubProgress;
    const currentLng = p1[1] + (p2[1] - p1[1]) * segmentSubProgress;

    riderMarkerRef.current.setLatLng([currentLat, currentLng]);
  }, [riderProgress, isTracking, selectedRouteId, routes]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full rounded-b-xl overflow-hidden shadow-inner" style={{ minHeight: '260px' }} />
    </div>
  );
};
