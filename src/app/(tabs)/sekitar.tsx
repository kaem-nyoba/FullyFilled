import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { Nyam } from '@/components/nyam';
import { PlaceResult } from '@/components/place-result';
import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/theme';
import {
  DEFAULT_LOCATION_LABEL,
  SEARCH_RADIUS_KM,
  searchPlaces,
  type PlaceCategory,
} from '@/data/places';

const CATEGORIES: readonly PlaceCategory[] = ['Gym', 'Taman', 'Faskes'];
const RADIUS_STEPS_KM = [SEARCH_RADIUS_KM, 5, 10] as const;

export default function ExploreScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<PlaceCategory>('Taman');
  const [radiusIndex, setRadiusIndex] = useState(0);

  const radiusKm = RADIUS_STEPS_KM[radiusIndex] ?? SEARCH_RADIUS_KM;
  const canExpand = radiusIndex < RADIUS_STEPS_KM.length - 1;
  const places = searchPlaces(category, radiusKm);
  const noun = category.toLowerCase();

  return (
    <Screen
      footer={
        places.length === 0 ? (
          <>
            {canExpand ? (
              <Button
                label="Cari tempat di sekitarku"
                onPress={() => setRadiusIndex((index) => index + 1)}
                testID="expand-search"
              />
            ) : null}
            {category !== 'Taman' ? (
              <Button
                label="Lihat taman saja"
                onPress={() => setCategory('Taman')}
                variant="secondary"
                testID="show-parks"
              />
            ) : null}
          </>
        ) : undefined
      }
      testID="explore"
    >
      <View style={{ gap: 6 }}>
        <Text variant="title">Jelajahi sekitar</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <MapPin color={colors.primary} size={18} strokeWidth={2.2} />
          <Text color={colors.muted} style={{ flex: 1 }} variant="caption">
            {DEFAULT_LOCATION_LABEL}
          </Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={12}
            onPress={() =>
              Alert.alert('Ubah lokasi', 'Pengaturan lokasi belum tersedia di versi ini.')
            }
          >
            <Text color={colors.primary} variant="captionStrong">
              Ubah
            </Text>
          </Pressable>
        </View>
      </View>

      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 8 }}>
        {CATEGORIES.map((item) => (
          <FilterChip
            key={item}
            onPress={() => setCategory(item)}
            selected={category === item}
            testID={`filter-${item}`}
            type={item}
          />
        ))}
      </View>

      {places.length > 0 ? (
        <>
          <Text variant="caption">{`${places.length} ${noun} dalam ${radiusKm} km dari kamu`}</Text>
          <View style={{ gap: 8 }}>
            {places.map((place) => (
              <PlaceResult
                key={place.id}
                onPressRoute={() =>
                  router.push({ pathname: '/rute/[id]', params: { id: place.id } })
                }
                place={place}
                testID={`place-${place.id}`}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 8 }} testID="explore-empty">
          <Nyam mood="sad" size="md" />
          <Text style={{ textAlign: 'center' }} variant="heading">
            {`Belum ada ${noun} di dekatmu`}
          </Text>
          <Text color={colors.muted} style={{ textAlign: 'center' }} variant="body">
            {`Aku belum nemu ${noun} dalam ${radiusKm} km. ${
              canExpand ? 'Coba perluas pencarian, atau ' : 'Coba '
            }mulai dari jalan kaki di taman.`}
          </Text>
        </View>
      )}
    </Screen>
  );
}
