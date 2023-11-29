import React, { useEffect, useState, useRef } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Transport from '@ledgerhq/hw-transport';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { DeviceStatusCodes } from 'ledgerjs-hw-app-fio/dist/errors/deviceStatusError';

import ConnectionModal from '../Modal/ConnectionModal';

import useEffectOnce from '../../hooks/general';
import { getPubKeyFromLedger } from '../../util/ledger';
import { log } from '../../util/general';
import {
  fireActionAnalyticsEvent,
  fireActionAnalyticsEventError,
} from '../../util/analytics';

import { AnyObject, AnyType, FioWalletDoublet } from '../../types';

const DISCONNECTED_DEVICE_DURING_OPERATION_ERROR =
  'DisconnectedDeviceDuringOperation';
const FIO_APP_INIT_TIMEOUT = 2000;

type Props = {
  action?: string;
  data: AnyType | null;
  isTransaction?: boolean;
  fioWallet?: FioWalletDoublet;
  hideConnectionModal?: boolean;

  onConnect: (appFio: LedgerFioApp) => Promise<LedgerFioApp>;
  onSuccess: (data: AnyObject) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  showGenericErrorModal: (
    message?: string,
    title?: string,
    buttonText?: string,
  ) => void;
};

const LedgerConnect: React.FC<Props> = props => {
  const {
    action,
    data,
    isTransaction,
    fioWallet,
    hideConnectionModal,
    onConnect,
    onSuccess,
    onCancel,
    showGenericErrorModal,
    setProcessing,
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

    if (fioWallet != null && fioWallet.publicKey) {
      const publicKeyWIF = await getPubKeyFromLedger(
        newFioApp,
        fioWallet.data.derivationIndex,
      );
      if (publicKeyWIF !== fioWallet.publicKey) {
        showGenericErrorModal('Your device does not have selected wallet');
        onCancel();
        return;
      }
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

  useEffect(() => {
    return () => {
      connectFioAppIntervalRef.current &&
        clearInterval(connectFioAppIntervalRef.current);
    };
  }, []);

  useEffectOnce(() => {
    connect();
  }, [connect]);

  // Handle fioApp connection set
  useEffect(() => {
    if (fioApp != null) {
      setAwaitingLedger(true);
      afterConnect(fioApp);
    }
  }, [fioApp]);

  // Handle transport created
  useEffectOnce(
    () => {
      setAwaitingFioApp(true);
      connectFioApp();
    },
    [connectFioApp],
    transport != null && connecting,
  );

  const afterConnect = async (appFio: LedgerFioApp) => {
    try {
      setProcessing(true);
      const result = await onConnect(appFio);
      fireActionAnalyticsEvent(action, data);

      setConnecting(false);

      onSuccess(result);
    } catch (e) {
      fireActionAnalyticsEventError(action);
      log.error(e, e.code);
      let title = 'Something went wrong';
      let msg = 'Try to reconnect your ledger device.';

      if (e.code === DeviceStatusCodes.ERR_REJECTED_BY_USER) {
        title = 'Rejected';
        msg = 'Action rejected by user';
      }

      showGenericErrorModal(msg, title);
      onCancel();
    }
  };

  let message = 'Please connect your Ledger device and confirm';
  if (awaitingLedger) message = 'Please confirm action in your Ledger device';
  if (awaitingFioApp) message = 'Connecting...';
  if (awaitingUnlock)
    message = 'Please unlock your device and then press continue';

  return (
    <ConnectionModal
      show={connecting && !hideConnectionModal}
      onClose={closeConnection}
      onContinue={onContinue}
      awaitingLedger={awaitingLedger || awaitingFioApp}
      message={message}
      isTransaction={isTransaction}
    />
  );
};

export default LedgerConnect;
