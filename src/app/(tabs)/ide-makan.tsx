import { useRouter } from 'expo-router';
import { Check, Flame, Plus, Sprout } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { MenuCard } from '@/components/menu-card';
import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';
import { useAppState } from '@/state/app-state';
import { shortPortion } from '@/utils/portion';
import { recommendMeals, type Recommendation } from '@/utils/recommend';
import { formatKg } from '@/utils/target';

function MacroTile({
  value,
  label,
  bg,
  fg,
}: {
  value: number;
  label: string;
  bg: string;
  fg: string;
}) {
  return (
    <View style={{ flex: 1, gap: 2, padding: 12, borderRadius: radius.md, backgroundColor: bg }}>
      <Text color={fg} style={{ fontFamily: fonts.black, fontSize: 22, lineHeight: 26 }}>
        {`${value} g`}
      </Text>
      <Text color={fg} variant="small">
        {label}
      </Text>
    </View>
  );
}

function IngredientRow({ name, amount, owned }: { name: string; amount: string; owned: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: radius.md,
        borderWidth: 2,
        borderColor: owned ? colors.border : colors.accent,
        backgroundColor: owned ? colors.surface : colors.accentSoft,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: owned ? colors.primary : colors.accent,
        }}
      >
        {owned ? (
          <Check color={colors.onPrimary} size={14} strokeWidth={3.4} />
        ) : (
          <Plus color={colors.accentText} size={14} strokeWidth={3.4} />
        )}
      </View>
      <Text style={{ flex: 1 }} variant="bodyStrong">
        {name}
      </Text>
      <Text color={colors.muted} variant="small">
        {amount}
      </Text>
      <Text color={owned ? colors.primary : colors.accentText} variant="small">
        {owned ? 'Ada' : 'Perlu beli'}
      </Text>
    </View>
  );
}

function MenuDetail({ item, onClose }: { item: Recommendation; onClose: () => void }) {
  const { recipe } = item;

  return (
    <View style={{ gap: 18 }} testID="menu-detail">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="heading">{recipe.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Flame color={colors.orange} size={16} strokeWidth={2.4} />
            <Text color={colors.muted} variant="caption">
              {`${recipe.kcal} kkal · ${recipe.portion}`}
            </Text>
          </View>
        </View>
        <IconButton icon="close" onPress={onClose} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MacroTile
          bg={colors.primarySoft}
          fg={colors.primaryEdge}
          label="Protein"
          value={recipe.proteinG}
        />
        <MacroTile
          bg={colors.accentSoft}
          fg={colors.accentText}
          label="Karbohidrat"
          value={recipe.carbsG}
        />
        <MacroTile bg={colors.orangeSoft} fg="#8a3f06" label="Lemak" value={recipe.fatG} />
      </View>

      <View style={{ gap: 8 }}>
        <Text variant="heading" style={{ fontSize: 18, lineHeight: 22 }}>
          Bahan
        </Text>
        {item.items.map((entry) => (
          <IngredientRow
            amount={entry.amount}
            key={entry.name}
            name={entry.name}
            owned={entry.owned}
          />
        ))}
      </View>

      <Button label="Pilih menu ini" onPress={onClose} testID="choose-menu" />
    </View>
  );
}

export default function MealsScreen() {
  const router = useRouter();
  const { profile } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const recommendations = useMemo(
    () => (profile ? recommendMeals(profile.ingredients) : []),
    [profile],
  );
  const selected = recommendations.find((item) => item.recipe.id === selectedId) ?? null;

  if (!profile) {
    return (
      <Screen testID="meals-empty">
        <Text variant="title">Ide makan</Text>
        <Card style={{ gap: 12, padding: 18 }}>
          <Text variant="cardTitle">Atur targetmu dulu</Text>
          <Text color={colors.muted} variant="body">
            Nyam butuh tahu bahan yang kamu punya supaya ide makannya pas.
          </Text>
          <Button label="Atur targetku" onPress={() => router.push('/target')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen testID="meals">
      <View style={{ gap: 4 }}>
        <Text variant="title">3 ide makan buatmu</Text>
        <Text color={colors.muted} variant="body">
          {`Disusun dari bahan pilihanmu dan target ${formatKg(profile.goalKg)}.`}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Sprout color={colors.primary} size={18} strokeWidth={2.2} />
        <Text style={{ flex: 1 }} variant="captionStrong">
          {profile.ingredients.length > 0
            ? profile.ingredients.join(', ')
            : 'Belum ada bahan dipilih'}
        </Text>
        <Pressable accessibilityRole="link" hitSlop={12} onPress={() => router.push('/target')}>
          <Text color={colors.primary} variant="captionStrong">
            Ubah
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        {recommendations.map((item) => (
          <MenuCard
            kcal={item.recipe.kcal}
            key={item.recipe.id}
            name={item.recipe.name}
            onPress={() => setSelectedId(item.recipe.id)}
            portion={shortPortion(item.recipe.portion)}
            reason={item.reason}
            testID={`menu-${item.recipe.id}`}
          />
        ))}
      </View>

      <Sheet onClose={() => setSelectedId(null)} visible={selected !== null}>
        {selected ? <MenuDetail item={selected} onClose={() => setSelectedId(null)} /> : null}
      </Sheet>
    </Screen>
  );
}
