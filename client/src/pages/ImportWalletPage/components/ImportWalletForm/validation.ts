import { validateMnemonic } from 'bip39';

import { testWalletName } from '../../../../constants/regExps';
import { ImportWalletValues } from '../../types';

export const validate = (values: ImportWalletValues) => {
  if (!values.privateSeed) {
    return { privateSeed: 'Required' };
  }

  // real flame win provide layer trigger soda erode upset rate beef wrist fame design merit
  if (values.privateSeed.indexOf(' ') > 0) {
    if (!validateMnemonic(values.privateSeed))
      return {
        privateSeed: 'Invalid mnemonic phrase',
      };
  } else if (!/[0-9a-zA-Z]{51}$/.test(values.privateSeed)) {
    return { privateSeed: 'Invalid private key' };
  }

  if (!values.name) {
    return { name: 'Name is required' };
  }

  try {
    testWalletName(values.name);
  } catch (e) {
    return {
      name: e.message,
    };
  }

  return {};
};
