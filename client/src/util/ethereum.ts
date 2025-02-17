import {
  EIP6963AnnounceProviderEvent,
  EIP6963ProviderDetail,
} from '@metamask/providers';

import { log } from './general';

let providers: EIP6963ProviderDetail[] = [];
const subscribe = () => {
  function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
    if (providers.some(p => p.info.uuid === event.detail.info.uuid)) return;

    providers = [...providers, event.detail];
  }

  window.addEventListener('eip6963:announceProvider', onAnnouncement as any);
  window.dispatchEvent(new Event('eip6963:requestProvider'));
};

subscribe();

export const isMetaMask = () => {
  try {
    const provider = providers?.find((p: EIP6963ProviderDetail) => {
      try {
        return p.info.name === 'MetaMask';
      } catch {
        return false;
      }
    });

    return !!provider;
  } catch (error) {
    log.error('Error checking MetaMask:', error);
    return false;
  }
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
