import React, { useCallback, useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { providers } from 'ethers';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';

import { log } from '../../util/general';

import { AnyObject } from '../../types';

import classes from './../Input/Input.module.scss';

type Props = {
  isVisible?: boolean;
  handleAddressChange?: (address: string) => void;
  inputValue?: string;
};

const providerOptions = {
  // other providers could be added here
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: false,
  disableInjectedProvider: false,
  theme: 'dark',
  providerOptions,
});

const ConnectWalletButton: React.FC<Props> = props => {
  const { handleAddressChange, inputValue, isVisible } = props;

  const [provider, setProvider] = useState<AnyObject>(null);
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  // will be useful for future more than one token chain case
  // const [chainId, setChainId] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [isFormInputFilled, setIsFormInputFilled] = useState<boolean>(false);

  const connectWallet = useCallback(async () => {
    try {
      // This is the initial `provider` that is returned when
      // using web3Modal to connect. Can be MetaMask or WalletConnect.
      const provider = await web3Modal.connect();

      // We plug the initial `provider` into ethers.js and get back
      // a Web3Provider. This will add on methods from ethers.js and
      // event listeners such as `.on()` will be different.
      const web3Provider = new providers.Web3Provider(provider);

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      // will be useful for future more than one token chain case
      // const network = await web3Provider.getNetwork();
      // setChainId(network.chainId);

      setProvider(provider);
      setWeb3Provider(web3Provider);
      setAddress(address);
    } catch (error) {
      setError(error);
    }
  }, []);

  const handleDisconnect = async (provider: AnyObject) => {
    await web3Modal.clearCachedProvider();
    if (provider?.disconnect && typeof provider.disconnect === 'function') {
      await provider.disconnect();
    }
    setProvider(null);
    setWeb3Provider(null);
    setAddress(null);
    // will be useful for future more than one token chain case
    // setChainId(null);
    setError(null);
  };
  const disconnectWallet = useCallback(async () => {
    return handleDisconnect(provider);
  }, [provider]);

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [connectWallet]);

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

      const handleDisconnect = (error: { code: number; message: string }) => {
        log.info('disconnect', error);
        handleDisconnect(provider);
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [provider]);

  useEffect(() => {
    error && log.error('wallet connection error: ', error);
  }, [error]);

  if (!isVisible) return null;

  return (
    <>
      {web3Provider || inputValue ? null : (
        <div
          className={classnames(
            classes.maxButtonContainer,
            classes.connectWalletButton,
          )}
        >
          <Button onClick={connectWallet}>Connect</Button>
        </div>
      )}
    </>
  );
};

export default ConnectWalletButton;
