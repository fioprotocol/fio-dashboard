import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';

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

export const useMakeActionOnPathChange = ({
  action,
  route,
}: {
  action: () => void;
  route: string;
}): void => {
  const history = useHistory();

  useEffect(() => {
    // Setup navigation listener
    const unlisten = history.listen(({ pathname }) => {
      if (pathname !== route) {
        action();
      }
    });

    // Cleanup listener on unmount
    return () => {
      unlisten();
    };
  }, [action, history, route]);
};
