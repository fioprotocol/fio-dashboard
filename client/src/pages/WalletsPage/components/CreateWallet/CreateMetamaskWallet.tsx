import React from 'react';

import {
  CONFIRM_METAMASK_ACTION,
  WALLET_CREATED_FROM,
} from '../../../../constants/common';

import { getPublicKey } from '../../../../util/snap';

import { FioWalletDoublet, NewFioWalletDoublet } from '../../../../types';
import { CreateWalletValues } from '../../types';
import useEffectOnce from '../../../../hooks/general';
import { fireActionAnalyticsEvent } from '../../../../util/analytics';

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
      const maxMetamaskWalletIndex = Math.max(
        ...metamaskWallets.map(wallet => +wallet.data.derivationIndex),
      );

      return maxMetamaskWalletIndex + 1;
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

    fireActionAnalyticsEvent(CONFIRM_METAMASK_ACTION.CREATE_WALLET, values);

    setProcessing(false);
  };

  useEffectOnce(() => {
    createMetamaskWallet();
  }, []);

  return <></>;
};
