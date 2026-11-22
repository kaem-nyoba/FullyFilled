import type { NyamMood, NyamPose } from '@/components/nyam/types';

export type CelebratePhase = 'jump' | 'land' | null;

/** Berapa kali melambai sebelum Nyam kembali diam (satu siklus = pose A lalu B). */
export const WAVE_CYCLES = 3;

/** Interval ganti pose (ms) untuk state yang berganti frame. */
export const FRAME_MS = { wave: 280, walk: 220 } as const;

/**
 * Menentukan pose yang tampil dari state saat ini. Fungsi murni supaya mudah diuji.
 * @param tick jumlah pergantian frame sejak mood dimulai
 */
export function poseFor(mood: NyamMood, tick: number, phase: CelebratePhase): NyamPose {
  if (phase === 'jump') return 'jump';
  if (phase === 'land') return 'land';

  switch (mood) {
    case 'sad':
      return 'sad';
    case 'walk':
      return tick % 2 === 0 ? 'walk-a' : 'walk-b';
    case 'wave':
      return tick < WAVE_CYCLES * 2 ? (tick % 2 === 0 ? 'wave-a' : 'wave-b') : 'idle';
    default:
      return 'idle';
  }
}
