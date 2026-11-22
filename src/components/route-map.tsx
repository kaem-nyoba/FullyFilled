import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/constants/theme';

/**
 * Ilustrasi peta rute (Figma 5b). Sementara berupa gambar vektor statis;
 * ganti dengan peta sungguhan saat layanan peta terhubung.
 */
export function RouteMap({ testID }: { testID?: string }) {
  return (
    <Svg
      accessibilityLabel="Ilustrasi peta rute jalan kaki"
      accessibilityRole="image"
      height="100%"
      testID={testID}
      viewBox="0 0 342 210"
      width="100%"
    >
      <Rect fill="#f3eee2" height="210" rx="20" width="342" />
      {/* jalan */}
      <Path d="M0 60H342M0 160H342M90 0V210M250 0V210" stroke="#ffffff" strokeWidth="10" />
      {/* blok bangunan dan taman */}
      <Rect fill="#f1dfcd" height="70" rx="8" width="62" x="14" y="74" />
      <Rect fill="#f1dfcd" height="70" rx="8" width="60" x="104" y="74" />
      <Rect fill="#f1dfcd" height="40" rx="8" width="64" x="172" y="74" />
      <Rect fill="#d7ecd6" height="72" rx="8" width="72" x="262" y="74" />
      {/* rute */}
      <Path
        d="M50 160V60H290V94"
        fill="none"
        stroke={colors.primary}
        strokeDasharray="2 8"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <Circle cx="50" cy="160" fill={colors.primary} r="9" stroke="#ffffff" strokeWidth="3" />
      {/* tujuan */}
      <Path
        d="M290 112C284 104 276 98 276 90C276 82 282 76 290 76C298 76 304 82 304 90C304 98 296 104 290 112Z"
        fill={colors.orange}
      />
      <Circle cx="290" cy="90" fill="#ffffff" r="5" />
    </Svg>
  );
}
