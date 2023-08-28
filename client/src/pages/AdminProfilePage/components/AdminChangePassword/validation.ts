import { FormValuesProps } from './types';

type validationErrors = {
  confirmNewPassword?: string;
  oldPassword?: string;
  newPassword?: string;
};

const validation = (values: FormValuesProps): validationErrors => {
  const errors: validationErrors = {};

  const { confirmNewPassword, oldPassword, newPassword } = values;

  if (!confirmNewPassword) {
    errors.confirmNewPassword = 'Required';
  }

  if (!oldPassword) {
    errors.oldPassword = 'Required';
  }

  if (!newPassword) {
    errors.newPassword = 'Required';
  }

  if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
    errors.confirmNewPassword = 'New and Confirm Passwords do not match';
  }

  return errors;
};

export default validation;
