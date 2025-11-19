import { API_ENDPOINTS } from '@/constants';

export interface GeocodingResponse {
  display_name?: string;
  address?: {
    'ISO3166-2-lvl3': string;
    'ISO3166-2-lvl4': string;
    city: string;
    city_block: string;
    country: string;
    country_code: string;
    display_name: string;
    neighbourhood: string;
    postcode: string;
    region: string;
    road: string;
    suburb: string;
  };
}

/**
 * Fetches address information from coordinates using reverse geocoding
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResponse> {
  const response = await fetch(`${API_ENDPOINTS.NOMINATIM_REVERSE}?format=json&lat=${lat}&lon=${lng}`);
  const data = await response.json();
  return data;
}

/**
 * Fetches a formatted address string from coordinates
 */
export async function fetchAddress(lat: number, lng: number): Promise<string> {
  try {
    const data = await reverseGeocode(lat, lng);
    if (data.display_name) {
      return data.display_name;
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    // Return coordinates as fallback
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}
