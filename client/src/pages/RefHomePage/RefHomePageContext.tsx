import { useCallback, useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { OPENED_METAMASK_WINDOW_ERROR_CODE } from '../../components/ConnectWallet/ConnectWalletButton/ConnectWalletButton';

import { refProfileInfo as refProfileInfoSelector } from '../../redux/refProfile/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { cartId as cartIdSelector } from '../../redux/cart/selectors';
import { userId as userIdSelector } from '../../redux/profile/selectors';

import apis from '../../api';
import MathOp from '../../util/math';
import { log } from '../../util/general';

import { addItem as addItemToCart } from '../../redux/cart/actions';

import useInitializeProviderConnection from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';

import { MORALIS_CHAIN_LIST } from '../../constants/ethereum';
import { NFT_LABEL, TOKEN_LABEL } from '../../constants/ref';
import { setFioName } from '../../utils';
import { DOMAIN_TYPE } from '../../constants/fio';
import { CART_ITEM_TYPE } from '../../constants/common';
import { convertFioPrices } from '../../util/prices';
import { ROUTES } from '../../constants/routes';

type UseContextProps = {
  disabled: boolean;
  hasFioHandleInfoMessage: boolean;
  hasFioVerificactionError: boolean;
  hasVerifiedError: boolean;
  infoMessage: string;
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
  customHandleSubmit: ({ address }: { address: string }) => Promise<void>;
  onClick: () => void;
  onFocusOut: (value: string) => string;
  onInputChanged: (value: string) => string;
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

  const cartId = useSelector(cartIdSelector);
  const refProfileInfo = useSelector(refProfileInfoSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userId = useSelector(userIdSelector);

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [
    showBrowserExtensionErrorModal,
    setShowBrowserExtensionErrorModal,
  ] = useState<boolean>(false);
  const [
    showSelectProviderModalVisible,
    setShowSelectProviderModalVisible,
  ] = useState<boolean>(false);
  const [showProviderLoadingIcon, setShowProviderLoadingIcon] = useState<
    boolean
  >(false);
  const [isVerified, toggleVerified] = useState<boolean>(false);
  const [hasVerifiedError, toggleHasVerifiedError] = useState<boolean>(false);
  const [verifyLoading, toggleVerifyLoading] = useState<boolean>(false);
  const [hasFioVerificactionError, toggleFioVerificationError] = useState<
    boolean
  >(false);
  const [hasFioHandleInfoMessage, toggleHasFioHandleInfoMessage] = useState<
    boolean
  >(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const history = useHistory();

  const asset = refProfileInfo?.settings?.gatedRegistration?.params?.asset;
  const contractAddress =
    refProfileInfo?.settings?.gatedRegistration?.params?.contractAddress;
  const refDomainObj = refProfileInfo?.settings?.domains[0];

  const verifiedMessage = `${refProfileInfo?.label} ${
    asset === NFT_LABEL ? 'NFT' : asset === TOKEN_LABEL ? 'Token' : ''
  } Holder Confirmed. Register your handle now!`;
  const nonVerifiedMessage = `${refProfileInfo?.label} ${
    asset === NFT_LABEL ? 'NFT' : asset === TOKEN_LABEL ? 'Token' : ''
  } Not Confirmed. Please make sure your NFT is held within your Metamask Wallet.`;

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
    toggleHasVerifiedError(false);

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

  const isValid = (address: string) => {
    if (!address) return;
    return !(
      address.startsWith('_') ||
      address.endsWith('_') ||
      address.startsWith('-') ||
      address.endsWith('-')
    );
  };

  const onFocusOut = (value: string) => {
    if (!value) return;

    if (!isValid(value)) {
      toggleFioVerificationError(true);
      setInfoMessage(
        'Handles which start or end with underscore or dash are not supported at this time.',
      );
      return value;
    }

    if (value.includes('_')) {
      value.replaceAll('_', '-');
      toggleHasFioHandleInfoMessage(true);
      setInfoMessage(
        'FIO Handles only support dashes so all underscores are replaced with dashes.',
      );
    } else {
      setInfoMessage('');
    }

    toggleFioVerificationError(false);

    return value;
  };

  const customHandleSubmit = useCallback(
    async ({ address: addressValue }: { address: string }) => {
      if (!addressValue) return;
      try {
        const { name: refDomain, isPremium } = refDomainObj || {};

        if (!refDomain) return;

        const isRegistered = await apis.fio.availCheckTableRows(
          setFioName(addressValue, refDomain),
        );

        if (isRegistered) {
          toggleFioVerificationError(true);
          setInfoMessage(
            'This handle is already registered. If you own it map it to your public addresses.',
          );
          return;
        }

        const { fio, usdc } = convertFioPrices(prices.nativeFio.address, roe);

        const fch = setFioName(addressValue, refDomain);
        const cartItem = {
          id: fch,
          address: addressValue,
          domain: refDomain,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: prices.nativeFio.address,
          domainType: isPremium ? DOMAIN_TYPE.PREMIUM : DOMAIN_TYPE.ALLOW_FREE,
          isFree: !isPremium,
          period: 1,
          type: CART_ITEM_TYPE.ADDRESS,
        };
        dispatch(
          addItemToCart({
            id: cartId,
            item: cartItem,
            prices: prices?.nativeFio,
            roe,
            userId,
          }),
        );

        history.push(ROUTES.CART);
      } catch (error) {
        log.error(error);
      }
    },
    [cartId, dispatch, history, prices.nativeFio, refDomainObj, roe, userId],
  );

  const onInputChanged = (value: string) => {
    (hasFioVerificactionError || hasFioHandleInfoMessage) &&
      setInfoMessage(verifiedMessage);

    toggleFioVerificationError(false);
    toggleHasFioHandleInfoMessage(false);

    return value;
  };

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

        if (!isVerified) {
          toggleHasVerifiedError(true);
        }
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

  useEffect(() => {
    if (isVerified) {
      setInfoMessage(verifiedMessage);
    }
    if (hasVerifiedError) {
      setInfoMessage(nonVerifiedMessage);
    }
  }, [hasVerifiedError, isVerified, nonVerifiedMessage, verifiedMessage]);

  return {
    disabled: hasVerifiedError || hasFioVerificactionError || !isVerified,
    hasFioHandleInfoMessage,
    hasFioVerificactionError,
    hasVerifiedError,
    infoMessage,
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
    customHandleSubmit,
    onClick,
    onFocusOut,
    onInputChanged,
    setConnectionError,
    setShowBrowserExtensionErrorModal,
  };
};
