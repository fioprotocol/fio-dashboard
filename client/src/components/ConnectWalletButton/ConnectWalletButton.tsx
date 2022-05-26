import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';

import ModalComponent from '../Modal/Modal';
import DangerModal from '../Modal/DangerModal';
import { LoadingIcon } from '../Input/StaticInputParts';

import { log } from '../../util/general';
import { AnyObject } from '../../types';

import classes from './../Input/Input.module.scss';

import metamaskIcon from '../../assets/images/metamask.svg';

type Props = {
  isVisible?: boolean;
  handleAddressChange?: (address: string) => void;
  setIsWalletConnected?: (value: boolean) => void;
  isWalletConnected?: boolean;
  inputValue?: string;
  description?: string;
};

type ConnectionError = ({ code: number; message: string } & Error) | null;

const OPENED_METAMASK_WINDOW_ERROR_CODE = -32002;

const ConnectWalletButton: React.FC<Props> = props => {
  const {
    handleAddressChange,
    inputValue,
    isVisible,
    setIsWalletConnected,
    isWalletConnected,
    description = 'Please connect your Polygon wallet with the wFio domain that you would like to unwrap to the FIO network.',
  } = props;

  // todo: add types from "@metamask/providers" module and check why it breaks "edge-currency-accountbased" types declaration
  const [provider, setProvider] = useState<AnyObject>(null);
  const [web3Provider, setWeb3Provider] = useState<Web3Provider>(null);

  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<ConnectionError>(null);
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

    try {
      await provider.request({
        method: 'eth_requestAccounts',
      });

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setWeb3Provider(web3Provider);
      setAddress(address);

      closeSelectProviderModal();
      setIsWalletConnected(true);
    } catch (error) {
      setError(error);
    }
  }, [setIsWalletConnected]);

  const handleDisconnect = async (
    setIsWalletConnectedStateInInput: (val?: boolean) => void,
    handleAddressChangeInForm: (address: string) => void,
    provider?: AnyObject,
  ) => {
    if (provider?.disconnect && typeof provider.disconnect === 'function') {
      await provider.disconnect();
    }
    setProvider(null);
    setAddress(null);
    setError(null);
    setIsWalletConnectedStateInInput(false);
    setIsFormInputFilled(false);
    handleAddressChangeInForm(null);
  };

  const disconnectWallet = useCallback(async () => {
    return handleDisconnect(
      setIsWalletConnected,
      handleAddressChange,
      provider,
    );
  }, [provider, setIsWalletConnected, handleAddressChange]);

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
      const disconnect = (error?: ConnectionError) => {
        if (error) log.info('disconnect', error);
        handleDisconnect(setIsWalletConnected, handleAddressChange, provider);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        log.info('accountsChanged', accounts);
        if (accounts.length) {
          setAddress(accounts[0]);
          if (error?.code === OPENED_METAMASK_WINDOW_ERROR_CODE) setError(null);
        } else {
          // clear form value when user manually disconnects all addresses by metamask interface
          // (not the same as 'disconnect' event)
          // todo: check why this event dont works after MetaMask password entered case (long inactivity)
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
  }, [handleAddressChange, provider, setIsWalletConnected, error]);

  useEffect(() => {
    error && log.error('wallet connection error: ', error);
    if (error?.code === OPENED_METAMASK_WINDOW_ERROR_CODE && isWalletConnected)
      setError(null);
  }, [error, isWalletConnected]);

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
        show={error?.code === OPENED_METAMASK_WINDOW_ERROR_CODE}
        title="MetaMask window is already opened for this site. Please check your browser windows first."
        onClose={() => setError(null)}
        buttonText="Close"
        onActionButtonClick={() => setError(null)}
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
