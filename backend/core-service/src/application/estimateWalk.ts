import { DomainError } from "../domain/errors";
import {
  estimateCaloriesKcal,
  MAX_DISTANCE_M,
  MIN_DISTANCE_M,
  type LatLng,
  type RouteProvider,
} from "../domain/walk";

export type EstimateInput = { origin: LatLng; destination: LatLng; weightKg: number };

export async function estimateWalk(routes: RouteProvider, input: EstimateInput) {
  const route = await routes.walkingRoute(input.origin, input.destination);
  if (!route || route.distanceM < MIN_DISTANCE_M || route.distanceM > MAX_DISTANCE_M) {
    throw new DomainError("ROUTE_NOT_FOUND", "Rute jalan kaki ke tujuan ini tidak tersedia.");
  }

  return {
    distanceM: Math.round(route.distanceM),
    durationMin: Math.round(route.durationSec / 60),
    estimatedCaloriesKcal: estimateCaloriesKcal(input.weightKg, route.durationSec),
    route: { provider: "osrm" as const, geometry: route.geometry },
  };
}