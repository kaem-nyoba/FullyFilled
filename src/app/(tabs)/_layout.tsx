import { Tabs } from 'expo-router/js-tabs';

import { BottomNav } from '@/components/bottom-nav';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomNav {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="ide-makan" options={{ title: 'Ide makan' }} />
      <Tabs.Screen name="sekitar" options={{ title: 'Sekitar' }} />
    </Tabs>
  );
}
