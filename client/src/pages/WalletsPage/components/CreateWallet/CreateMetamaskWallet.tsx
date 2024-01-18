import React from 'react';

import { WALLET_CREATED_FROM } from '../../../../constants/common';

import { getPublicKey } from '../../../../util/snap';

import { FioWalletDoublet, NewFioWalletDoublet } from '../../../../types';
import { CreateWalletValues } from '../../types';
import useEffectOnce from '../../../../hooks/general';

type Props = {
  fioWallets: FioWalletDoublet[];
  onWalletDataPrepared: (data: NewFioWalletDoublet) => void;
  setProcessing: (processing: boolean) => void;
  values: CreateWalletValues;
};

export const CreateMetamaskWallet: React.FC<Props> = props => {
  const { onWalletDataPrepared, fioWallets, values, setProcessing } = props;

  const createMetamaskWallet = async () => {
    setProcessing(true);

    const metamaskWallets = fioWallets.filter(
      wallet => wallet.from === WALLET_CREATED_FROM.METAMASK,
    );

    const findMissingIndex = () => {
      const sortedIndexes = metamaskWallets
        .map(wallet => +wallet.data.derivationIndex)
        .sort((a, b) => a - b);

      for (let i = 0; i < sortedIndexes.length; i++) {
        if (sortedIndexes[i] !== i) {
          return i;
        }
      }

      return sortedIndexes.length;
    };

    const nextDerivationIndex = findMissingIndex();

    const publicKey = await getPublicKey({
      derivationIndex: nextDerivationIndex,
    });

    onWalletDataPrepared({
      name: values.name,
      publicKey,
      from: WALLET_CREATED_FROM.METAMASK,
      data: {
        derivationIndex: nextDerivationIndex,
      },
    });

    setProcessing(false);
  };

  useEffectOnce(() => {
    createMetamaskWallet();
  }, []);

  return <></>;
};
