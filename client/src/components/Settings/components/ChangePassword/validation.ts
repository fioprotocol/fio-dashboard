import { FormValuesTypes } from './types';
import { VALIDATION_TITLES } from '../../../CreateAccountForm/EmailPassword';

const validation = (values: FormValuesTypes) => {
  const errors: any = {}; // todo: set error types

  const { confirmNewPassword, password, newPassword } = values;

  if (!confirmNewPassword) {
    errors.confirmNewPassword = 'Required';
  }

  if (!password) {
    errors.password = 'Required';
  }

  if (!newPassword) {
    errors.newPassword = 'Required';
  }

  if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
    errors.confirmNewPassword = 'New and Confirm Passwords do not match';
  }

  if (newPassword) {
    if (newPassword.length < 10) {
      errors.newPassword = VALIDATION_TITLES.length;
    }

    if (newPassword.search(/^(?=.*[a-z])/) < 0) {
      errors.newPassword = VALIDATION_TITLES.lower;
    }

    if (newPassword.search(/^(?=.*[A-Z])/) < 0) {
      errors.newPassword = VALIDATION_TITLES.upper;
    }

    if (newPassword.search(/^(?=.*\d)/) < 0) {
      errors.newPassword = VALIDATION_TITLES.number;
    }
  }

  return errors;
};

export default validation;
