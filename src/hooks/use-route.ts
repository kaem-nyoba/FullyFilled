import { useCallback, useEffect, useState } from 'react';
import { fetchRoute, type RouteResult } from '@/services/route-service';
import { useAppState } from '@/state/app-state';

export type RouteState =
  | { status: 'loading' }
  | { status: 'ready'; route: RouteResult }
  | { status: 'error'; message: string };

/** Memuat rute ke sebuah tempat, dengan status memuat, siap, dan gagal, plus coba lagi. */
export function useRoute(placeId: string): { state: RouteState; retry: () => void } {
  const [state, setState] = useState<RouteState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const { profile } = useAppState();
  const weightKg = profile?.currentKg;
  useEffect(() => {
    const controller = new AbortController();

        fetchRoute(placeId, { signal: controller.signal, weightKg })
      .then((route) => setState({ status: 'ready', route }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Rutenya belum ketemu.',
        });
      });

    return () => controller.abort();
  }, [placeId, attempt,weightKg]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }, []);

  return { state, retry };
}
