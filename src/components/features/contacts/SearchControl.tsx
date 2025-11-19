'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

interface SearchControlProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export function SearchControl({ onLocationSelect }: SearchControlProps) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: 'bar',
      showMarker: false, // We use our own marker
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Cari lokasi...',
    });

    map.addControl(searchControl);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleShowLocation = (e: any) => {
      onLocationSelect(e.location.y, e.location.x);
    };

    map.on('geosearch/showlocation', handleShowLocation);

    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleShowLocation);
    };
  }, [map, onLocationSelect]);

  return null;
}
