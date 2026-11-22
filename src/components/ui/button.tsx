import type { StyleProp, ViewStyle } from 'react-native';

import { Press3D } from '@/components/ui/press-3d';
import { colors, fonts, radius } from '@/constants/theme';
import { Text } from '@/components/ui/text';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Tombol utama 3D (Figma: Button). Tepi bawah 4px, saat ditekan turun 4px. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
  testID,
}: ButtonProps) {
  const primary = variant === 'primary';

  return (
    <Press3D
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      edgeColor={primary ? colors.primaryEdge : colors.borderEdge}
      faceStyle={[
        {
          height: 56,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: primary ? colors.primary : colors.surface,
          borderRadius: radius.md,
        },
        !primary && { borderWidth: 2, borderColor: colors.border },
        disabled && { opacity: 0.45 },
      ]}
      onPress={onPress}
      radius={radius.md}
      style={style}
      testID={testID}
    >
      <Text
        color={primary ? colors.onPrimary : colors.primaryEdge}
        style={{ fontFamily: fonts.extraBold, fontSize: 17, lineHeight: 20, letterSpacing: 0.17 }}
      >
        {label}
      </Text>
    </Press3D>
  );
}
