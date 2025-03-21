import React from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';

import {
  CONFIRM_METAMASK_ACTION,
  WALLET_CREATED_FROM,
} from '../../../../constants/common';

import { getPublicKey } from '../../../../util/snap';

import useEffectOnce from '../../../../hooks/general';
import { useMetaMaskProvider } from '../../../../hooks/useMetaMaskProvider';

import { fireActionAnalyticsEvent } from '../../../../util/analytics';

import {
  FioWalletDoublet,
  NewFioWalletDoublet,
  Nonce,
} from '../../../../types';
import { CreateWalletValues } from '../../types';
import { authenticateWallet } from '../../../../services/api/wallet';

type Props = {
  fioWallets: FioWalletDoublet[];
  onWalletDataPrepared: (data: {
    walletData: NewFioWalletDoublet;
    nonce: Nonce;
  }) => void;
  setProcessing: (processing: boolean) => void;
  values: CreateWalletValues;
};

export const CreateMetamaskWallet: React.FC<Props> = props => {
  const { onWalletDataPrepared, fioWallets, values, setProcessing } = props;

  const metaMaskProvider = useMetaMaskProvider();

  const createMetamaskWallet = async () => {
    setProcessing(true);

    const metamaskWallets = fioWallets.filter(
      wallet => wallet.from === WALLET_CREATED_FROM.METAMASK,
    );

    const findMissingIndex = () => {
      const maxMetamaskWalletIndex = Math.max(
        ...metamaskWallets.map(wallet => +wallet.data.derivationIndex),
      );

      return maxMetamaskWalletIndex + 1;
    };

    const nextDerivationIndex = findMissingIndex();

    const publicKey = await getPublicKey(
      metaMaskProvider as MetaMaskInpageProvider,
      {
        derivationIndex: nextDerivationIndex,
      },
    );

    const { walletApiProvider, nonce } = await authenticateWallet({
      walletProviderName: 'metamask',
      authParams: { provider: metaMaskProvider },
    });

    await walletApiProvider.logout();
    // todo: handle reject

    onWalletDataPrepared({
      walletData: {
        name: values.name,
        publicKey,
        from: WALLET_CREATED_FROM.METAMASK,
        data: {
          derivationIndex: nextDerivationIndex,
        },
      },
      nonce,
    });

    fireActionAnalyticsEvent(CONFIRM_METAMASK_ACTION.CREATE_WALLET, values);

    setProcessing(false);
  };

  useEffectOnce(() => {
    createMetamaskWallet();
  }, []);

  return <></>;
};
