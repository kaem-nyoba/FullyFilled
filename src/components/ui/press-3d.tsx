import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SPRING = { damping: 18, stiffness: 420, mass: 0.6 } as const;

export type Press3DProps = Omit<PressableProps, 'style' | 'children'> & {
  /** Warna tepi bawah (sisi "tebal" tombol). */
  edgeColor: string;
  radius: number;
  /** Tebal tepi bawah; muka turun sedalam ini saat ditekan. */
  depth?: number;
  /** Gaya untuk wrapper luar (lebar, margin). */
  style?: StyleProp<ViewStyle>;
  /** Gaya untuk muka (warna, border, padding). */
  faceStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Permukaan 3D dari desain Figma: tepi bawah lebih gelap, saat ditekan muka turun
 * menutupi tepi (spring). Dipakai oleh tombol, chip, dan kartu yang bisa diketuk.
 */
export function Press3D({
  edgeColor,
  radius,
  depth = 4,
  style,
  faceStyle,
  children,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: Press3DProps) {
  const offset = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  const animatedFace = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const move = (to: number) => {
    offset.set(reduceMotion ? to : withSpring(to, SPRING));
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={(e) => {
        move(depth);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        move(0);
        onPressOut?.(e);
      }}
      style={[{ paddingBottom: depth }, style]}
      {...rest}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: depth,
          bottom: 0,
          borderRadius: radius,
          backgroundColor: edgeColor,
        }}
      />
      <Animated.View style={[{ borderRadius: radius }, faceStyle, animatedFace]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
