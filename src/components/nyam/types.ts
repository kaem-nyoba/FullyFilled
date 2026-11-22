/**
 * Kontrak animasi Nyam. Layar hanya bergantung pada tipe ini, bukan pada cara merender,
 * sehingga renderer berbasis Rive bisa menggantikan placeholder tanpa mengubah layar.
 * Lihat docs/nyam-animation.md untuk pemetaan layar -> state.
 */

/** State yang berulang/menetap. `celebrate` dipicu terpisah lewat `celebrateKey`. */
export type NyamMood = 'idle' | 'wave' | 'walk' | 'sad';

/** Ukuran dari Figma: sm 115x122 (Masuk, Greeting, Loading), md 144x153 (Sheet, Empty, Error), lg 152x161 (Hero). */
export type NyamSize = 'sm' | 'md' | 'lg';

export type NyamProps = {
  mood?: NyamMood;
  /**
   * Memicu animasi celebrate (lompat lalu mendarat). Animasi diputar saat komponen pertama kali
   * tampil dengan nilai ini, dan diputar ulang setiap kali nilainya berubah.
   */
  celebrateKey?: number | string;
  size?: NyamSize;
  testID?: string;
};

export type NyamPose = 'idle' | 'wave-a' | 'wave-b' | 'walk-a' | 'walk-b' | 'jump' | 'land' | 'sad';

export const NYAM_DIMENSIONS: Record<NyamSize, { width: number; height: number }> = {
  sm: { width: 115.2, height: 122.4 },
  md: { width: 144, height: 153 },
  lg: { width: 152, height: 161.5 },
};

export const NYAM_LABELS: Record<NyamMood, string> = {
  idle: 'Nyam, maskot FullyFilled',
  wave: 'Nyam melambai',
  walk: 'Nyam berjalan',
  sad: 'Nyam tampak sedih',
};
