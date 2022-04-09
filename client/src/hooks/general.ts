import { useEffect, useRef } from 'react';

export function useEffectOnce(
  callback: () => void,
  dependencyArray: any[],
  caseExpression: boolean = true,
) {
  const mount = useRef(false);

  useEffect(() => {
    if (!mount.current && caseExpression) {
      callback();
      mount.current = true;
    }
  }, [caseExpression, callback, ...dependencyArray]);
}

export default useEffectOnce;
