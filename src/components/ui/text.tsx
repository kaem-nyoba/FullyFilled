import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, textStyles, type TextVariant } from '@/constants/theme';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
};

export function Text({ variant = 'body', color = colors.text, style, ...rest }: TextProps) {
  return <RNText style={[textStyles[variant], { color }, style]} {...rest} />;
}
