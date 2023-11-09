import { useCallback, useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { useSelector } from 'react-redux';

import { OPENED_METAMASK_WINDOW_ERROR_CODE } from '../../components/ConnectWallet/ConnectWalletButton/ConnectWalletButton';

import { refProfileInfo as refProfileInfoSelector } from '../../redux/refProfile/selectors';

import apis from '../../api';
import MathOp from '../../util/math';
import { log } from '../../util/general';

import useInitializeProviderConnection from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';

import { MORALIS_CHAIN_LIST } from '../../constants/ethereum';
import { NFT_LABEL, TOKEN_LABEL } from '../../constants/ref';

type UseContextProps = {
  hasVerifiedError: boolean;
  isVerified: boolean;
  isWalletConnected: boolean;
  loaderText: string;
  showBrowserExtensionErrorModal: boolean;
  showProviderWindowError: boolean;
  showProviderLoadingIcon: boolean;
  showSelectProviderModalVisible: boolean;
  verifyLoading: boolean;
  connectWallet: () => void;
  closeSelectProviderModal: () => void;
  onClick: () => void;
  setConnectionError: (data: null) => void;
  setShowBrowserExtensionErrorModal: (show: boolean) => void;
};

export const useContext = (): UseContextProps => {
  const providerData = useInitializeProviderConnection();
  const {
    address,
    connectionError,
    network,
    setProvider,
    setWeb3Provider,
    setAddress,
    setConnectionError,
    setNetwork,
  } = providerData;

  const refProfileInfo = useSelector(refProfileInfoSelector);

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
  const [isVerified, toggleVerified] = useState(false);
  const [hasVerifiedError, toggleHasVerifiedError] = useState(false);
  const [verifyLoading, toggleVerifyLoading] = useState(false);

  const asset = refProfileInfo?.settings?.gatedRegistration?.params?.asset;
  const contractAddress =
    refProfileInfo?.settings?.gatedRegistration?.params?.contractAddress;
  const loaderText =
    asset === NFT_LABEL
      ? 'Verifying NFT holdings'
      : asset === TOKEN_LABEL
      ? 'Verifying Token holdings'
      : 'Verifying ...';

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

  const getNfts = useCallback(
    async (chainName: string) => {
      const nftsList = await apis.externalProviderNfts.getAllNfts(
        address,
        chainName,
      );

      const hasRefContract = nftsList.find(
        nftItem => nftItem.token_address === contractAddress,
      );

      return !!hasRefContract;
    },
    [address, contractAddress],
  );

  const getAllTokens = useCallback(
    async (chainName: string) => {
      const tokensList = await apis.externalProviderNfts.getAllExternalTokens({
        address,
        chainName,
      });

      const hasRefContract = tokensList.find(
        tokenItem =>
          tokenItem.token_address === contractAddress &&
          new MathOp(tokenItem.balance).gt(0),
      );

      return !!hasRefContract;
    },
    [address, contractAddress],
  );

  const verifyUsersData = useCallback(async () => {
    const chain = MORALIS_CHAIN_LIST.find(
      chainItem => chainItem.chainId === network?.chainId,
    );

    const { chainName } = chain || {};

    if (chainName) {
      toggleVerifyLoading(true);
      let isVerified = false;

      try {
        if (asset === NFT_LABEL && network?.chainId) {
          isVerified = await getNfts(chainName);
        }

        if (asset === TOKEN_LABEL && network?.chainId) {
          isVerified = await getAllTokens(chainName);
        }

        toggleVerified(isVerified);
      } catch (error) {
        log.error(error);
        toggleVerified(false);
        toggleHasVerifiedError(true);
      } finally {
        toggleVerifyLoading(false);
      }
    }
  }, [asset, getAllTokens, getNfts, network?.chainId]);

  useEffect(() => {
    if (network?.chainId) {
      verifyUsersData();
    }
  }, [network?.chainId, verifyUsersData]);

  return {
    hasVerifiedError,
    isVerified,
    isWalletConnected,
    loaderText,
    showBrowserExtensionErrorModal,
    showProviderWindowError:
      connectionError?.code === OPENED_METAMASK_WINDOW_ERROR_CODE,
    showProviderLoadingIcon,
    showSelectProviderModalVisible,
    verifyLoading,
    connectWallet,
    closeSelectProviderModal,
    onClick,
    setConnectionError,
    setShowBrowserExtensionErrorModal,
  };
};
