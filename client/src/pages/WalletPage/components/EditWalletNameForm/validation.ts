import { testWalletName } from '../../../../util/general';

import { EditWalletNameValues } from '../../types';

export const validate = (values: EditWalletNameValues) => {
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
