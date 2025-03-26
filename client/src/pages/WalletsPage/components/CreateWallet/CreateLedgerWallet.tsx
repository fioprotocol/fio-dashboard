import React, { useState, useCallback } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { EdgeAccount } from 'edge-core-js';

import LedgerConnect from '../../../../components/LedgerConnect';
import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';
import FullScreenLoader from '../../../../components/common/FullScreenLoader/FullScreenLoader';

import { authenticateWallet } from '../../../../services/api/wallet';

import { getPubKeyFromLedger } from '../../../../util/ledger';
import { log } from '../../../../util/general';

import {
  CONFIRM_LEDGER_ACTIONS,
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../../../constants/common';
import { WALLET_API_PROVIDER_ERRORS_CODE } from '../../../../constants/errors';

import {
  FioWalletDoublet,
  NewFioWalletDoublet,
  Nonce,
} from '../../../../types';
import { CreateWalletValues } from '../../types';

type Props = {
  fioWallets: FioWalletDoublet[];
  values: CreateWalletValues;
  metaMaskProvider: MetaMaskInpageProvider | null;
  processing: boolean;
  onWalletDataPrepared: (data: {
    walletData: NewFioWalletDoublet;
    nonce: Nonce;
  }) => void;
  onOptionCancel: (err?: Error | string) => void;
  setProcessing: (processing: boolean) => void;
};

const CreateLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallets,
    values,
    metaMaskProvider,
    onWalletDataPrepared,
    onOptionCancel,
    setProcessing,
  } = props;

  const [edgeConfirm, setEdgeConfirm] = useState(false);
  const [confirmProcessing, setConfirmProcessing] = useState(false);
  const [
    ledgerWalletData,
    setLedgerWalletData,
  ] = useState<NewFioWalletDoublet | null>(null);

  const createLedgerWallet = async (appFio: LedgerFioApp) => {
    let publicKey = '';

    const [device] = await TransportWebUSB.list();

    const ledgerWallets = fioWallets.filter(
      wallet => wallet.from === WALLET_CREATED_FROM.LEDGER,
    );

    let nextDerivationIndex = 0;

    if (ledgerWallets?.length) {
      const findMissingIndex = () => {
        const maxMetamaskWalletIndex = Math.max(
          ...ledgerWallets.map(wallet => +wallet.data.derivationIndex),
        );

        return maxMetamaskWalletIndex + 1;
      };

      nextDerivationIndex = findMissingIndex();
    }

    try {
      publicKey = await getPubKeyFromLedger(appFio, nextDerivationIndex);
    } catch (e) {
      log.error(e);
      throw e;
    }

    if (
      publicKey &&
      !fioWallets.find(
        ({ publicKey: walletPublicKey }) => publicKey === walletPublicKey,
      )
    ) {
      return {
        name: values.name,
        publicKey,
        from: WALLET_CREATED_FROM.LEDGER,
        data: {
          derivationIndex: nextDerivationIndex,
          device: device.productId,
        },
        edgeId: '',
      };
    }

    throw new Error('Try to reconnect your ledger device.');
  };

  const signNonce = useCallback(
    async (
      data: {
        edgeAccount?: EdgeAccount | null;
        metaMaskProvider?: MetaMaskInpageProvider;
        data?: NewFioWalletDoublet;
      } = {},
    ) => {
      const { edgeAccount, metaMaskProvider, data: walletData } = data;
      if (!edgeAccount && !metaMaskProvider) {
        throw new Error('Auth failed');
      }

      const { walletApiProvider, nonce } = await authenticateWallet({
        walletProviderName:
          edgeAccount && !metaMaskProvider
            ? WALLET_CREATED_FROM.EDGE
            : WALLET_CREATED_FROM.METAMASK,
        authParams:
          edgeAccount && !metaMaskProvider
            ? { account: edgeAccount }
            : { provider: metaMaskProvider },
      });

      await walletApiProvider.logout(
        edgeAccount ? { fromEdgeConfirm: true } : {},
      );

      return { walletData, nonce };
    },
    [],
  );

  const onWalletCreated = useCallback(
    async (walletData: NewFioWalletDoublet) => {
      if (metaMaskProvider) {
        try {
          setConfirmProcessing(true);
          const { nonce } = await signNonce({
            metaMaskProvider,
          });
          if (!nonce) {
            throw new Error('Sign nonce failed');
          }
          onWalletDataPrepared({ walletData, nonce });
        } catch (err) {
          setProcessing(false);
          setConfirmProcessing(false);
          return onOptionCancel(
            err?.code === WALLET_API_PROVIDER_ERRORS_CODE.REJECTED ? null : err,
          );
        }
      } else {
        setLedgerWalletData(walletData);
        setEdgeConfirm(true);
      }
    },
    [
      metaMaskProvider,
      signNonce,
      onOptionCancel,
      onWalletDataPrepared,
      setProcessing,
    ],
  );

  const onEdgeConfirmSuccess = useCallback(
    (result: { walletData: NewFioWalletDoublet; nonce: Nonce }) => {
      setLedgerWalletData(null);
      setEdgeConfirm(false);
      onWalletDataPrepared({
        walletData: {
          name: result.walletData.name,
          publicKey: result.walletData.publicKey,
          from: WALLET_CREATED_FROM.LEDGER,
          data: result.walletData.data,
          edgeId: '',
        },
        nonce: result.nonce,
      });
    },
    [onWalletDataPrepared],
  );

  return (
    <>
      {edgeConfirm && ledgerWalletData ? (
        <EdgeConfirmAction
          action={CONFIRM_PIN_ACTIONS.SIGN_NONCE}
          data={ledgerWalletData}
          processing={confirmProcessing}
          submitAction={signNonce}
          onSuccess={onEdgeConfirmSuccess}
          onCancel={onOptionCancel}
          setProcessing={setConfirmProcessing}
          edgeAccountLogoutBefore={false}
        />
      ) : null}
      {!edgeConfirm && confirmProcessing ? <FullScreenLoader /> : null}
      <LedgerConnect
        action={CONFIRM_LEDGER_ACTIONS.CREATE_WALLET}
        data={values}
        onConnect={createLedgerWallet}
        onSuccess={onWalletCreated}
        onCancel={onOptionCancel}
        setProcessing={setProcessing}
      />
    </>
  );
};

export default CreateLedgerWallet;
