import { useState, useLayoutEffect, useDebugValue, useEffect } from 'react';
import { BaseProvider } from '@metamask/providers';

import { store, METAMASK_PROVIDER_NAME } from '../util/ethereum';

function checkIfSnapshotChanged<T>(inst: {
  value: T;
  getSnapshot: () => T;
}): boolean {
  const latestGetSnapshot = inst.getSnapshot;
  const prevValue = inst.value;
  try {
    const nextValue = latestGetSnapshot();
    return JSON.stringify(prevValue) !== JSON.stringify(nextValue);
  } catch (error) {
    return true;
  }
}

// todo: this is a copy of the useSyncExternalStore hook from react (https://github.com/facebook/react/blob/4632e36a4ef16a1af24987c56e42b664f6403e64/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js#L30)
// we probably should use the one from react 18 instead (for this we need update the react) or install https://www.npmjs.com/package/use-sync-external-store
function useSyncExternalStore<T>(
  subscribe: (cb?: () => void) => () => void,
  getSnapshot: () => T,
): T {
  const value = getSnapshot();
  const [{ inst }, forceUpdate] = useState({ inst: { value, getSnapshot } });
  useLayoutEffect(() => {
    inst.value = value;
    inst.getSnapshot = getSnapshot;
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst });
    }
  }, [subscribe, value, getSnapshot, inst]);

  useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst });
    }
    const handleStoreChange = () => {
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({ inst });
      }
    };

    return subscribe(handleStoreChange);
  }, [inst, subscribe]);

  useDebugValue(value);
  return value;
}

export const useMetaMaskProvider = (): BaseProvider | undefined => {
  const providers = useSyncExternalStore(store.subscribe, store.value);

  return providers.find(p => p.info.name === METAMASK_PROVIDER_NAME)?.provider;
};
