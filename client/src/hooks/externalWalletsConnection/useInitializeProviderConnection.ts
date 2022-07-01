import { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers/src.ts/web3-provider';

import { Network } from '@ethersproject/networks/src.ts/types';

import { AnyObject } from '../../types';

// todo: add types from "@metamask/providers" module and check why it breaks "edge-currency-accountbased" types declaration
export type ProviderType = AnyObject | null;
export type Web3ProviderType = Web3Provider;
export type ConnectionErrorType =
  | ({ code: number; message: string } & Error)
  | null;

export type NetworkType = Network | null;

export type ConnectProviderType = {
  provider: ProviderType;
  web3Provider: Web3ProviderType;
  address: string | null;
  network: NetworkType;
  connectionError: ConnectionErrorType;
  setProvider: (val: ProviderType) => void;
  setWeb3Provider: (val: Web3ProviderType) => void;
  setConnectionError: (val: ConnectionErrorType) => void;
  setAddress: (val: string | null) => void;
  setNetwork: (val: NetworkType) => void;
};

export function useInitializeProviderConnection(): ConnectProviderType {
  const [provider, setProvider] = useState<ProviderType>(null);
  const [web3Provider, setWeb3Provider] = useState<Web3ProviderType>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkType>(null);

  const [connectionError, setConnectionError] = useState<ConnectionErrorType>(
    null,
  );

  return {
    provider,
    web3Provider,
    connectionError,
    address,
    network,
    setProvider,
    setWeb3Provider,
    setConnectionError,
    setAddress,
    setNetwork,
  };
}

export default useInitializeProviderConnection;
