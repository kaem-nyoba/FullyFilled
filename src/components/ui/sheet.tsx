import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  testID?: string;
};

/**
 * Bottom sheet dengan scrim (Figma: Sheet di layar 2b dan 3b).
 * Ketuk scrim atau tombol kembali Android untuk menutup.
 */
export function Sheet({ visible, onClose, children, testID }: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.root} testID={testID}>
        <Animated.View
          entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
          style={StyleSheet.absoluteFill}
        >
          <Pressable
            accessibilityLabel="Tutup"
            accessibilityRole="button"
            onPress={onClose}
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
          />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.springify()
            .damping(22)
            .stiffness(220)
            .reduceMotion(ReduceMotion.System)}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}
        >
          <View style={styles.grabber} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
});
