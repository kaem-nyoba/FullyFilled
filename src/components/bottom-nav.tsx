import { Compass, House, Utensils, type LucideIcon } from 'lucide-react-native';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { colors } from '@/constants/theme';

const TABS: Record<string, { label: string; icon: LucideIcon }> = {
  index: { label: 'Beranda', icon: House },
  'ide-makan': { label: 'Ide makan', icon: Utensils },
  sekitar: { label: 'Sekitar', icon: Compass },
};

/** Navigasi bawah (Figma: BottomNav). Tab aktif ditandai pil hijau dan label tebal. */
export function BottomNav({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 8,
        paddingHorizontal: 16,
        paddingBottom: Math.max(insets.bottom, 12) + 6,
        backgroundColor: colors.surface,
        borderTopWidth: 2,
        borderTopColor: colors.border,
      }}
    >
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;

        const focused = state.index === index;
        const Icon = tab.icon;

        const onPress = () => {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <Pressable
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', gap: 4 }}
            testID={`tab-${route.name}`}
          >
            <View
              style={{
                width: 56,
                height: 30,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? colors.primarySoft : 'transparent',
              }}
            >
              <Icon
                color={focused ? colors.primaryEdge : colors.muted}
                size={22}
                strokeWidth={focused ? 2.4 : 2}
              />
            </View>
            <Text
              color={focused ? colors.primaryEdge : colors.muted}
              style={{ fontFamily: focused ? 'Nunito_900Black' : 'Nunito_700Bold' }}
              variant="small"
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
