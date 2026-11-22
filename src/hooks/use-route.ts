import { useCallback, useEffect, useState } from 'react';

import { fetchRoute, type RouteResult } from '@/services/route-service';

export type RouteState =
  | { status: 'loading' }
  | { status: 'ready'; route: RouteResult }
  | { status: 'error'; message: string };

/** Memuat rute ke sebuah tempat, dengan status memuat, siap, dan gagal, plus coba lagi. */
export function useRoute(placeId: string): { state: RouteState; retry: () => void } {
  const [state, setState] = useState<RouteState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchRoute(placeId, { signal: controller.signal })
      .then((route) => setState({ status: 'ready', route }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Rutenya belum ketemu.',
        });
      });

    return () => controller.abort();
  }, [placeId, attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }, []);

  return { state, retry };
}
