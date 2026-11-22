import { Heart } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors, radius } from '@/constants/theme';

export type SupportNoteProps = {
  children: string;
  /** `accent` = kuning (Beranda), `primary` = hijau muda (form Target). */
  tone?: 'accent' | 'primary';
  testID?: string;
};

/** Catatan semangat dengan ikon hati (Figma: Support). */
export function SupportNote({ children, tone = 'accent', testID }: SupportNoteProps) {
  const accent = tone === 'accent';
  const fg = accent ? colors.accentText : colors.primaryEdge;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: radius.sm + 2,
        backgroundColor: accent ? colors.accentSoft : colors.primarySoft,
      }}
      testID={testID}
    >
      <Heart color={fg} size={18} strokeWidth={2.4} />
      <Text color={fg} style={{ flex: 1, lineHeight: 19 }} variant="caption">
        {children}
      </Text>
    </View>
  );
}
