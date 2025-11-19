'use client';

import dynamic from 'next/dynamic';

interface MapViewProps {
  position: [number, number];
  name: string;
  height?: string;
  interactive?: boolean;
  zoom?: number;
  mapClassName?: string;
  containerClassName?: string;
}

const MapClient = dynamic<MapViewProps>(() => import('./MapClient').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-md overflow-hidden border flex items-center justify-center bg-gray-50" style={{ height: '200px' }}>
      <div className="text-gray-400">Memuat peta...</div>
    </div>
  )
});

export function MapView(props: MapViewProps) {
  return <MapClient {...props} />;
}
