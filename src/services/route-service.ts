import { findPlaceById, USER_LOCATION, type Place } from '@/data/places';
import { ApiError, ApiService, type WalkEstimate } from '@/services/ApiService';
export type RouteStepKind = 'straight' | 'turn-right' | 'arrive';

export type RouteStep = {
  id: string;
  kind: RouteStepKind;
  instruction: string;
  distanceMeters: number;
};

export type RouteResult = {
  placeId: string;
  destinationName: string;
  address: string;
  distanceMeters: number;
  /** Estimasi berjalan kaki, dalam menit. */
  minutes: number;
  caloriesKcal?: number;
  steps: RouteStep[];
  
};

export class RouteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RouteError';
  }
}

/** Lama "mencari rute" di prototipe (Figma 5a: otomatis 2,4 detik). */
export const ROUTE_DELAY_MS = 2400;

const WALKING_METERS_PER_MINUTE = 80;
/** Jalan kaki biasanya lebih panjang daripada garis lurus. */
const DETOUR_FACTOR = 1.7;
/** Tempat ini sengaja selalu gagal supaya layar "rute gagal" (Figma 5c) bisa dicoba. */
export const FAILING_PLACE_ID = 'klinik-sehat-citarum';

const roundTo50 = (meters: number) => Math.max(50, Math.round(meters / 50) * 50);

/** Menyusun rute contoh dari data tempat (fungsi murni, tanpa jaringan). */
export function buildRoute(place: Place): RouteResult {
  const total = roundTo50(place.distanceMeters * DETOUR_FACTOR);
  const first = roundTo50(total * 0.36);
  const second = roundTo50(total * 0.5);
  const last = Math.max(50, total - first - second);

  const districtStreet = `Jl. ${place.district.split(',')[0]}`;
  const destinationStreet = place.address.split(',')[0];

  return {
    placeId: place.id,
    destinationName: place.name,
    address: place.address,
    distanceMeters: total,
    minutes: Math.max(1, Math.round(total / WALKING_METERS_PER_MINUTE)),
    steps: [
      {
        id: 'straight',
        kind: 'straight',
        instruction: `Lurus di ${districtStreet}`,
        distanceMeters: first,
      },
      {
        id: 'turn',
        kind: 'turn-right',
        instruction: `Belok kanan ke ${destinationStreet}`,
        distanceMeters: second,
      },
      {
        id: 'arrive',
        kind: 'arrive',
        instruction: `${place.name} di sebelah kirimu`,
        distanceMeters: last,
      },
    ],
  };
}

type FetchRouteOptions = {
  signal?: AbortSignal;
  /** Berat pengguna untuk menghitung kalori. */
  weightKg?: number;
};

const DEFAULT_WEIGHT_KG = 65;

/** Memakai angka asli dari API, sementara teks langkah tetap dari rute contoh. */
function withApiEstimate(base: RouteResult, estimate: WalkEstimate): RouteResult {
  const scale = estimate.distanceM / base.distanceMeters;
  return {
    ...base,
    distanceMeters: estimate.distanceM,
    minutes: estimate.durationMin,
    caloriesKcal: estimate.estimatedCaloriesKcal,
    steps: base.steps.map((step) => ({
      ...step,
      distanceMeters: roundTo50(step.distanceMeters * scale),
    })),
  };
}

/** Mengambil rute jalan kaki dari core service FullyFilled (POST /walk-plans/estimate). */
export async function fetchRoute(
  placeId: string,
  { signal, weightKg = DEFAULT_WEIGHT_KG }: FetchRouteOptions = {},
): Promise<RouteResult> {
  const place = findPlaceById(placeId);
  if (!place) throw new RouteError('Tempat tidak ditemukan.');
  if (place.id === FAILING_PLACE_ID) throw new RouteError('Layanan rute tidak merespons.');

  try {
    const estimate = await ApiService.estimateWalk(
      USER_LOCATION,
      { lat: place.lat, lng: place.lng },
      weightKg,
      signal,
    );
    return withApiEstimate(buildRoute(place), estimate);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error instanceof ApiError) throw new RouteError(error.message);
    throw error;
  }
}