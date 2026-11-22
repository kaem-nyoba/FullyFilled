import { Dumbbell, MapPin, SquarePlus, Trees, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ButtonSmall } from '@/components/ui/button-small';
import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';
import { formatDistance, type Place, type PlaceCategory } from '@/data/places';

const CATEGORY_STYLE: Record<PlaceCategory, { icon: LucideIcon; bg: string; fg: string }> = {
  Taman: { icon: Trees, bg: colors.primarySoft, fg: colors.primary },
  Gym: { icon: Dumbbell, bg: colors.orangeSoft, fg: colors.orange },
  Faskes: { icon: SquarePlus, bg: colors.errorSoft, fg: colors.error },
};

export type PlaceResultProps = {
  place: Place;
  onPressRoute?: () => void;
  testID?: string;
};

/** Hasil pencarian tempat: nama, kategori, lokasi, jarak, dan aksi Lihat rute (Figma: PlaceResult). */
export function PlaceResult({ place, onPressRoute, testID }: PlaceResultProps) {
  const { icon: Icon, bg, fg } = CATEGORY_STYLE[place.category];

  return (
    <Card radius={radius.lg} style={{ gap: 12, padding: 14 }} testID={testID}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bg,
          }}
        >
          <Icon color={fg} size={24} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: fonts.extraBold, fontSize: 17, lineHeight: 21 }}>
            {place.name}
          </Text>
          <Text color={colors.muted} style={{ fontFamily: fonts.semiBold }} variant="caption">
            {`${place.category} · ${place.district}`}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <MapPin color={colors.muted} size={16} strokeWidth={2.2} />
          <Text variant="caption">{`${formatDistance(place.distanceMeters)} dari kamu`}</Text>
        </View>
        <ButtonSmall
          label="Lihat rute"
          onPress={onPressRoute}
          testID={testID ? `${testID}-route` : undefined}
        />
      </View>
    </Card>
  );
}
