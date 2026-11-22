import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colors } from '@/constants/theme';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { AppStateProvider, useAppState } from '@/state/app-state';

void SplashScreen.preventAutoHideAsync();

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { hydrated, user } = useAppState();
  const ready = fontsReady && hydrated;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="masuk" />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="target" />
          <Stack.Screen name="rute/[id]" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const fontsReady = useAppFonts();

  return (
    <AppStateProvider>
      <RootNavigator fontsReady={fontsReady} />
    </AppStateProvider>
  );
}
