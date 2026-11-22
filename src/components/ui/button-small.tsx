import { Navigation } from 'lucide-react-native';

import { Press3D } from '@/components/ui/press-3d';
import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';

export type ButtonSmallProps = {
  label: string;
  onPress?: () => void;
  testID?: string;
};

/** Tombol kecil 3D dengan ikon navigasi (Figma: ButtonSmall, mis. "Lihat rute"). */
export function ButtonSmall({ label, onPress, testID }: ButtonSmallProps) {
  return (
    <Press3D
      accessibilityLabel={label}
      depth={3}
      edgeColor={colors.primaryEdge}
      faceStyle={{
        height: 40,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: colors.primary,
      }}
      onPress={onPress}
      radius={radius.sm}
      testID={testID}
    >
      <Navigation color={colors.onPrimary} size={16} strokeWidth={2.4} />
      <Text
        color={colors.onPrimary}
        style={{ fontFamily: fonts.extraBold, fontSize: 15, lineHeight: 18, letterSpacing: 0.075 }}
      >
        {label}
      </Text>
    </Press3D>
  );
}
