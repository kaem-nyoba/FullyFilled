export type PlaceCategory = 'Gym' | 'Taman' | 'Faskes';

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  /** Kecamatan dan kota, mis. "Cihapit, Bandung Wetan". */
  district: string;
  address: string;
  /** Jarak garis lurus dari lokasi pengguna, dalam meter. */
  distanceMeters: number;
};

export const SEARCH_RADIUS_KM = 2;
export const DEFAULT_LOCATION_LABEL = 'Dekat Cihapit, Bandung';

/**
 * Data contoh (mock) sampai terhubung ke layanan tempat sungguhan.
 * Gym sengaja kosong supaya layar "hasil kosong" (Figma 4b) bisa dicoba.
 */
export const PLACES: readonly Place[] = [
  {
    id: 'taman-lansia',
    name: 'Taman Lansia',
    category: 'Taman',
    district: 'Cihapit, Bandung Wetan',
    address: 'Jl. Cisangkuy, Cihapit, Bandung Wetan',
    distanceMeters: 650,
  },
  {
    id: 'taman-pustaka-bunga',
    name: 'Taman Pustaka Bunga',
    category: 'Taman',
    district: 'Citarum, Bandung Wetan',
    address: 'Jl. Taman Pustaka, Citarum, Bandung Wetan',
    distanceMeters: 1100,
  },
  {
    id: 'taman-cikapayang',
    name: 'Taman Cikapayang',
    category: 'Taman',
    district: 'Lebakgede, Coblong',
    address: 'Jl. Cikapayang, Lebakgede, Coblong',
    distanceMeters: 1800,
  },
  {
    id: 'puskesmas-cihapit',
    name: 'Puskesmas Cihapit',
    category: 'Faskes',
    district: 'Cihapit, Bandung Wetan',
    address: 'Jl. Cihapit, Cihapit, Bandung Wetan',
    distanceMeters: 900,
  },
  {
    id: 'klinik-sehat-citarum',
    name: 'Klinik Sehat Citarum',
    category: 'Faskes',
    district: 'Citarum, Bandung Wetan',
    address: 'Jl. Citarum, Citarum, Bandung Wetan',
    distanceMeters: 1500,
  },
];

export function findPlaceById(id: string): Place | undefined {
  return PLACES.find((place) => place.id === id);
}

export function searchPlaces(category: PlaceCategory, radiusKm = SEARCH_RADIUS_KM): Place[] {
  return PLACES.filter(
    (place) => place.category === category && place.distanceMeters <= radiusKm * 1000,
  ).sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/** 650 -> "650 m", 1100 -> "1,1 km" (format Indonesia). */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  const km = Math.round(meters / 100) / 10;
  return `${String(km).replace('.', ',')} km`;
}
