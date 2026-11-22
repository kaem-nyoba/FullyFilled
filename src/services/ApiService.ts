const BASE_URL = 'https://inggrisbng2.stei.site/api';
const API_KEY = process.env.EXPO_PUBLIC_FULLYFILLED_API_KEY ?? '';
const TIMEOUT_MS = 10000;

export type LatLng = { lat: number; lng: number };

export type WalkEstimate = {
  distanceM: number;
  durationMin: number;
  estimatedCaloriesKcal: number;
  route: { provider: 'osrm'; geometry: { type: 'LineString'; coordinates: number[][] } };
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

async function request<T>(path: string, { method = 'GET', body, signal }: RequestOptions = {}): Promise<T> {
  // Batal kalau terlalu lama ATAU kalau pemanggil membatalkan (misalnya layar ditutup)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onCallerAbort = () => controller.abort();
  signal?.addEventListener('abort', onCallerAbort, { once: true });

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error; // dibatalkan pemanggil: teruskan apa adanya
    if (controller.signal.aborted) {
      throw new ApiError(0, 'TIMEOUT', 'Server terlalu lama merespons. Coba lagi sebentar.');
    }
    throw new ApiError(0, 'NETWORK_ERROR', 'Tidak bisa terhubung ke server. Periksa koneksi internetmu.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error?.code ?? 'UNKNOWN_ERROR',
      data?.error?.message ?? 'Terjadi kesalahan, coba lagi.',
    );
  }
  return data as T;
}

export const ApiService = {
  health: (signal?: AbortSignal) =>
    request<{ status: 'ok' | 'degraded'; database: 'ok' | 'down' }>('/health', { signal }),

  estimateWalk: (origin: LatLng, destination: LatLng, weightKg: number, signal?: AbortSignal) =>
    request<WalkEstimate>('/walk-plans/estimate', {
      method: 'POST',
      body: { origin, destination, weightKg },
      signal,
    }),
};