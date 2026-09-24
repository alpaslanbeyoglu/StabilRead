import { useEffect, useState, useCallback } from 'react';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        const sentinel = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<any> } }).wakeLock.request('screen');
        setIsLocked(true);
        sentinel.addEventListener('release', () => {
          setIsLocked(false);
        });
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }
  }, []);

  useEffect(() => {
    // Auto request wake lock on active reader
    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [requestWakeLock]);

  return { isLocked, isSupported, requestWakeLock };
}
