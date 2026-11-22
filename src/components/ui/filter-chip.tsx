import { Dumbbell, SquarePlus, Trees, type LucideIcon } from 'lucide-react-native';

import { Press3D } from '@/components/ui/press-3d';
import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';
import type { PlaceCategory } from '@/data/places';

const ICONS: Record<PlaceCategory, LucideIcon> = {
  Gym: Dumbbell,
  Taman: Trees,
  Faskes: SquarePlus,
};

export type FilterChipProps = {
  type: PlaceCategory;
  selected?: boolean;
  onPress?: () => void;
  testID?: string;
};

/** Chip filter kategori tempat (Figma: FilterChip). Terpilih = hijau penuh. */
export function FilterChip({ type, selected = false, onPress, testID }: FilterChipProps) {
  const Icon = ICONS[type];
  const fg = selected ? colors.onPrimary : colors.text;

  return (
    <Press3D
      accessibilityLabel={type}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      depth={3}
      edgeColor={selected ? colors.primaryEdge : colors.borderEdge}
      faceStyle={[
        {
          height: 44,
          paddingLeft: 14,
          paddingRight: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: selected ? colors.primary : colors.surface,
        },
        !selected && { borderWidth: 2, borderColor: colors.border },
      ]}
      onPress={onPress}
      radius={radius.pill}
      testID={testID}
    >
      <Icon color={fg} size={18} strokeWidth={2.2} />
      <Text color={fg} style={{ fontFamily: fonts.extraBold, fontSize: 15, lineHeight: 18 }}>
        {type}
      </Text>
    </Press3D>
  );
}
