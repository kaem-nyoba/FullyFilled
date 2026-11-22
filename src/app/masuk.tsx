import { CircleAlert, KeyRound } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';

import { Nyam } from '@/components/nyam';
import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { colors, radius } from '@/constants/theme';
import { DEMO_ACCOUNT } from '@/data/options';
import { useAppState } from '@/state/app-state';
import { displayNameFromEmail, validateLogin, type LoginErrors } from '@/utils/validation';

const COUNT_WORDS = ['nol', 'satu', 'dua'] as const;

export default function LoginScreen() {
  const { signIn } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});

  const errorCount = Object.keys(errors).length;
  const hasErrors = errorCount > 0;

  const submit = () => {
    const found = validateLogin(email, password);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    signIn({ email: email.trim(), name: displayNameFromEmail(email) });
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Screen
        footer={
          <>
            <Pressable
              accessibilityHint="Mengisi email dan kata sandi demo"
              accessibilityRole="button"
              onPress={fillDemo}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                padding: 14,
                borderRadius: radius.md,
                backgroundColor: colors.accentSoft,
              }}
            >
              <KeyRound color={colors.accentText} size={18} strokeWidth={2.4} />
              <Text color={colors.accentText} style={{ flex: 1 }} variant="caption">
                {`Akun demo ${DEMO_ACCOUNT.email} · ${DEMO_ACCOUNT.password}`}
              </Text>
            </Pressable>
            <Button label="Masuk" onPress={submit} testID="login-submit" />
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
              <Text color={colors.muted} variant="caption">
                Belum punya akun?
              </Text>
              <Pressable
                accessibilityRole="link"
                onPress={() =>
                  Alert.alert(
                    'Daftar',
                    'Pendaftaran akun belum tersedia di versi ini. Pakai akun demo dulu ya.',
                  )
                }
              >
                <Text color={colors.primary} variant="captionStrong">
                  Daftar
                </Text>
              </Pressable>
            </View>
          </>
        }
        footerInset
        style={{ paddingTop: 48 }}
      >
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Nyam mood="wave" size="sm" />
          <Text style={{ textAlign: 'center' }} variant="display">
            {hasErrors ? 'Hampir bisa masuk!' : 'Masuk dulu, yuk!'}
          </Text>
          <Text color={colors.muted} style={{ textAlign: 'center' }} variant="body">
            {hasErrors
              ? `Cek lagi ${COUNT_WORDS[errorCount] ?? 'dua'} isian di bawah ya.`
              : 'Biar Nyam ingat target dan bahan favoritmu.'}
          </Text>
        </View>

        {hasErrors ? (
          <View
            accessibilityLiveRegion="polite"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: radius.sm + 2,
              backgroundColor: colors.errorSoft,
            }}
          >
            <CircleAlert color={colors.error} size={20} strokeWidth={2.4} />
            <Text color={colors.error} style={{ flex: 1 }} variant="caption">
              {`Ada ${errorCount} isian yang perlu dibenerin.`}
            </Text>
          </View>
        ) : null}

        <View style={{ gap: 16 }}>
          <TextField
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            keyboardType="email-address"
            label="Email"
            onChangeText={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            testID="login-email"
            value={email}
          />
          <TextField
            autoCapitalize="none"
            autoComplete="current-password"
            error={errors.password}
            helper="Minimal 8 karakter."
            label="Kata sandi"
            onChangeText={(value) => {
              setPassword(value);
              setErrors((current) => ({ ...current, password: undefined }));
            }}
            secure
            testID="login-password"
            value={password}
          />
          <Pressable
            accessibilityRole="link"
            onPress={() =>
              Alert.alert(
                'Lupa kata sandi?',
                'Pengaturan ulang kata sandi belum tersedia di versi ini.',
              )
            }
            style={{ alignSelf: 'flex-end' }}
          >
            <Text color={colors.primary} variant="captionStrong">
              Lupa kata sandi?
            </Text>
          </Pressable>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
