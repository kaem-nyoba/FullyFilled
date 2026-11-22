import { ChevronLeft, X } from 'lucide-react-native';

import { Press3D } from '@/components/ui/press-3d';
import { colors } from '@/constants/theme';

export type IconButtonProps = {
  icon: 'back' | 'close';
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

/** Tombol ikon persegi 44x44 (Figma: IconButton). */
export function IconButton({ icon, onPress, accessibilityLabel, testID }: IconButtonProps) {
  const Icon = icon === 'back' ? ChevronLeft : X;

  return (
    <Press3D
      accessibilityLabel={accessibilityLabel ?? (icon === 'back' ? 'Kembali' : 'Tutup')}
      depth={3}
      edgeColor={colors.borderEdge}
      faceStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
      }}
      onPress={onPress}
      radius={14}
      testID={testID}
    >
      <Icon color={colors.text} size={22} strokeWidth={2.4} />
    </Press3D>
  );
}
