import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { Nyam } from '@/components/nyam';
import { Screen } from '@/components/screen';
import { SupportNote } from '@/components/support-note';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { NumberField } from '@/components/ui/number-field';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/theme';
import { ACTIVITY_OPTIONS, INGREDIENT_OPTIONS } from '@/data/options';
import { useAppState } from '@/state/app-state';
import type { Profile } from '@/state/types';
import { changeSummary, formatKg, formatNumber } from '@/utils/target';
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, parseWeight } from '@/utils/validation';

/** Menjaga urutan sesuai daftar pilihan, bukan urutan ketukan. */
function toggle<T extends string>(selected: readonly string[], value: T, order: readonly T[]) {
  const next = selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
  return order.filter((item) => next.includes(item));
}

function ChipGroup({
  title,
  hint,
  options,
  selected,
  onToggle,
}: {
  title: string;
  hint: string;
  options: readonly string[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      <View>
        <Text variant="heading" style={{ fontSize: 20, lineHeight: 24 }}>
          {title}
        </Text>
        <Text color={colors.muted} variant="caption">
          {hint}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 8, rowGap: 6 }}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            onPress={() => onToggle(option)}
            selected={selected.includes(option)}
            testID={`chip-${option}`}
          />
        ))}
      </View>
    </View>
  );
}

export default function TargetScreen() {
  const router = useRouter();
  const { profile, saveProfile } = useAppState();

  const [currentText, setCurrentText] = useState(profile ? formatNumber(profile.currentKg) : '');
  const [goalText, setGoalText] = useState(profile ? formatNumber(profile.goalKg) : '');
  const [ingredients, setIngredients] = useState<string[]>(profile?.ingredients ?? []);
  const [activities, setActivities] = useState<string[]>(profile?.activities ?? []);
  const [saved, setSaved] = useState<Profile | null>(null);

  const currentKg = parseWeight(currentText);
  const goalKg = parseWeight(goalText);
  const valid = currentKg !== null && goalKg !== null;

  const save = () => {
    if (currentKg === null || goalKg === null) return;
    setSaved(saveProfile({ currentKg, goalKg, ingredients, activities }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Screen
        footer={
          <Button disabled={!valid} label="Simpan target" onPress={save} testID="save-target" />
        }
        footerInset
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <IconButton icon="back" onPress={() => router.back()} testID="back" />
          <Text variant="heading" style={{ flex: 1 }}>
            Target & preferensi
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <NumberField
            label="Berat sekarang"
            onChangeText={setCurrentText}
            testID="current-weight"
            value={currentText}
          />
          <NumberField
            label="Targetmu"
            onChangeText={setGoalText}
            testID="goal-weight"
            value={goalText}
          />
        </View>

        {valid ? (
          <SupportNote tone="primary">{changeSummary(currentKg, goalKg)}</SupportNote>
        ) : (
          <Text color={colors.muted} variant="caption">
            {`Isi berat ${MIN_WEIGHT_KG}–${MAX_WEIGHT_KG} kg ya, boleh pakai koma.`}
          </Text>
        )}

        <ChipGroup
          hint="Pilih yang gampang kamu dapat."
          onToggle={(value) =>
            setIngredients((current) => toggle(current, value, INGREDIENT_OPTIONS))
          }
          options={INGREDIENT_OPTIONS}
          selected={ingredients}
          title="Bahan apa yang ada hari ini?"
        />
        <ChipGroup
          hint="Boleh pilih lebih dari satu."
          onToggle={(value) => setActivities((current) => toggle(current, value, ACTIVITY_OPTIONS))}
          options={ACTIVITY_OPTIONS}
          selected={activities}
          title="Suka gerak yang mana?"
        />
      </Screen>

      <Sheet onClose={() => router.back()} testID="saved-sheet" visible={saved !== null}>
        {saved ? (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Nyam celebrateKey={saved.savedAt} size="md" testID="saved-nyam" />
            <Text style={{ textAlign: 'center' }} variant="title">
              Targetmu tersimpan!
            </Text>
            <Text color={colors.muted} style={{ textAlign: 'center' }} variant="body">
              {`${formatKg(saved.currentKg)} → ${formatKg(saved.goalKg)}, santai aja. Aku sudah siapin 3 ide makan dari bahan pilihanmu.`}
            </Text>
            <View style={{ alignSelf: 'stretch', gap: 12, marginTop: 8 }}>
              <Button
                label="Lihat ide makan"
                onPress={() => {
                  setSaved(null);
                  router.replace('/ide-makan');
                }}
              />
              <Button label="Nanti saja" onPress={() => router.back()} variant="secondary" />
            </View>
          </View>
        ) : null}
      </Sheet>
    </KeyboardAvoidingView>
  );
}
