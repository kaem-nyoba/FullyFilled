export type User = {
  email: string;
  name: string;
};

export type Profile = {
  currentKg: number;
  goalKg: number;
  ingredients: string[];
  activities: string[];
  /** Waktu simpan (ms). Dipakai sebagai pemicu animasi celebrate Nyam. */
  savedAt: number;
};

export type AppState = {
  hydrated: boolean;
  user: User | null;
  profile: Profile | null;
};

export type PersistedState = Pick<AppState, 'user' | 'profile'>;

export type AppAction =
  | { type: 'hydrate'; payload: PersistedState | null }
  | { type: 'sign-in'; user: User }
  | { type: 'sign-out' }
  | { type: 'save-profile'; profile: Profile };
