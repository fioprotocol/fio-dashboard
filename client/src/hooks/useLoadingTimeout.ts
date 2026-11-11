import { useEffect, useState } from 'react';

export const PAYMENT_LOADING_TIMEOUT_MS = 30000;

/**
 * Returns true once `isWaiting` has stayed true for `timeoutMs`.
 * Lets a spinner turn into an actionable error instead of spinning forever.
 */
export default function useLoadingTimeout(
  isWaiting: boolean,
  timeoutMs: number = PAYMENT_LOADING_TIMEOUT_MS,
): boolean {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isWaiting) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => setTimedOut(true), timeoutMs);

    return () => clearTimeout(timer);
  }, [isWaiting, timeoutMs]);

  return timedOut;
}
