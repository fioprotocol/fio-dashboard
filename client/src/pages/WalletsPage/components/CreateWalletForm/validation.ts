import { testWalletName } from '../../../../util/general';
import { CreateWalletValues } from '../../types';

export const validate = (values: CreateWalletValues) => {
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
