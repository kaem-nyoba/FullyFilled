import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { poseFor, FRAME_MS, type CelebratePhase } from '@/components/nyam/pose-for';
import { POSE_SOURCES } from '@/components/nyam/poses';
import { NYAM_DIMENSIONS, NYAM_LABELS, type NyamProps } from '@/components/nyam/types';

/** Durasi (ms) tiap fase celebrate; total ±1,1 detik lalu kembali ke mood. */
const CELEBRATE = { jumpUntil: 460, landUntil: 1050 } as const;

type FrameClock = { mood: NyamProps['mood']; tick: number };

/**
 * Renderer sementara untuk Nyam: pose SVG dari Figma + gerak Reanimated.
 * Memenuhi kontrak `NyamProps`, jadi bisa diganti renderer Rive nanti.
 */
export function NyamPlaceholder({ mood = 'idle', celebrateKey, size = 'md', testID }: NyamProps) {
  const reduceMotion = useReducedMotion();
  const [clock, setClock] = useState<FrameClock>({ mood, tick: 0 });
  const [phase, setPhase] = useState<CelebratePhase>(null);

  // Gerak ambient per mood (napas, goyang, pantulan jalan).
  const loopY = useSharedValue(0);
  const loopScaleY = useSharedValue(1);
  const loopRotate = useSharedValue(0);
  // Gerak celebrate (lompat dan squash saat mendarat).
  const hopY = useSharedValue(0);
  const squash = useSharedValue(1);

  const tick = clock.mood === mood ? clock.tick : 0;

  // Ganti frame untuk state yang beranimasi per pose (wave, walk).
  useEffect(() => {
    if (reduceMotion || (mood !== 'wave' && mood !== 'walk')) return;
    const id = setInterval(() => {
      setClock((current) =>
        current.mood === mood ? { mood, tick: current.tick + 1 } : { mood, tick: 1 },
      );
    }, FRAME_MS[mood]);
    return () => clearInterval(id);
  }, [mood, reduceMotion]);

  // Gerak ambient berulang.
  useEffect(() => {
    cancelAnimation(loopY);
    cancelAnimation(loopScaleY);
    cancelAnimation(loopRotate);
    loopY.set(0);
    loopScaleY.set(1);
    loopRotate.set(0);
    if (reduceMotion) return;

    const ease = Easing.inOut(Easing.sin);
    if (mood === 'idle') {
      loopScaleY.set(withRepeat(withTiming(1.025, { duration: 1500, easing: ease }), -1, true));
      loopY.set(withRepeat(withTiming(-2, { duration: 1500, easing: ease }), -1, true));
    } else if (mood === 'walk') {
      loopY.set(withRepeat(withTiming(-5, { duration: FRAME_MS.walk, easing: ease }), -1, true));
      loopRotate.set(
        withRepeat(withTiming(2, { duration: FRAME_MS.walk * 2, easing: ease }), -1, true),
      );
    } else if (mood === 'wave') {
      loopRotate.set(
        withRepeat(withTiming(-2.5, { duration: FRAME_MS.wave * 2, easing: ease }), -1, true),
      );
    } else if (mood === 'sad') {
      loopRotate.set(withRepeat(withTiming(1.5, { duration: 2600, easing: ease }), -1, true));
      loopY.set(withRepeat(withTiming(1.5, { duration: 2600, easing: ease }), -1, true));
    }
  }, [mood, reduceMotion, loopY, loopScaleY, loopRotate]);

  // Celebrate: lompat, mendarat dengan squash, lalu kembali ke mood.
  useEffect(() => {
    if (celebrateKey === undefined) return;

    const timers: ReturnType<typeof setTimeout>[] = [setTimeout(() => setPhase('jump'), 0)];
    timers.push(setTimeout(() => setPhase('land'), CELEBRATE.jumpUntil));
    timers.push(setTimeout(() => setPhase(null), CELEBRATE.landUntil));

    if (!reduceMotion) {
      hopY.set(
        withSequence(
          withTiming(-30, { duration: 240, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 220, easing: Easing.in(Easing.quad) }),
          withTiming(-12, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 140, easing: Easing.in(Easing.quad) }),
        ),
      );
      squash.set(
        withDelay(
          CELEBRATE.jumpUntil - 20,
          withSequence(withTiming(0.9, { duration: 80 }), withSpring(1, { damping: 8 })),
        ),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [celebrateKey, reduceMotion, hopY, squash]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: loopY.value + hopY.value },
      { rotate: `${loopRotate.value}deg` },
      { scaleY: loopScaleY.value * squash.value },
      { scaleX: 2 - squash.value },
    ],
  }));

  const pose = poseFor(mood, tick, phase);
  const { width, height } = NYAM_DIMENSIONS[size];

  return (
    <Animated.View
      accessibilityLabel={NYAM_LABELS[mood]}
      accessibilityRole="image"
      accessibilityValue={{ text: pose }}
      style={[{ width, height }, animatedStyle]}
      testID={testID}
    >
      <Image
        accessible={false}
        contentFit="contain"
        source={POSE_SOURCES[pose]}
        style={{ width, height }}
      />
    </Animated.View>
  );
}
