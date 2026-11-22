import { CircleCheck } from 'lucide-react-native';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { Press3D } from '@/components/ui/press-3d';
import { Text } from '@/components/ui/text';
import { colors, radius } from '@/constants/theme';

export type MenuCardProps = {
  name: string;
  portion: string;
  kcal: number;
  reason: string;
  onPress?: () => void;
  testID?: string;
};

/** Kartu ide makan: nama, porsi, energi, dan alasan konkret. Ketuk membuka detail (Figma: MenuCard). */
export function MenuCard({ name, portion, kcal, reason, onPress, testID }: MenuCardProps) {
  return (
    <Press3D
      accessibilityHint="Buka detail menu"
      accessibilityLabel={`${name}, ${kcal} kilokalori, ${reason}`}
      edgeColor={colors.borderEdge}
      faceStyle={{
        gap: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
      onPress={onPress}
      radius={radius.lg}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.orangeSoft,
          }}
        >
          <Image
            accessible={false}
            contentFit="contain"
            source={require('@/assets/illustrations/bowl.svg')}
            style={{ width: 48, height: 48 }}
          />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="cardTitle">{name}</Text>
          <Text color={colors.muted} variant="caption">
            {portion}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text variant="metricSmall">{kcal}</Text>
          <Text color={colors.muted} variant="small" style={{ letterSpacing: 0.24 }}>
            kkal
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: radius.sm,
          backgroundColor: colors.primarySoft,
        }}
      >
        <CircleCheck color={colors.primary} size={18} strokeWidth={2.4} />
        <Text color={colors.primaryEdge} style={{ flex: 1 }} variant="captionStrong">
          {reason}
        </Text>
      </View>
    </Press3D>
  );
}
