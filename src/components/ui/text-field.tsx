import { CircleAlert, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors, fonts, radius } from '@/constants/theme';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  helper?: string;
  /** Pesan error; jika ada, field tampil merah dan pesan memakai ikon (bukan hanya warna). */
  error?: string;
  /** Aktifkan mode kata sandi dengan tombol lihat/sembunyikan. */
  secure?: boolean;
  testID?: string;
};

/** Input teks berlabel (Figma: TextField). */
export function TextField({
  label,
  helper,
  error,
  secure = false,
  onFocus,
  onBlur,
  testID,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const hasError = !!error;

  const fieldBorder = hasError
    ? {
        borderWidth: 2.5,
        borderColor: colors.error,
        boxShadow: `0 0 0 4px ${colors.errorFocusRing}`,
      }
    : focused
      ? {
          borderWidth: 2.5,
          borderColor: colors.primary,
          boxShadow: `0 0 0 4px ${colors.primaryFocusRing}`,
        }
      : {
          borderWidth: 2,
          borderColor: colors.border,
          boxShadow: `0 3px 0 0 ${colors.borderEdge}`,
        };

  return (
    <View style={{ gap: 8 }}>
      <Text variant="label">{label}</Text>
      <View
        style={[
          {
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            borderRadius: radius.md,
            backgroundColor: colors.surface,
          },
          fieldBorder,
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.muted}
          secureTextEntry={secure && hidden}
          style={{
            flex: 1,
            height: '100%',
            padding: 0,
            fontFamily: fonts.bold,
            fontSize: 17,
            color: colors.text,
          }}
          testID={testID}
          {...inputProps}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
        />
        {secure ? (
          <Pressable
            accessibilityLabel={hidden ? 'Tampilkan kata sandi' : 'Sembunyikan kata sandi'}
            accessibilityRole="button"
            hitSlop={12}
            onPress={() => setHidden((value) => !value)}
          >
            {hidden ? (
              <Eye color={colors.muted} size={22} strokeWidth={2.2} />
            ) : (
              <EyeOff color={colors.muted} size={22} strokeWidth={2.2} />
            )}
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', gap: 6 }}>
          <CircleAlert color={colors.error} size={16} strokeWidth={2.4} style={{ marginTop: 1 }} />
          <Text color={colors.error} style={{ flex: 1 }} variant="caption">
            {error}
          </Text>
        </View>
      ) : helper ? (
        <Text color={colors.muted} variant="caption" style={{ fontFamily: fonts.semiBold }}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
