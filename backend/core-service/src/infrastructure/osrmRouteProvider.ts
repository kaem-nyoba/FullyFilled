import { config } from "../config";
import { DomainError } from "../domain/errors";
import type { LatLng, RouteProvider, RouteResult } from "../domain/walk";

type OsrmResponse = {
  code: string;
  routes?: {
    distance: number;
    duration: number;
    geometry: { type: "LineString"; coordinates: number[][] };
  }[];
};

export class OsrmRouteProvider implements RouteProvider {
  async walkingRoute(origin: LatLng, destination: LatLng): Promise<RouteResult | null> {
    // OSRM memakai urutan lng,lat (kebalikan dari kontrak kita)
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `${config.osrmBaseUrl}/route/v1/foot/${coords}?overview=simplified&geometries=geojson`;

    let res: Response;
    try {
      res = await fetch(url, {
        headers: { "User-Agent": "FullyFilled-TugasBesar/1.0" },
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new DomainError("ROUTING_UNAVAILABLE", "Layanan rute sedang sibuk, coba lagi nanti.");
    }

    const body = (await res.json().catch(() => null)) as OsrmResponse | null;
    if (body?.code === "Ok" && body.routes?.[0]) {
      const route = body.routes[0];
      return { distanceM: route.distance, durationSec: route.duration, geometry: route.geometry };
    }
    if (body?.code === "NoRoute" || body?.code === "NoSegment") return null;
    throw new DomainError("ROUTING_UNAVAILABLE", "Layanan rute sedang sibuk, coba lagi nanti.");
  }
}