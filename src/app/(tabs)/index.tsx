import { useRouter } from 'expo-router';
import { ArrowRight, Sprout, Target } from 'lucide-react-native';
import { Alert, Pressable, View } from 'react-native';

import { Nyam } from '@/components/nyam';
import { Screen } from '@/components/screen';
import { SupportNote } from '@/components/support-note';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';
import { useAppState } from '@/state/app-state';
import { formatKg, ingredientsLine, paceNote } from '@/utils/target';

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAppState();
  const name = user?.name ?? 'Teman';

  const confirmSignOut = () =>
    Alert.alert('Keluar dari FullyFilled?', 'Targetmu tidak akan hilang di perangkat ini.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);

  const header = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text color={colors.primaryEdge} variant="brand">
        FullyFilled
      </Text>
      <Pressable
        accessibilityHint="Buka pilihan keluar"
        accessibilityLabel={`Akun ${name}`}
        accessibilityRole="button"
        onPress={confirmSignOut}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.accentSoft,
          borderWidth: 2,
          borderColor: colors.accent,
        }}
        testID="avatar"
      >
        <Text color={colors.accentText} style={{ fontFamily: fonts.black, fontSize: 16 }}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </Pressable>
    </View>
  );

  const actions = (primaryLabel: string, onPrimary: () => void) => (
    <>
      <Button label={primaryLabel} onPress={onPrimary} testID="home-primary" />
      <Button
        label="Jelajahi sekitar"
        onPress={() => router.navigate('/sekitar')}
        variant="secondary"
      />
    </>
  );

  if (!profile) {
    return (
      <Screen footer={actions('Atur targetku', () => router.push('/target'))} testID="home-empty">
        {header}
        <View style={{ alignItems: 'center', gap: 8, paddingTop: 8 }}>
          <Nyam mood="wave" size="lg" />
          <Text style={{ textAlign: 'center' }} variant="display">
            {`Hai, ${name}!`}
          </Text>
          <Text color={colors.muted} style={{ textAlign: 'center' }} variant="body">
            Aku Nyam. Kasih tahu targetmu dulu, nanti aku bantu cari makan dan tempat gerak yang
            pas.
          </Text>
        </View>
        <Pressable
          accessibilityHint="Buka pengaturan target"
          accessibilityRole="button"
          onPress={() => router.push('/target')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 18,
            borderRadius: radius.xl,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: colors.accent,
            backgroundColor: colors.accentSoft,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.surface,
            }}
          >
            <Target color={colors.accentText} size={24} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text color={colors.accentText} style={{ fontFamily: fonts.extraBold, fontSize: 16 }}>
              Target belum diisi
            </Text>
            <Text color={colors.accentText} variant="caption">
              Cuma 1 menit, dan bisa kamu ubah kapan saja.
            </Text>
          </View>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen
      footer={actions('Cari ide makan', () => router.navigate('/ide-makan'))}
      testID="home-ready"
    >
      {header}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        <Nyam mood="wave" size="sm" />
        <Card
          radius={radius.xl - 4}
          style={{
            flex: 1,
            gap: 2,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomLeftRadius: 6,
            marginBottom: 4,
          }}
          depth={3}
        >
          <Text variant="heading">{`Hai, ${name}!`}</Text>
          <Text color={colors.muted} variant="body">
            Mau makan apa hari ini?
          </Text>
        </Card>
      </View>

      <Card style={{ gap: 14, padding: 18 }} testID="target-card">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text color={colors.muted} variant="label">
            Targetmu
          </Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={12}
            onPress={() => router.push('/target')}
            testID="edit-target"
          >
            <Text color={colors.primary} variant="label">
              Ubah
            </Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View>
            <Text color={colors.muted} variant="small" style={{ fontSize: 13, letterSpacing: 0 }}>
              Sekarang
            </Text>
            <Text variant="metric">{formatKg(profile.currentKg)}</Text>
          </View>
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
            <ArrowRight color={colors.primary} size={18} strokeWidth={2.6} />
          </View>
          <View>
            <Text color={colors.muted} variant="small" style={{ fontSize: 13, letterSpacing: 0 }}>
              Target
            </Text>
            <Text color={colors.primaryEdge} variant="metric">
              {formatKg(profile.goalKg)}
            </Text>
          </View>
        </View>
        <SupportNote>{paceNote(profile.currentKg, profile.goalKg)}</SupportNote>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Sprout color={colors.primary} size={18} strokeWidth={2.2} />
          <Text color={colors.muted} style={{ flex: 1 }} variant="caption">
            {ingredientsLine(profile.ingredients)}
          </Text>
        </View>
      </Card>
    </Screen>
  );
}
