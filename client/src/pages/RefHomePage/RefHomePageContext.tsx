import { useCallback, useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { OPENED_METAMASK_WINDOW_ERROR_CODE } from '../../components/ConnectWallet/ConnectWalletButton/ConnectWalletButton';

import {
  isNoProfileFlow as isNoProfileFlowSelector,
  refProfileInfo as refProfileInfoSelector,
} from '../../redux/refProfile/selectors';
import {
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { cartItems as cartItemsSelector } from '../../redux/cart/selectors';
import {
  userId as userIdSelector,
  usersFreeAddresses as usersFreeAddressesSelector,
  lastAuthData as lastAuthDataSelector,
} from '../../redux/profile/selectors';

import apis from '../../api';
import { log } from '../../util/general';
import { isDomainExpired, validateFioAddress } from '../../util/fio';
import useQuery from '../../hooks/useQuery';

import { addItem as addItemToCart } from '../../redux/cart/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { setRedirectPath } from '../../redux/navigation/actions';

import useInitializeProviderConnection, {
  ConnectionErrorType,
} from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';
import { useMetaMaskProvider } from '../../hooks/useMetaMaskProvider';

import { MORALIS_CHAIN_LIST } from '../../constants/ethereum';
import { NFT_LABEL, TOKEN_LABEL } from '../../constants/ref';
import { FIO_ADDRESS_DELIMITER, setFioName } from '../../utils';
import { DOMAIN_TYPE } from '../../constants/fio';
import { CART_ITEM_TYPE } from '../../constants/common';
import { convertFioPrices } from '../../util/prices';
import { ROUTES } from '../../constants/routes';

import { AnyObject, RefProfileDomain } from '../../types';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

type UseContextProps = {
  connectButtonDisabled?: boolean;
  disabled: boolean;
  gatedChainName?: string;
  hasFioVerificationError: boolean;
  hasVerifiedError: boolean;
  infoMessage: string;
  isGatedFlow?: boolean;
  isVerified: boolean;
  isWalletConnected: boolean;
  loaderText: string;
  publicKey: string | null;
  refDomain: string;
  refDomainObjs: RefProfileDomain[];
  showBrowserExtensionErrorModal: boolean;
  showProviderWindowError: boolean;
  showProviderLoadingIcon: boolean;
  showSelectProviderModalVisible: boolean;
  verifyLoading: boolean;
  connectWallet: () => void;
  closeSelectProviderModal: () => void;
  customHandleSubmit: (data: {
    address: string;
    domain?: string;
  }) => Promise<void>;
  onClick: () => void;
  onFocusOut: (value: string) => string;
  onInputChanged: (value: string) => string;
  setRefDomain: (value: string) => void;
  setConnectionError: (data: null) => void;
  setShowBrowserExtensionErrorModal: (show: boolean) => void;
};

export const useContext = (): UseContextProps => {
  const providerData = useInitializeProviderConnection();
  const {
    address,
    connectionError,
    provider,
    setProvider,
    setWeb3Provider,
    setAddress,
    setConnectionError,
    setNetwork,
  } = providerData;

  const cartItems = useSelector(cartItemsSelector);
  const lastAuthData = useSelector(lastAuthDataSelector);
  const refProfileInfo = useSelector(refProfileInfoSelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userId = useSelector(userIdSelector);
  const usersFreeAddresses = useSelector(usersFreeAddressesSelector);
  const isNoProfileFlow = useSelector(isNoProfileFlowSelector);

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
  const [hasFioVerificationError, toggleFioVerificationError] = useState<
    boolean
  >(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [gatedToken, setGatedToken] = useState<string | null>(null);
  const metaMaskProvider = useMetaMaskProvider();

  const dispatch = useDispatch();
  const history = useHistory();
  const queryParams = useQuery();

  const publicKey = queryParams?.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const refCode = refProfileInfo?.code;

  const isAlternativeUser = !!metaMaskProvider;

  const cartHasFreeItem = cartItems.some(
    cartItem =>
      cartItem.isFree && cartItem.domainType === DOMAIN_TYPE.ALLOW_FREE,
  );

  const asset = refProfileInfo?.settings?.gatedRegistration?.params?.asset;

  const refDomainObjs = useMemo(
    () =>
      refProfileInfo?.settings?.domains.filter(refDomainItem => {
        if (!refDomainItem.expirationDate) return false;

        const isExpired = isDomainExpired(
          refDomainItem.name,
          refDomainItem.expirationDate,
        );

        return !isExpired;
      }) ?? [],
    [refProfileInfo],
  );

  const [refDomain, setRefDomain] = useState(
    refDomainObjs.length > 0 ? refDomainObjs[0]?.name : '',
  );

  const isGatedFlow = refProfileInfo?.settings?.gatedRegistration?.isOn;
  const gatedChainId =
    refProfileInfo?.settings?.gatedRegistration?.params?.chainId;
  const gatedChainName =
    isGatedFlow && gatedChainId
      ? MORALIS_CHAIN_LIST.find(
          chainListItem =>
            chainListItem.chainId.toString() === gatedChainId.toString(),
        )?.name
      : null;

  const existingUsersFreeAddress =
    usersFreeAddresses &&
    usersFreeAddresses.find(
      freeAddress =>
        freeAddress.name.split(FIO_ADDRESS_DELIMITER)[1] === refDomain,
    );

  const verifiedMessage = `${refProfileInfo?.label} ${
    asset === NFT_LABEL ? 'NFT' : asset === TOKEN_LABEL ? 'Token' : ''
  } Holder Confirmed. Register your handle now!`;
  const nonVerifiedMessage = `${refProfileInfo?.label} ${
    asset === NFT_LABEL ? 'NFT' : asset === TOKEN_LABEL ? 'Token' : ''
  } Not Confirmed. Please make sure your NFT is held within your Metamask Wallet.`;
  const wrongSignMessage = 'Metamask Sign failed';
  const allDomainsHasBeenExpiredOrDoesnotExists =
    'FIO Handle registrations temporarily unavailable.';

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
    toggleFioVerificationError(false);

    if (!metaMaskProvider) {
      setShowBrowserExtensionErrorModal(true);
      log.error('!window.ethereum');
      setShowProviderLoadingIcon(false);
      return;
    }

    const web3Provider = new ethers.providers.Web3Provider(metaMaskProvider);
    const network = await web3Provider.getNetwork();

    try {
      await metaMaskProvider.request({
        method: 'eth_requestAccounts',
      });

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(metaMaskProvider);
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
    metaMaskProvider,
  ]);

  const handleDisconnect = useCallback(
    async (
      setIsWalletConnectedStateInInput: (val?: boolean) => void,
      provider?: AnyObject,
    ) => {
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect();
      }
      setProvider(null);
      setAddress(null);
      setNetwork(null);
      setConnectionError(null);
      setIsWalletConnectedStateInInput(false);
      toggleVerified(false);
    },
    [setAddress, setConnectionError, setNetwork, setProvider],
  );

  useEffect(() => {
    if (provider?.on) {
      const disconnect = (error?: ConnectionErrorType) => {
        if (error) log.info('disconnect', error);
        handleDisconnect(setIsWalletConnected, provider);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        log.info('accountsChanged', accounts);
        if (accounts.length) {
          setAddress(accounts[0]);
          if (connectionError?.code === OPENED_METAMASK_WINDOW_ERROR_CODE)
            setConnectionError(null);
        } else {
          // clear form value when user manually disconnects all addresses by metamask interface
          // (not the same as 'disconnect' event)
          disconnect();
        }
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', disconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', disconnect);
        }
      };
    }
  }, [
    provider,
    connectionError,
    handleDisconnect,
    setAddress,
    setConnectionError,
    setIsWalletConnected,
  ]);

  const onFocusOut = (value: string) => {
    if (!value) return;

    const isNotValidAddressError = validateFioAddress(value, refDomain);

    if (isNotValidAddressError) {
      toggleFioVerificationError(true);
      setInfoMessage(isNotValidAddressError);
      return value;
    }

    toggleFioVerificationError(false);

    return value;
  };

  const customHandleSubmit = useCallback(
    async ({
      address: addressValue,
      domain: domainValue,
    }: {
      address: string;
      domain?: string;
    }) => {
      if (!addressValue) return;

      try {
        const refDomainObj = refDomainObjs.find(it => it.name === domainValue);

        if (!domainValue || !refDomainObj) return;

        const { isPremium } = refDomainObj || {};

        const isRegistered = await apis.fio.availCheckTableRows(
          setFioName(addressValue, domainValue),
        );

        if (isRegistered) {
          toggleFioVerificationError(true);
          setInfoMessage(
            'This handle is already registered. If you own it map it to your public addresses.',
          );
          return;
        }

        const { fio, usdc } = convertFioPrices(prices.nativeFio.address, roe);

        const fch = setFioName(addressValue, domainValue);
        const cartItem = {
          id: fch,
          address: addressValue,
          domain: domainValue,
          costFio: fio,
          costUsdc: usdc,
          costNativeFio: prices.nativeFio.address,
          domainType: isPremium ? DOMAIN_TYPE.PREMIUM : DOMAIN_TYPE.ALLOW_FREE,
          isFree: !isPremium && !cartHasFreeItem && !existingUsersFreeAddress,
          period: 1,
          type: CART_ITEM_TYPE.ADDRESS,
        };

        dispatch(
          addItemToCart({
            item: cartItem,
            refCode,
            token: gatedToken,
          }),
        );

        const DEFAULT_ROUTE = ROUTES.CART;

        if (userId) {
          history.push(DEFAULT_ROUTE);
        } else if (!isNoProfileFlow) {
          dispatch(setRedirectPath({ pathname: DEFAULT_ROUTE }));
          lastAuthData || isAlternativeUser
            ? dispatch(showLoginModal(DEFAULT_ROUTE))
            : history.push(ROUTES.CREATE_ACCOUNT);
        }
      } catch (error) {
        log.error(error);
      }
    },
    [
      prices.nativeFio,
      refCode,
      roe,
      cartHasFreeItem,
      existingUsersFreeAddress,
      dispatch,
      gatedToken,
      isNoProfileFlow,
      history,
      lastAuthData,
      isAlternativeUser,
    ],
  );

  const onInputChanged = (value: string) => {
    hasFioVerificationError && setInfoMessage(verifiedMessage);

    toggleFioVerificationError(false);

    return value;
  };

  const siweSign = useCallback(async () => {
    const siweMessage = process.env.REACT_APP_METAMASK_SIGN_MESSAGE;
    try {
      const msg = `0x${Buffer.from(siweMessage, 'utf8').toString('hex')}`;
      const sign = await provider.request({
        method: 'personal_sign',
        params: [msg, address],
      });
      return sign;
    } catch (err) {
      log.error(err);
      toggleHasVerifiedError(true);
      setInfoMessage(wrongSignMessage);
    }
  }, [address, provider]);

  const verifyUsersData = useCallback(
    async ({ address }: { address: string }) => {
      if (address) {
        toggleVerifyLoading(true);

        const signedMessage = await siweSign();

        try {
          const verified = await apis.metamask.verifyMetamask({
            address,
            refId: refProfileInfo?.id,
            signedMessage,
          });

          const { isVerified, token } = verified || {};

          if (!token) {
            toggleHasVerifiedError(true);
            setInfoMessage(nonVerifiedMessage);
          }

          setGatedToken(token);
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
    },
    [nonVerifiedMessage, refProfileInfo?.id, siweSign],
  );

  const onClick = useCallback(() => {
    if (address) {
      verifyUsersData({ address });
    } else {
      setShowSelectProviderModalVisible(true);
    }
  }, [address, verifyUsersData]);

  useEffect(() => {
    if (!address) return;

    verifyUsersData({ address });
  }, [address, verifyUsersData]);

  useEffect(() => {
    if (isVerified && !hasFioVerificationError) {
      setInfoMessage(verifiedMessage);
      toggleHasVerifiedError(false);
    }

    if (hasVerifiedError && !infoMessage?.includes(wrongSignMessage)) {
      setInfoMessage(nonVerifiedMessage);
    }
  }, [
    hasFioVerificationError,
    hasVerifiedError,
    infoMessage,
    isVerified,
    nonVerifiedMessage,
    verifiedMessage,
  ]);

  useEffect(() => {
    if (refProfileInfo && !refDomain) {
      toggleFioVerificationError(true);
      setInfoMessage(allDomainsHasBeenExpiredOrDoesnotExists);
    }
  }, [refProfileInfo, refDomain]);

  return {
    connectButtonDisabled:
      hasFioVerificationError &&
      infoMessage === allDomainsHasBeenExpiredOrDoesnotExists,
    disabled: hasVerifiedError || hasFioVerificationError || !isVerified,
    gatedChainName,
    hasFioVerificationError,
    hasVerifiedError,
    infoMessage,
    isGatedFlow,
    isVerified,
    isWalletConnected,
    loaderText,
    publicKey,
    refDomain,
    refDomainObjs,
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
    setRefDomain,
    setConnectionError,
    setShowBrowserExtensionErrorModal,
  };
};
