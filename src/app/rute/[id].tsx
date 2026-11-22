import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowUp,
  Clock,
  CornerUpRight,
  Flag,
  Route as RouteIcon,
  type LucideIcon,
} from 'lucide-react-native';
import { Alert, View } from 'react-native';

import { Nyam } from '@/components/nyam';
import { RouteMap } from '@/components/route-map';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';
import { findPlaceById, formatDistance } from '@/data/places';
import { useRoute } from '@/hooks/use-route';
import type { RouteStepKind } from '@/services/route-service';

const STEP_ICONS: Record<RouteStepKind, LucideIcon> = {
  straight: ArrowUp,
  'turn-right': CornerUpRight,
  arrive: Flag,
};

function StatTile({
  icon: Icon,
  label,
  value,
  bg,
  fg,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  bg: string;
  fg: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        padding: 14,
        borderRadius: radius.lg,
        borderWidth: value ? 0 : 2,
        borderColor: colors.border,
        backgroundColor: value ? bg : colors.surface,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon color={value ? fg : colors.muted} size={16} strokeWidth={2.4} />
        <Text color={value ? fg : colors.muted} variant="small">
          {label}
        </Text>
      </View>
      {value ? (
        <Text color={fg} variant="metric" style={{ fontSize: 26, lineHeight: 31 }}>
          {value}
        </Text>
      ) : (
        <Skeleton height={26} radius={8} width={90} />
      )}
    </View>
  );
}

export default function RouteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = findPlaceById(id);
  const { state, retry } = useRoute(id);

  const title = place ? `Rute ke ${place.name}` : 'Rute';
  const address = place?.address ?? '';

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <IconButton icon="back" onPress={() => router.back()} testID="back" />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.brandExtraBold, fontSize: 20, lineHeight: 25 }}>
          {title}
        </Text>
        <Text
          color={colors.muted}
          variant="small"
          style={{ fontFamily: fonts.semiBold, fontSize: 13 }}
        >
          {address}
        </Text>
      </View>
    </View>
  );

  if (state.status === 'error') {
    return (
      <Screen
        footer={
          <>
            <Button label="Coba lagi" onPress={retry} testID="retry" />
            <Button label="Kembali ke daftar" onPress={() => router.back()} variant="secondary" />
          </>
        }
        footerInset
        testID="route-error"
      >
        {header}
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 24 }}>
          <Nyam mood="sad" size="md" />
          <Text style={{ textAlign: 'center' }} variant="heading">
            Rutenya belum ketemu
          </Text>
          <Text color={colors.muted} style={{ textAlign: 'center' }} variant="body">
            Layanan rute lagi nggak merespons. Cek koneksimu, lalu coba lagi ya.
          </Text>
        </View>
      </Screen>
    );
  }

  const loading = state.status === 'loading';
  const route = state.status === 'ready' ? state.route : null;

  return (
    <Screen
      footer={
        <Button
          disabled={loading}
          label="Mulai jalan"
          onPress={() =>
            Alert.alert(
              'Selamat jalan!',
              'Panduan langkah demi langkah belum tersedia di versi ini.',
            )
          }
          testID="start-walking"
        />
      }
      footerInset
      testID={loading ? 'route-loading' : 'route-ready'}
    >
      {header}

      {loading ? (
        <Card style={{ alignItems: 'center', gap: 4, paddingVertical: 18 }}>
          <Nyam mood="walk" size="sm" />
          <Text variant="cardTitle" style={{ fontSize: 20 }}>
            Lagi cari rute…
          </Text>
          <Text color={colors.muted} variant="caption">
            Aku cek jalan kaki paling nyaman.
          </Text>
        </Card>
      ) : (
        <View style={{ aspectRatio: 342 / 210, borderRadius: radius.xl - 4, overflow: 'hidden' }}>
          <RouteMap />
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatTile
          bg={colors.primarySoft}
          fg={colors.primaryEdge}
          icon={RouteIcon}
          label="Jarak rute"
          value={route ? formatDistance(route.distanceMeters) : undefined}
        />
        <StatTile
          bg={colors.orangeSoft}
          fg="#8a3f06"
          icon={Clock}
          label="Jalan kaki"
          value={route ? `±${route.minutes} mnt` : undefined}
        />
      </View>

      <View style={{ gap: 8 }}>
        {route
          ? route.steps.map((step) => {
              const Icon = STEP_ICONS[step.kind];
              return (
                <View
                  key={step.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: radius.md,
                    borderWidth: 2,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primarySoft,
                    }}
                  >
                    <Icon color={colors.primary} size={18} strokeWidth={2.4} />
                  </View>
                  <Text style={{ flex: 1 }} variant="bodyStrong">
                    {step.instruction}
                  </Text>
                  <Text color={colors.muted} variant="small">
                    {formatDistance(step.distanceMeters)}
                  </Text>
                </View>
              );
            })
          : [0, 1, 2].map((key) => (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: radius.md,
                  borderWidth: 2,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <Skeleton height={32} radius={16} width={32} />
                <Skeleton height={12} radius={6} width={150} />
              </View>
            ))}
      </View>
    </Screen>
  );
}
