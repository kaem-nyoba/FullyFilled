/**
 * Design tokens dari Figma "FullyFilled v2 – Ceria".
 * Nilai warna diambil dari variabel Figma; radius/spacing dari komponen.
 */

export const colors = {
  bg: '#fff9ee',
  surface: '#ffffff',
  border: '#efe5d1',
  borderEdge: '#e2d5bb',
  text: '#1e2a22',
  muted: '#5e6a61',
  primary: '#18924a',
  primaryEdge: '#0e6a33',
  primarySoft: '#e4f5e8',
  onPrimary: '#ffffff',
  accent: '#ffc93c',
  accentSoft: '#fff2c7',
  accentText: '#7a5300',
  orange: '#e8741c',
  orangeSoft: '#ffe6d3',
  error: '#d53c3c',
  errorSoft: '#fde4e1',
  scrim: 'rgba(30, 42, 34, 0.45)',
  primaryFocusRing: 'rgba(24, 146, 74, 0.18)',
  errorFocusRing: 'rgba(213, 60, 60, 0.15)',
} as const;

export const fonts = {
  brandBold: 'Baloo2_700Bold',
  brandExtraBold: 'Baloo2_800ExtraBold',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 22,
  round: 999,
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screen: 24,
} as const;

/** Tinggi bottom nav di Figma: 92 (56 konten + 8 atas + 26 bawah + border). */
export const BOTTOM_NAV_HEIGHT = 92;

export type TextVariant =
  | 'brand'
  | 'display'
  | 'title'
  | 'heading'
  | 'cardTitle'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'captionStrong'
  | 'small'
  | 'metric'
  | 'metricSmall';

type TextStyleDef = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
};

export const textStyles: Record<TextVariant, TextStyleDef> = {
  brand: { fontFamily: fonts.brandExtraBold, fontSize: 24, lineHeight: 24, letterSpacing: -0.24 },
  display: { fontFamily: fonts.brandExtraBold, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  title: { fontFamily: fonts.brandExtraBold, fontSize: 28, lineHeight: 34, letterSpacing: -0.28 },
  heading: { fontFamily: fonts.brandExtraBold, fontSize: 24, lineHeight: 28, letterSpacing: -0.24 },
  cardTitle: { fontFamily: fonts.brandBold, fontSize: 19, lineHeight: 22, letterSpacing: -0.1 },
  body: { fontFamily: fonts.semiBold, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21 },
  label: { fontFamily: fonts.extraBold, fontSize: 15, lineHeight: 18 },
  caption: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19 },
  captionStrong: { fontFamily: fonts.extraBold, fontSize: 14, lineHeight: 19 },
  small: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 14, letterSpacing: 0.06 },
  metric: { fontFamily: fonts.black, fontSize: 30, lineHeight: 33, letterSpacing: -0.45 },
  metricSmall: { fontFamily: fonts.black, fontSize: 24, lineHeight: 26, letterSpacing: -0.24 },
};
