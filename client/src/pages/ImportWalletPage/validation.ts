import { validateMnemonic } from 'bip39';

import apis from '../../api';

import { log } from '../../util/general';

import { ImportWalletValues } from './types';

export const VALIDATION_ERRORS = {
  seed: {
    message:
      'This seed phrase does not appear to be valid. Please check it and try again.',
    tryAgain: true,
  },
  privKey: {
    message:
      'This private key does not appear to be valid. Please check it and try again.',
  },
  pubKey: {
    message:
      'This is a valid FIO seed phrase or private key, but it is not associated to an active account on the FIO chain',
  },
  uniqueKey: {
    message: 'You already have this wallet in your account',
  },
  general: {
    message: 'Please try again later',
  },
};

export const validate = async (
  values: ImportWalletValues,
): Promise<{
  message: string;
  tryAgain?: boolean;
} | null> => {
  let privateKey = values.privateSeed;
  let publicKey = '';

  if (values.privateSeed.indexOf(' ') > 0) {
    if (!validateMnemonic(values.privateSeed)) return VALIDATION_ERRORS.seed;

    try {
      privateKey = await apis.fio.createPrivateKeyMnemonic(privateKey);
    } catch (e) {
      return VALIDATION_ERRORS.seed;
    }
  } else if (!/[0-9a-zA-Z]{51}$/.test(privateKey)) {
    return VALIDATION_ERRORS.privKey;
  }

  try {
    publicKey = apis.fio.derivedPublicKey(privateKey);
  } catch (e) {
    return VALIDATION_ERRORS.privKey;
  }

  if (!(await apis.fio.validatePublicKey(publicKey))) {
    return VALIDATION_ERRORS.pubKey;
  }

  try {
    await apis.account.validateWalletImport(publicKey);
  } catch (e) {
    if (e.data && e.data.name) {
      const {
        data: { name },
      } = e;
      const uniqueError = { ...VALIDATION_ERRORS.uniqueKey };
      uniqueError.message = `${uniqueError.message} - (${name as string})`;
      return uniqueError;
    }

    log.error(e);
    return VALIDATION_ERRORS.general;
  }

  return null;
};
