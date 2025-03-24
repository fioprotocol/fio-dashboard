import React from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';

import { authenticateWallet } from '../../../../services/api/wallet';

import {
  CONFIRM_METAMASK_ACTION,
  WALLET_CREATED_FROM,
} from '../../../../constants/common';

import { getPublicKey } from '../../../../util/snap';
import { fireActionAnalyticsEvent } from '../../../../util/analytics';

import useEffectOnce from '../../../../hooks/general';
import { useMetaMaskProvider } from '../../../../hooks/useMetaMaskProvider';

import {
  FioWalletDoublet,
  NewFioWalletDoublet,
  Nonce,
} from '../../../../types';
import { CreateWalletValues } from '../../types';

type Props = {
  fioWallets: FioWalletDoublet[];
  onWalletDataPrepared: (data: {
    walletData: NewFioWalletDoublet;
    nonce: Nonce;
  }) => void;
  onOptionCancel: () => void;
  setProcessing: (processing: boolean) => void;
  values: CreateWalletValues;
};

export const CreateMetamaskWallet: React.FC<Props> = props => {
  const {
    onWalletDataPrepared,
    fioWallets,
    values,
    setProcessing,
    onOptionCancel,
  } = props;

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

    try {
      const { walletApiProvider, nonce } = await authenticateWallet({
        walletProviderName: 'metamask',
        authParams: { provider: metaMaskProvider },
      });

      await walletApiProvider.logout();

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
    } catch (err) {
      setProcessing(false);
      return onOptionCancel();
    }

    fireActionAnalyticsEvent(CONFIRM_METAMASK_ACTION.CREATE_WALLET, values);

    setProcessing(false);
  };

  useEffectOnce(() => {
    createMetamaskWallet();
  }, []);

  return <></>;
};
