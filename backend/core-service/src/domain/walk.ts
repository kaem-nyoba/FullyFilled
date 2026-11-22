export type LatLng = { lat: number; lng: number };

export type RouteResult = {
  distanceM: number;
  durationSec: number;
  geometry: { type: "LineString"; coordinates: number[][] };
};

// Kontrak "penyedia rute". Domain hanya kenal ini, tidak kenal OSRM.
export interface RouteProvider {
  walkingRoute(origin: LatLng, destination: LatLng): Promise<RouteResult | null>;
}

export const MIN_DISTANCE_M = 200;
export const MAX_DISTANCE_M = 15000;
const WALKING_MET = 3.5; // MET jalan santai

export function estimateCaloriesKcal(weightKg: number, durationSec: number): number {
  return Math.round(WALKING_MET * weightKg * (durationSec / 3600));
}