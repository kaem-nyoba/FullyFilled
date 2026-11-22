import { Check } from 'lucide-react-native';

import { Press3D } from '@/components/ui/press-3d';
import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  testID?: string;
};

/** Chip pilihan bahan/aktivitas. Terpilih = centang + hijau, bukan hanya warna (Figma: Chip). */
export function Chip({ label, selected = false, onPress, testID }: ChipProps) {
  return (
    <Press3D
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      depth={3}
      edgeColor={selected ? colors.primary : colors.borderEdge}
      faceStyle={{
        height: 44,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderWidth: 2,
        backgroundColor: selected ? colors.primarySoft : colors.surface,
        borderColor: selected ? colors.primary : colors.border,
      }}
      onPress={onPress}
      radius={radius.pill}
      testID={testID}
    >
      {selected ? <Check color={colors.primaryEdge} size={16} strokeWidth={3} /> : null}
      <Text
        color={selected ? colors.primaryEdge : colors.text}
        style={{
          fontFamily: selected ? fonts.extraBold : fonts.bold,
          fontSize: 15,
          lineHeight: 18,
        }}
      >
        {label}
      </Text>
    </Press3D>
  );
}
