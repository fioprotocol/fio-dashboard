import { log } from './general';

declare global {
  interface WindowEventMap {
    'eip6963:announceProvider': CustomEvent<EIP6963AnnounceProviderEvent>;
  }
}

interface EIP1193Provider {
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void;
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void,
  ) => void;
  request: (request: {
    method: string;
    params?: Array<unknown>;
  }) => Promise<unknown>;
}

interface EIP6963ProviderInfo {
  rdns: string;
  uuid: string;
  name: string;
  icon: string;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo;
    provider: Readonly<EIP1193Provider>;
  };
};

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
