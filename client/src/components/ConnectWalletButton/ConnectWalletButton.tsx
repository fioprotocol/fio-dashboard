import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';

import ModalComponent from '../Modal/Modal';
import DangerModal from '../Modal/DangerModal';

import { log } from '../../util/general';
import { AnyObject } from '../../types';

import classes from './../Input/Input.module.scss';

import metamaskIcon from '../../assets/images/metamask.svg';

type Props = {
  isVisible?: boolean;
  handleAddressChange?: (address: string) => void;
  setIsWalletConnected?: (value: boolean) => void;
  inputValue?: string;
  description?: string;
};

const ConnectWalletButton: React.FC<Props> = props => {
  const {
    handleAddressChange,
    inputValue,
    isVisible,
    setIsWalletConnected,
    description = 'Please connect your Polygon wallet with the wFio domain that you would like to unwrap to the FIO network.',
  } = props;

  // todo: add types from "@metamask/providers" module and check why it breaks "edge-currency-accountbased" types declaration
  const [provider, setProvider] = useState<AnyObject>(null);
  const [web3Provider, setWeb3Provider] = useState<Web3Provider>(null);

  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [
    showBrowserExtensionErrorModal,
    setShowBrowserExtensionErrorModal,
  ] = useState<boolean>(false);
  const [isFormInputFilled, setIsFormInputFilled] = useState<boolean>(false);
  const [
    showSelectProviderModalVisible,
    setShowSelectProviderModalVisible,
  ] = useState<boolean>(false);

  useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setShowBrowserExtensionErrorModal(true);
      log.error('!window.ethereum');
      return;
    }

    const provider = window.ethereum;
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      await provider.request({
        method: 'eth_requestAccounts',
      });

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(window.ethereum);
      setWeb3Provider(web3Provider);
      setAddress(address);

      setShowSelectProviderModalVisible(false);
      setIsWalletConnected(true);
    } catch (error) {
      setError(error);
    }
  }, [setIsWalletConnected]);

  const handleDisconnect = async (
    provider: AnyObject,
    setIsWalletConnectedStateInInput: (val?: boolean) => void,
  ) => {
    if (provider?.disconnect && typeof provider.disconnect === 'function') {
      await provider.disconnect();
    }
    setProvider(null);
    setAddress(null);
    setError(null);
    setIsWalletConnectedStateInInput(false);
  };

  const disconnectWallet = useCallback(async () => {
    return handleDisconnect(provider, setIsWalletConnected);
  }, [provider, setIsWalletConnected]);

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
      setIsFormInputFilled(false);
    }
  }, [inputValue, address, disconnectWallet, isFormInputFilled]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        log.info('accountsChanged', accounts);
        setAddress(accounts[0]);
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      const disconnect = (error: { code: number; message: string }) => {
        log.info('disconnect', error);
        handleDisconnect(provider, setIsWalletConnected);
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', disconnect);
        }
      };
    }
  }, [provider, setIsWalletConnected]);

  useEffect(() => {
    error && log.error('wallet connection error: ', error);
  }, [error]);

  if (!isVisible) return null;

  return (
    <div className={classes.connectWallet}>
      <DangerModal
        show={showBrowserExtensionErrorModal}
        title="Please add MetaMask extension in your browser first."
        onClose={() => setShowBrowserExtensionErrorModal(false)}
        buttonText="Close"
        onActionButtonClick={() => setShowBrowserExtensionErrorModal(false)}
      />
      <ModalComponent
        show={showSelectProviderModalVisible}
        onClose={() => setShowSelectProviderModalVisible(false)}
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
            <img
              src={metamaskIcon}
              className={classes.providerIcon}
              alt="metamask"
            />
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
