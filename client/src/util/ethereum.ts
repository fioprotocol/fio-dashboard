import { EIP6963ProviderDetail } from '@metamask/providers';

import { log } from './general';
import { AnyObject } from '../types';

let providers: EIP6963ProviderDetail[] = [];

export const METAMASK_PROVIDER_NAME = 'MetaMask';

export const store = {
  value: (): EIP6963ProviderDetail[] => providers,
  subscribe: (callback?: () => void): (() => void) => {
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

/**
 * Switches the Ethereum wallet to the target chain
 * @param params - Object containing provider, targetChainId, and optional currentChainId
 * @param params.provider - The Ethereum provider (e.g., MetaMask, WalletConnect)
 * @param params.targetChainId - The target chain ID to switch to
 * @param params.currentChainId - Optional current chain ID (if not provided, will be checked via provider)
 * @throws Error if switching fails
 */
export const switchEthereumChain = async ({
  provider,
  targetChainId,
  currentChainId,
}: {
  provider: AnyObject;
  targetChainId: number;
  currentChainId?: number;
}): Promise<void> => {
  if (!provider || !targetChainId) {
    log.error('Provider or targetChainId missing');
    return;
  }

  if (currentChainId === targetChainId) {
    return;
  }

  const hexChainId = `0x${targetChainId.toString(16)}`;
  log.info('Switching to chain ID:', hexChainId);

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError) {
    log.error('Error switching network:', switchError);
    throw switchError;
  }
};
