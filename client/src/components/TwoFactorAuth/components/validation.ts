import { FormValues } from './TwoFactorCodeModal';

export const validate = async (values: FormValues) => {
  const { backupCode } = values;
  const error: { backupCode?: string } = {};

  if (!backupCode) {
    error.backupCode = 'Required';
  }

  return error;
};
