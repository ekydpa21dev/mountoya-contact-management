'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ICON_OPTIONS = {
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
};

interface MapClientProps {
  position: [number, number];
  height?: string;
  interactive?: boolean;
  zoom?: number;
  mapClassName?: string;
  containerClassName?: string;
}

interface MapLifecycleProps {
  onReady: (map: LeafletMap) => void;
}

function MapLifecycle({ onReady }: MapLifecycleProps) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

function MapUpdater({ position, zoom, animate }: { position: [number, number]; zoom: number; animate: boolean }) {
  const map = useMap();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!map || !isMounted.current) return;

    const updateMap = () => {
      if (!isMounted.current) return;
      try {
        if (animate) {
          map.flyTo(position, zoom);
        } else {
          map.setView(position, zoom);
        }
      } catch (error) {
        console.warn('Error updating map view:', error);
      }
    };

    // Use requestAnimationFrame to ensure we're in a safe render state
    const rafId = requestAnimationFrame(updateMap);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [position, zoom, map, animate]);

  return null;
}

export default function MapClient({ position, height = '250px', interactive = false, zoom = 15, mapClassName, containerClassName }: MapClientProps) {
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const iconsPatched = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleMapReady = useCallback((map: LeafletMap) => {
    setMapInstance(map);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || iconsPatched.current) {
      return;
    }

    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions(ICON_OPTIONS);
      iconsPatched.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance) return;

    const invalidate = () => {
      try {
        mapInstance.invalidateSize();
      } catch {
        // ignore
      }
    };

    const resizeObserver = typeof window !== 'undefined' && 'ResizeObserver' in window ? new ResizeObserver(() => invalidate()) : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', invalidate);
    }

    const timer = setTimeout(invalidate, 150);

    return () => {
      clearTimeout(timer);
      resizeObserver?.disconnect();
      if (typeof window !== 'undefined' && !resizeObserver) {
        window.removeEventListener('resize', invalidate);
      }
    };
  }, [mapInstance]);

  const baseContainerClass = 'w-full rounded-md overflow-hidden border';
  const wrapperClassName = containerClassName ? `${baseContainerClass} ${containerClassName}` : baseContainerClass;

  return (
    <div ref={containerRef} className={wrapperClassName} style={{ height }}>
      <MapContainer
        key="map-client-container"
        className={mapClassName}
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
      >
        <MapUpdater position={position} zoom={zoom} animate={interactive} />
        <MapLifecycle onReady={handleMapReady} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
}
