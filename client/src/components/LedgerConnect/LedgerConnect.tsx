import React, { useEffect, useState, useRef } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Transport from '@ledgerhq/hw-transport';
import { FIO } from 'ledgerjs-hw-app-fio';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/lib/fio';

import ConnectionModal from '../Modal/ConnectionModal';
import { FioWalletDoublet } from '../../types';
import { getPubKeyFromLedger } from '../../util/ledger';

const DISCONNECTED_DEVICE_DURING_OPERATION_ERROR =
  'DisconnectedDeviceDuringOperation';

type Props = {
  isTransaction?: boolean;
  fioWallet?: FioWalletDoublet;

  onConnect: (appFio: LedgerFioApp) => Promise<any>;
  onSuccess: (data: any) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  showGenericErrorModal: (message?: string) => void;
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
  const [fioApp, setFioApp] = useState<LedgerFioApp | null>(null);
  const [isSupported, setIsSupported] = useState(true);
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
      afterConnect(fioApp);
    }
  }, [fioApp]);

  // Handle transport created
  useEffect(() => {
    if (transport != null && connecting) {
      connectFioAppIntervalRef.current = window.setInterval(
        connectFioApp,
        2000,
      );
      return () => {
        clearInterval(connectFioAppIntervalRef.current);
      };
    }
  }, [transport, connecting]);

  const connect = async () => {
    const isTransportSupported = await TransportWebUSB.isSupported();
    setIsSupported(isTransportSupported);
    if (!isTransportSupported) return;

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
      newFioApp = new FIO.Fio(transport);
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
      console.error(e);
      showGenericErrorModal('Try to reconnect your ledger device.');
      onCancel();
    }
  };

  let message = 'Please connect your Ledger device and confirm';
  if (!isSupported) message = 'Your browser does not support usb connections.';

  return (
    <ConnectionModal
      show={connecting}
      onClose={closeConnection}
      message={message}
      isTransaction={isTransaction}
    />
  );
};

export default LedgerConnect;
