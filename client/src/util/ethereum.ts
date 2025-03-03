import { EIP6963ProviderDetail } from '@metamask/providers';

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
