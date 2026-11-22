import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';

export type NumberFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  unit?: string;
  testID?: string;
};

/** Input angka dengan satuan, mis. berat badan (Figma: NumberField). */
export function NumberField({ label, value, onChangeText, unit = 'kg', testID }: NumberFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <Text variant="label">{label}</Text>
      <View
        style={[
          {
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 16,
            borderRadius: radius.md,
            backgroundColor: colors.surface,
          },
          focused
            ? {
                borderWidth: 2.5,
                borderColor: colors.primary,
                boxShadow: `0 0 0 4px ${colors.primaryFocusRing}`,
              }
            : {
                borderWidth: 2,
                borderColor: colors.border,
                boxShadow: `0 3px 0 0 ${colors.borderEdge}`,
              },
        ]}
      >
        <TextInput
          accessibilityLabel={`${label} dalam ${unit}`}
          inputMode="decimal"
          keyboardType="decimal-pad"
          maxLength={5}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          style={{
            flex: 1,
            height: '100%',
            padding: 0,
            fontFamily: fonts.black,
            fontSize: 22,
            color: colors.text,
          }}
          testID={testID}
          value={value}
        />
        <Text color={colors.muted} style={{ fontFamily: fonts.bold, fontSize: 16 }}>
          {unit}
        </Text>
      </View>
    </View>
  );
}
