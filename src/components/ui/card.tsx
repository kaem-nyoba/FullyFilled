import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/constants/theme';

export type CardProps = {
  children: ReactNode;
  radius?: number;
  depth?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Permukaan putih dengan border krem dan tepi bawah 3D (Figma: Target Card, Speech Bubble). */
export function Card({
  children,
  radius: cornerRadius = radius.xl,
  depth = 4,
  style,
  testID,
}: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: cornerRadius,
          boxShadow: `0 ${depth}px 0 0 ${colors.borderEdge}`,
          marginBottom: depth,
        },
        style,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
}
