import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import ModalComponent from '../../Modal/Modal';
import DangerModal from '../../Modal/DangerModal';
import { LoadingIcon } from '../../Input/StaticInputParts';

import { log } from '../../../util/general';
import { switchEthereumChain } from '../../../util/ethereum';
import { AnyObject } from '../../../types';
import {
  ConnectionErrorType,
  ConnectProviderType,
} from '../../../hooks/externalWalletsConnection/useInitializeProviderConnection';
import { useMetaMaskProvider } from '../../../hooks/useMetaMaskProvider';

import classes from '../../Input/Input.module.scss';

import metamaskIcon from '../../../assets/images/metamask.svg';

type Props = {
  isVisible?: boolean;
  handleAddressChange?: (address: string) => void;
  setIsWalletConnected?: (value: boolean) => void;
  isWalletConnected?: boolean;
  inputValue?: string;
  description?: string;
  wFioBalance?: string;
  targetChainId?: number;
} & ConnectProviderType;

export const OPENED_METAMASK_WINDOW_ERROR_CODE = -32002;

const ConnectWalletButton: React.FC<Props> = props => {
  const {
    provider,
    web3Provider,
    connectionError,
    address,
    setProvider,
    setWeb3Provider,
    setConnectionError,
    setAddress,
    setNetwork,
    handleAddressChange,
    inputValue,
    isVisible,
    setIsWalletConnected,
    isWalletConnected,
    description = 'Please connect your Polygon wallet with the FIO domain that you would like to unwrap to the FIO network.',
    targetChainId,
  } = props;

  const [
    showBrowserExtensionErrorModal,
    setShowBrowserExtensionErrorModal,
  ] = useState<boolean>(false);
  const [isFormInputFilled, setIsFormInputFilled] = useState<boolean>(false);
  const [
    showSelectProviderModalVisible,
    setShowSelectProviderModalVisible,
  ] = useState<boolean>(false);
  const [showProviderLoadingIcon, setShowProviderLoadingIcon] = useState(false);
  const metaMaskProvider = useMetaMaskProvider();
  const connectWallet = useCallback(async () => {
    setShowProviderLoadingIcon(true);

    if (!metaMaskProvider) {
      setShowBrowserExtensionErrorModal(true);
      log.error('!window.ethereum');
      setShowProviderLoadingIcon(false);
      return;
    }

    let web3ProviderInstance = new ethers.providers.Web3Provider(
      metaMaskProvider,
    );

    try {
      if (targetChainId) {
        const currentNetwork = await web3ProviderInstance.getNetwork();
        if (currentNetwork?.chainId !== targetChainId) {
          try {
            await switchEthereumChain({
              provider: metaMaskProvider,
              targetChainId,
              currentChainId: currentNetwork?.chainId,
            });
          } catch (switchError) {
            log.error('wallet_switchEthereumChain error', switchError);
            setConnectionError(switchError as ConnectionErrorType);
            setShowProviderLoadingIcon(false);
            return;
          }
          web3ProviderInstance = new ethers.providers.Web3Provider(
            metaMaskProvider,
          );
        }
      }

      await metaMaskProvider.request({
        method: 'eth_requestAccounts',
      });

      const signer = web3ProviderInstance.getSigner();
      const walletAddress = await signer.getAddress();
      const networkData = await web3ProviderInstance.getNetwork();

      setProvider(metaMaskProvider);
      setWeb3Provider(web3ProviderInstance);
      setAddress(walletAddress);
      setNetwork(networkData);

      closeSelectProviderModal();
      setIsWalletConnected(true);
      setShowProviderLoadingIcon(false);
    } catch (error) {
      setConnectionError(error);
      setShowProviderLoadingIcon(false);
    }
  }, [
    setAddress,
    setConnectionError,
    setIsWalletConnected,
    setNetwork,
    setProvider,
    setWeb3Provider,
    metaMaskProvider,
    targetChainId,
  ]);

  const handleDisconnect = useCallback(
    async (
      setIsWalletConnectedStateInInput: (val?: boolean) => void,
      handleAddressChangeInForm: (address: string) => void,
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
      setIsFormInputFilled(false);
      handleAddressChangeInForm(null);
    },
    [
      setProvider,
      setAddress,
      setNetwork,
      setConnectionError,
      setIsFormInputFilled,
    ],
  );

  const disconnectWallet = useCallback(async () => {
    return handleDisconnect(
      setIsWalletConnected,
      handleAddressChange,
      provider,
    );
  }, [handleDisconnect, setIsWalletConnected, handleAddressChange, provider]);

  const closeSelectProviderModal = () => {
    setShowProviderLoadingIcon(false);
    setShowSelectProviderModalVisible(false);
  };

  // update value in the form state
  useEffect(() => {
    if (address) {
      handleAddressChange(address);
      setIsFormInputFilled(true);
    }

    // todo: research why input.onChange gets new link on every final-form input state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    // disconnect when clear button is pressed
    if (!inputValue && address && isFormInputFilled) {
      disconnectWallet();
    }
  }, [inputValue, address, disconnectWallet, isFormInputFilled]);

  useEffect(() => {
    if (provider?.on) {
      const disconnect = (error?: ConnectionErrorType) => {
        if (error) log.info('disconnect', error);
        handleDisconnect(setIsWalletConnected, handleAddressChange, provider);
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
      const handleChainChanged = async (_hexChainId: string) => {
        try {
          const currentProvider = provider || metaMaskProvider;
          if (!currentProvider) return;
          const updatedWeb3Provider = new ethers.providers.Web3Provider(
            currentProvider,
          );
          const updatedNetwork = await updatedWeb3Provider.getNetwork();
          setWeb3Provider(updatedWeb3Provider);
          setNetwork(updatedNetwork);
        } catch (error) {
          log.error('chainChanged handling error', error);
        }
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
    handleAddressChange,
    provider,
    metaMaskProvider,
    setIsWalletConnected,
    connectionError,
    handleDisconnect,
    setAddress,
    setConnectionError,
    setNetwork,
    setWeb3Provider,
    address,
  ]);

  useEffect(() => {
    connectionError && log.error('wallet connection error: ', connectionError);
    if (
      connectionError?.code === OPENED_METAMASK_WINDOW_ERROR_CODE &&
      isWalletConnected
    )
      setConnectionError(null);
  }, [connectionError, isWalletConnected, setConnectionError]);

  if (!isVisible) return null;

  return (
    <div className={classes.connectWallet}>
      <DangerModal
        show={showBrowserExtensionErrorModal}
        title="Please add MetaMask extension in your browser first. Or refresh the page if it has just been installed."
        onClose={() => setShowBrowserExtensionErrorModal(false)}
        buttonText="Close"
        onActionButtonClick={() => setShowBrowserExtensionErrorModal(false)}
      />
      <DangerModal
        show={connectionError?.code === OPENED_METAMASK_WINDOW_ERROR_CODE}
        title="MetaMask window is already opened for this site. Please check your browser windows first."
        onClose={() => setConnectionError(null)}
        buttonText="Close"
        onActionButtonClick={() => setConnectionError(null)}
      />
      <ModalComponent
        show={showSelectProviderModalVisible}
        onClose={closeSelectProviderModal}
        closeButton={true}
        isSimple={true}
        isWide={true}
      >
        <div className={classes.connectWalletModal}>
          <h2>Please Connect Your Wallet</h2>
          <p className="pt-2">{description}</p>
          <button
            onClick={connectWallet}
            className={classes.connectWalletProviderTypeButton}
          >
            <div>MetaMask</div>
            <div className="d-flex justify-content-center align-items-center">
              <LoadingIcon isVisible={showProviderLoadingIcon} />
              <img
                src={metamaskIcon}
                className={classes.providerIcon}
                alt="metamask"
              />
            </div>
          </button>
        </div>
      </ModalComponent>

      {inputValue === address && web3Provider ? null : (
        <div
          className={classnames(
            classes.maxButtonContainer,
            classes.connectWalletButton,
          )}
        >
          <Button onClick={() => setShowSelectProviderModalVisible(true)}>
            Connect
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
