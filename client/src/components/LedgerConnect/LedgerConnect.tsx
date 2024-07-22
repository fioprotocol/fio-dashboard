import React, { useEffect, useState, useRef } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Transport from '@ledgerhq/hw-transport';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { DeviceStatusCodes } from 'ledgerjs-hw-app-fio/dist/errors/deviceStatusError';

import ConnectionModal from '../Modal/ConnectionModal';

import useEffectOnce from '../../hooks/general';
import { getPubKeyFromLedger, handleLedgerError } from '../../util/ledger';
import { fireActionAnalyticsEvent } from '../../util/analytics';
import { log } from '../../util/general';

import { DISCONNECTED_DEVICE_DURING_OPERATION_ERROR } from '../../constants/errors';

import { AnyObject, AnyType, FioWalletDoublet } from '../../types';

const FIO_APP_INIT_TIMEOUT = 2000;

export type Props = {
  action?: string;
  result?: AnyType;
  data?: AnyType;
  isTransaction?: boolean;
  fee?: number;
  oracleFee?: number;
  fioWallet?: FioWalletDoublet;
  fioWalletsForCheck?: FioWalletDoublet[];
  ownerFioPublicKey?: string;
  hideConnectionModal?: boolean;

  onConnect?: (appFio: LedgerFioApp) => Promise<AnyObject>;
  onSuccess?: (data: AnyObject) => void;
  onCancel?: () => void;
  setProcessing?: (processing: boolean) => void;
  showGenericErrorModal: (
    message?: string,
    title?: string,
    buttonText?: string,
  ) => void;
};

const LedgerConnect: React.FC<Props> = props => {
  const {
    action,
    result,
    data,
    fee,
    oracleFee,
    isTransaction,
    fioWallet,
    fioWalletsForCheck = [],
    ownerFioPublicKey,
    hideConnectionModal,
    onConnect = () => null,
    onSuccess = () => null,
    onCancel = () => null,
    showGenericErrorModal = () => null,
    setProcessing = () => null,
  } = props;

  const connectFioAppIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [connecting, setConnecting] = useState(false);
  const [awaitingLedger, setAwaitingLedger] = useState(false);
  const [awaitingUnlock, setAwaitingUnlock] = useState(false);
  const [awaitingFioApp, setAwaitingFioApp] = useState(false);
  const [fioApp, setFioApp] = useState<LedgerFioApp | null>(null);
  const [transport, setTransport] = useState<Transport | null>(null);

  const closeConnection = async () => {
    try {
      if (transport != null) {
        await transport.close();
      }
    } catch (e) {
      //
    }
    setTransport(null);
    setConnecting(false);
    setAwaitingUnlock(false);
    setAwaitingFioApp(false);
    onCancel();
  };

  const connect = async () => {
    const isTransportSupported = await TransportWebUSB.isSupported();

    if (!isTransportSupported) {
      showGenericErrorModal(
        'Your browser does not support usb connections',
        'Not supported',
        'Close',
      );
      return closeConnection();
    }

    setConnecting(true);

    try {
      const newTransport = await TransportWebUSB.create();
      setTransport(newTransport);
    } catch (e) {
      log.error(e);
      showGenericErrorModal(
        'Try to reconnect your ledger device or update FIO application on your device.',
        'Connection Error',
      );
      onCancel();
    }
  };

  const connectFioApp = async () => {
    if (!transport || fioApp) {
      connectFioAppIntervalRef.current = setTimeout(() => {
        connectFioApp();
      }, FIO_APP_INIT_TIMEOUT);
      return setAwaitingFioApp(false);
    }

    let newFioApp: LedgerFioApp | null = null;
    try {
      newFioApp = new LedgerFioApp(transport);
      await newFioApp.getVersion();
    } catch (e) {
      connectFioAppIntervalRef.current = setTimeout(() => {
        connectFioApp();
      }, FIO_APP_INIT_TIMEOUT);

      if (e.name && e.name === DISCONNECTED_DEVICE_DURING_OPERATION_ERROR) {
        clearInterval(connectFioAppIntervalRef.current);
        connectFioAppIntervalRef.current = null;

        setTransport(null);

        connect();
      }

      if (e.code === DeviceStatusCodes.ERR_DEVICE_LOCKED) {
        clearInterval(connectFioAppIntervalRef.current);
        setAwaitingUnlock(true);
      }

      setAwaitingFioApp(false);
      return;
    }

    clearInterval(connectFioAppIntervalRef.current);
    connectFioAppIntervalRef.current = null;

    const checkingWallets: FioWalletDoublet[] = [...fioWalletsForCheck];

    if (
      fioWallet &&
      !checkingWallets.find(it => it.publicKey !== fioWallet.publicKey)
    ) {
      checkingWallets.push(fioWallet);
    }

    try {
      for (const wallet of checkingWallets) {
        const publicKeyWIF = await getPubKeyFromLedger(
          newFioApp,
          wallet.data.derivationIndex,
        );
        if (publicKeyWIF !== wallet.publicKey) {
          showGenericErrorModal('Your device does not have selected wallet');
          onCancel();
          return;
        }
      }
    } catch (err) {
      handleLedgerError({
        error: err,
        action,
        onCancel,
        showGenericErrorModal,
      });
    }

    setAwaitingFioApp(false);
    setFioApp(newFioApp);
  };

  const onContinue = awaitingUnlock
    ? () => {
        setAwaitingUnlock(false);
        setAwaitingFioApp(true);
        connectFioApp();
      }
    : null;

  const afterConnect = async (appFio: LedgerFioApp) => {
    try {
      setProcessing(true);
      const result = await onConnect(appFio);
      fireActionAnalyticsEvent(action, data);

      setConnecting(false);

      onSuccess(result);
    } catch (e) {
      handleLedgerError({
        error: e,
        action,
        onCancel,
        showGenericErrorModal,
      });
    }
  };

  // Handle fioApp connection set
  useEffect(() => {
    if (fioApp != null) {
      setAwaitingLedger(true);
      setConnecting(true);
      afterConnect(fioApp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fioApp, fioWallet?.publicKey]);

  // Handle transport created
  useEffect(() => {
    if (transport != null && connecting) {
      setAwaitingFioApp(true);
      connectFioApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connecting, transport]);

  useEffect(() => {
    return () => {
      connectFioAppIntervalRef.current &&
        clearInterval(connectFioAppIntervalRef.current);
    };
  }, []);

  useEffectOnce(() => {
    connect();
  }, [connect]);

  let message = 'Please connect your Ledger device and confirm';
  if (awaitingLedger)
    message =
      'Please connect your Ledger device, confirm these transaction details, and complete your transaction from your ledger device';
  if (awaitingFioApp) message = 'Connecting...';
  if (awaitingUnlock)
    message = 'Please unlock your device and then press continue';

  return (
    <ConnectionModal
      action={action}
      data={data}
      result={result}
      fioWalletPublicKey={fioWallet?.publicKey}
      ownerFioPublicKey={ownerFioPublicKey}
      fee={fee}
      oracleFee={oracleFee}
      show={connecting && !hideConnectionModal}
      onClose={closeConnection}
      onContinue={onContinue}
      message={message}
      isTransaction={isTransaction}
      isAwaiting={awaitingLedger || awaitingFioApp}
    />
  );
};

export default LedgerConnect;
