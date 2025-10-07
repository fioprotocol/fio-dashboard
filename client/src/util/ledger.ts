import {
  DeviceStatusCodes,
  Fio as LedgerFioApp,
} from 'ledgerjs-hw-app-fio/dist/fio';
import { Ecc } from '@fioprotocol/fiojs';

import { fireActionAnalyticsEventError } from './analytics';
import { log } from './general';

import {
  CANNOT_TRANSFER_ERROR,
  CANNOT_TRANSFER_ERROR_TITLE,
  CANNOT_UPDATE_FIO_HANDLE,
  CANNOT_UPDATE_FIO_HANDLE_TITLE,
  ERROR_MESSAGE_FOR_DECRYPT_CONTENT,
  FIO_ADDRESS_NOT_REGISTERED,
  TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS,
  UNSUPPORTED_LEDGER_APP_VERSION_MESSAGE,
  UNSUPPORTED_LEDGER_APP_VERSION_NAME,
} from '../constants/errors';
import { ROUTES } from '../constants/routes';
import { CONFIRM_LEDGER_ACTIONS } from '../constants/common';
import { AnyType } from '../types';

const HARDENED = 0x80000000;

export const getPath = (derivationIndex?: number): number[] => {
  return [
    44 + HARDENED,
    235 + HARDENED,
    0 + HARDENED,
    0,
    derivationIndex != null ? derivationIndex : 0,
  ];
};

export const getPubKeyFromLedger = async (
  appFio: LedgerFioApp,
  derivationIndex?: number,
  showOnLedger = false,
): Promise<string> => {
  const { publicKeyWIF } = await appFio.getPublicKey({
    path: getPath(derivationIndex),
    show_or_not: showOnLedger,
  });

  return publicKeyWIF;
};

export const formatLedgerSignature = (witnessSignatureHex: string): string => {
  return Ecc.Signature.fromHex(witnessSignatureHex).toString();
};

export const handleLedgerError = ({
  error,
  action,
  data,
  onCancel,
  showGenericErrorModal,
}: {
  error: Error & {
    code: number;
    json?: { fields: { [fieldName: string]: AnyType } };
  };
  action: string;
  data?: AnyType;
  onCancel: () => void;
  showGenericErrorModal: (
    msg: string,
    title: string,
    buttonText?: string | null,
  ) => void;
}): void => {
  fireActionAnalyticsEventError(action);
  log.error(error, error.code ? error.code.toString() : null);
  let title = 'Something went wrong';
  let msg = 'Try to reconnect your ledger device.';
  let buttonText = '';

  const deviceVersionUnsupportedRegexp = new RegExp(
    UNSUPPORTED_LEDGER_APP_VERSION_MESSAGE,
    'i',
  );

  if (error.code === DeviceStatusCodes.ERR_REJECTED_BY_USER) {
    title = 'Rejected';
    msg = 'Action rejected by user';
  }

  if (
    error.name === UNSUPPORTED_LEDGER_APP_VERSION_NAME ||
    deviceVersionUnsupportedRegexp.test(error.message)
  ) {
    title = 'FIO Ledger App version not supported';
    msg =
      'Please go to Ledger Live and install the latest version of the FIO Ledger App on your device.';
    buttonText = 'OK';
  }

  if (
    error.message &&
    typeof error.message === 'string' &&
    error.message === TRANSFER_ERROR_BECAUSE_OF_NOT_BURNED_NFTS
  ) {
    buttonText = 'Close';

    if (window?.location?.pathname === ROUTES.FIO_ADDRESS_OWNERSHIP) {
      msg = CANNOT_TRANSFER_ERROR;
      title = CANNOT_TRANSFER_ERROR_TITLE;
    } else {
      msg = CANNOT_UPDATE_FIO_HANDLE;
      title = CANNOT_UPDATE_FIO_HANDLE_TITLE;
    }
  }

  if (
    error &&
    error.message &&
    typeof error.message === 'string' &&
    error.message.includes(FIO_ADDRESS_NOT_REGISTERED) &&
    action === CONFIRM_LEDGER_ACTIONS.STAKE &&
    error.json?.fields[0]?.value === data?.proxy
  ) {
    msg = `Proxy ${data?.proxy as string} is not registered. Please select another proxy and try again.`;
    title = 'Stake failed';
    buttonText = 'Close';
  }

  if (action === CONFIRM_LEDGER_ACTIONS.DETAILED_FIO_REQUEST) {
    msg = ERROR_MESSAGE_FOR_DECRYPT_CONTENT.message;
    title = ERROR_MESSAGE_FOR_DECRYPT_CONTENT.title;
    buttonText = 'Close';
  }

  showGenericErrorModal(msg, title, buttonText);
  onCancel();
};
