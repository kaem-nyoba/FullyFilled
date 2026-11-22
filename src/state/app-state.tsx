import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { appReducer, initialState } from '@/state/reducer';
import { loadPersistedState, savePersistedState } from '@/state/storage';
import type { AppState, Profile, User } from '@/state/types';

type AppStateValue = AppState & {
  signIn: (user: User) => void;
  signOut: () => void;
  saveProfile: (profile: Omit<Profile, 'savedAt'>) => Profile;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    let active = true;
    loadPersistedState().then((persisted) => {
      if (active) dispatch({ type: 'hydrate', payload: persisted });
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    void savePersistedState({ user: state.user, profile: state.profile });
  }, [state.hydrated, state.user, state.profile]);

  const signIn = useCallback((user: User) => dispatch({ type: 'sign-in', user }), []);
  const signOut = useCallback(() => dispatch({ type: 'sign-out' }), []);
  const saveProfile = useCallback((profile: Omit<Profile, 'savedAt'>) => {
    const saved: Profile = { ...profile, savedAt: Date.now() };
    dispatch({ type: 'save-profile', profile: saved });
    return saved;
  }, []);

  const value = useMemo(
    () => ({ ...state, signIn, signOut, saveProfile }),
    [state, signIn, signOut, saveProfile],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState harus dipakai di dalam <AppStateProvider>.');
  return value;
}
