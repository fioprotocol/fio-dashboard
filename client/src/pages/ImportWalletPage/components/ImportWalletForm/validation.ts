import { testWalletName } from '../../../../util/general';

import { ImportWalletValues } from '../../types';

export const validate = (values: ImportWalletValues) => {
  if (!values.privateSeed) {
    return { privateSeed: 'Required' };
  }

  if (!values.name) {
    return { name: 'Required' };
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
