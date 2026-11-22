import { Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';

/** Memuat font Baloo 2 (judul) dan Nunito (isi). Mengembalikan true saat siap. */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  // Jika font gagal dimuat, tetap lanjut dengan font sistem daripada menahan aplikasi.
  return loaded || error != null;
}
