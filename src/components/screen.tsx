import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

export type ScreenProps = {
  children: ReactNode;
  /** Area tetap di bawah (mis. tombol utama) yang tidak ikut menggulir. */
  footer?: ReactNode;
  /** Beri jarak untuk safe area bawah pada footer (layar di luar tab). */
  footerInset?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Kerangka layar: latar krem, padding 24, jarak antarbagian 20, dan footer opsional. */
export function Screen({ children, footer, footerInset = false, style, testID }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} testID={testID}>
      <ScrollView
        contentContainerStyle={[
          {
            flexGrow: 1,
            gap: spacing.xl,
            paddingHorizontal: spacing.screen,
            paddingTop: insets.top + 8,
            paddingBottom: spacing.xxl,
          },
          style,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer ? (
        <View
          style={{
            gap: spacing.md,
            paddingHorizontal: spacing.screen,
            paddingTop: spacing.sm,
            paddingBottom: footerInset ? Math.max(insets.bottom, spacing.lg) : spacing.lg,
            backgroundColor: colors.bg,
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
