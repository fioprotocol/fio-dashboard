import { useEffect, useRef } from 'react';

export function useEffectOnce(callback: () => void, dependencyArray: any[]) {
  const mount = useRef(false);

  useEffect(() => {
    if (!mount.current) {
      callback();
      mount.current = true;
    }
  }, [callback, ...dependencyArray]);
}

export default useEffectOnce;
