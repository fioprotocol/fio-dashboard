import { EIP6963ProviderDetail } from '@metamask/providers';

import { log } from './general';

let providers: EIP6963ProviderDetail[] = [];

export const METAMASK_PROVIDER_NAME = 'MetaMask';

export const store = {
  value: () => providers,
  subscribe: (callback?: () => void) => {
    function onAnnouncement(event: CustomEvent<EIP6963ProviderDetail>) {
      if (providers.map(p => p.info.uuid).includes(event.detail.info.uuid))
        return;
      providers = [...providers, event.detail];
      callback && callback();
    }
    window.addEventListener(
      'eip6963:announceProvider',
      onAnnouncement as EventListener,
    );
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () =>
      window.removeEventListener(
        'eip6963:announceProvider',
        onAnnouncement as EventListener,
      );
  },
};

export const isOpera = () => {
  try {
    const provider = providers?.find((p: EIP6963ProviderDetail) => {
      try {
        return p.info.name === 'Opera';
      } catch {
        return false;
      }
    });

    return !!provider;
  } catch (error) {
    log.error('Error checking Opera wallet:', error);
    return false;
  }
};
