import type { NyamPose } from '@/components/nyam/types';

/** Pose vektor dari Figma (frame "Mascot / Nyam"), ±37 path per pose. */
export const POSE_SOURCES: Record<NyamPose, number> = {
  idle: require('@/assets/nyam/idle.svg'),
  'wave-a': require('@/assets/nyam/wave-a.svg'),
  'wave-b': require('@/assets/nyam/wave-b.svg'),
  'walk-a': require('@/assets/nyam/walk-a.svg'),
  'walk-b': require('@/assets/nyam/walk-b.svg'),
  jump: require('@/assets/nyam/jump.svg'),
  land: require('@/assets/nyam/land.svg'),
  sad: require('@/assets/nyam/sad.svg'),
};
