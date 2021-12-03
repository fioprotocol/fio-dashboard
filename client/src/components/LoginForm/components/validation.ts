import { BackupFormValues } from './TwoFactorCodeModal';

export const validate = async (values: BackupFormValues) => {
  const { backupCode } = values;
  const error: { backupCode?: string } = {};

  if (!backupCode) {
    error.backupCode = 'Required';
  }

  return error;
};
