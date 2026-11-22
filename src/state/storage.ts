import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PersistedState } from '@/state/types';

const STORAGE_KEY = 'fullyfilled:state:v1';

export async function loadPersistedState(): Promise<PersistedState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { user: parsed.user ?? null, profile: parsed.profile ?? null };
  } catch {
    // Data rusak atau penyimpanan tidak tersedia: mulai dari kosong.
    return null;
  }
}

export async function savePersistedState(state: PersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Gagal menyimpan tidak boleh menghentikan aplikasi.
  }
}
