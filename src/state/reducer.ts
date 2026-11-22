import type { AppAction, AppState } from '@/state/types';

export const initialState: AppState = { hydrated: false, user: null, profile: null };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'hydrate':
      return {
        hydrated: true,
        user: action.payload?.user ?? null,
        profile: action.payload?.profile ?? null,
      };
    case 'sign-in':
      return { ...state, user: action.user };
    case 'sign-out':
      // Profil milik akun, jadi ikut dihapus agar tidak bocor ke akun berikutnya.
      return { ...state, user: null, profile: null };
    case 'save-profile':
      return { ...state, profile: action.profile };
  }
}
