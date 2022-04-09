import { useEffect, useRef } from 'react';

import { AnyType } from '../types';

export function useEffectOnce(
  callback: () => void,
  dependencyArray: AnyType[],
  caseExpression: boolean = true,
): void {
  const mount = useRef(false);

  useEffect(() => {
    if (!mount.current && caseExpression) {
      callback();
      mount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseExpression, callback, ...dependencyArray]);
}

export default useEffectOnce;
