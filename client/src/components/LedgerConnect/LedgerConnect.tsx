import React, { useEffect, useState, useRef } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Transport from '@ledgerhq/hw-transport';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { DeviceStatusCodes } from 'ledgerjs-hw-app-fio/dist/errors/deviceStatusError';

import ConnectionModal from '../Modal/ConnectionModal';

import { getPubKeyFromLedger } from '../../util/ledger';
import { log } from '../../util/general';

import { AnyObject, FioWalletDoublet } from '../../types';

const DISCONNECTED_DEVICE_DURING_OPERATION_ERROR =
  'DisconnectedDeviceDuringOperation';

type Props = {
  isTransaction?: boolean;
  fioWallet?: FioWalletDoublet;

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
    isTransaction,
    fioWallet,
    onConnect,
    onSuccess,
    onCancel,
    showGenericErrorModal,
    setProcessing,
  } = props;
  const connectFioAppIntervalRef = useRef<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [awaitingLedger, setAwaitingLedger] = useState(false);
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
    onCancel();
  };

  useEffect(() => {
    connect();
  }, []);

  // Handle fioApp connection set
  useEffect(() => {
    if (fioApp != null) {
      setAwaitingLedger(true);
      afterConnect(fioApp);
    }
  }, [fioApp]);

  // Handle transport created
  useEffect(() => {
    if (transport != null && connecting) {
      connectFioAppIntervalRef.current = window.setInterval(() => {
        connectFioApp();
      }, 2000);
      return () => {
        clearInterval(connectFioAppIntervalRef.current);
      };
    }
  }, [transport, connecting]);

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
      onCancel();
    }
  };

  const connectFioApp = async () => {
    if (!transport || fioApp) return;

    let newFioApp: LedgerFioApp | null = null;
    try {
      newFioApp = new LedgerFioApp(transport);
      await newFioApp.getVersion();
    } catch (e) {
      if (e.name && e.name === DISCONNECTED_DEVICE_DURING_OPERATION_ERROR) {
        clearInterval(connectFioAppIntervalRef.current);
        connectFioAppIntervalRef.current = null;

        setTransport(null);

        connect();
      }
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

    setFioApp(newFioApp);
  };

  const afterConnect = async (appFio: LedgerFioApp) => {
    try {
      setProcessing(true);
      const result = await onConnect(appFio);

      setConnecting(false);

      onSuccess(result);
    } catch (e) {
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

  return (
    <ConnectionModal
      show={connecting}
      onClose={closeConnection}
      awaitingLedger={awaitingLedger}
      message={
        awaitingLedger
          ? 'Please confirm action in your Ledger device'
          : 'Please connect your Ledger device and confirm'
      }
      isTransaction={isTransaction}
    />
  );
};

export default LedgerConnect;
