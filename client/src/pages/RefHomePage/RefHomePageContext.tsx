import { useCallback, useState } from 'react';

import { ethers } from 'ethers';

import useInitializeProviderConnection from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';
import { log } from '../../util/general';
import { OPENED_METAMASK_WINDOW_ERROR_CODE } from '../../components/ConnectWallet/ConnectWalletButton/ConnectWalletButton';

type UseContextProps = {
  isWalletConnected: boolean;
  showBrowserExtensionErrorModal: boolean;
  showProviderWindowError: boolean;
  showProviderLoadingIcon: boolean;
  showSelectProviderModalVisible: boolean;
  connectWallet: () => void;
  closeSelectProviderModal: () => void;
  onClick: () => void;
  setConnectionError: (data: null) => void;
  setShowBrowserExtensionErrorModal: (show: boolean) => void;
};

export const useContext = (): UseContextProps => {
  const providerData = useInitializeProviderConnection();
  const {
    connectionError,
    setProvider,
    setWeb3Provider,
    setAddress,
    setConnectionError,
    setNetwork,
  } = providerData;

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [
    showBrowserExtensionErrorModal,
    setShowBrowserExtensionErrorModal,
  ] = useState<boolean>(false);
  const [
    showSelectProviderModalVisible,
    setShowSelectProviderModalVisible,
  ] = useState<boolean>(false);
  const [showProviderLoadingIcon, setShowProviderLoadingIcon] = useState(false);

  const closeSelectProviderModal = useCallback(() => {
    setShowProviderLoadingIcon(false);
    setShowSelectProviderModalVisible(false);
  }, []);

  const connectWallet = useCallback(async () => {
    setShowProviderLoadingIcon(true);

    const provider = window.ethereum;

    if (!provider) {
      setShowBrowserExtensionErrorModal(true);
      log.error('!window.ethereum');
      setShowProviderLoadingIcon(false);
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await web3Provider.getNetwork();

    try {
      await provider.request({
        method: 'eth_requestAccounts',
      });

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setWeb3Provider(web3Provider);
      setAddress(address);
      setNetwork(network);

      closeSelectProviderModal();
      setIsWalletConnected(true);
    } catch (error) {
      setConnectionError(error);
      setShowProviderLoadingIcon(false);
    }
  }, [
    closeSelectProviderModal,
    setAddress,
    setConnectionError,
    setNetwork,
    setProvider,
    setWeb3Provider,
  ]);

  const onClick = useCallback(() => {
    setShowSelectProviderModalVisible(true);
  }, []);

  return {
    isWalletConnected,
    showBrowserExtensionErrorModal,
    showProviderWindowError:
      connectionError?.code === OPENED_METAMASK_WINDOW_ERROR_CODE,
    showProviderLoadingIcon,
    showSelectProviderModalVisible,
    connectWallet,
    closeSelectProviderModal,
    onClick,
    setConnectionError,
    setShowBrowserExtensionErrorModal,
  };
};
