import { FormValues } from './types';
import { VALIDATION_TITLES } from '../CreateAccountForm/EmailPassword';

const validation = (values: FormValues) => {
  const errors: FormValues = {};

  const {
    recoveryAnswerOne,
    recoveryAnswerTwo,
    password,
    confirmPassword,
  } = values;

  if (!recoveryAnswerOne) errors.recoveryAnswerOne = 'Answer Required';
  if (!recoveryAnswerTwo) errors.recoveryAnswerTwo = 'Answer Required';
  if (!password) errors.password = 'Password Required';
  if (!confirmPassword)
    errors.confirmPassword = 'Confirmation Password Required';

  if (password && confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (password) {
    if (password.length < 10) {
      errors.password = VALIDATION_TITLES.length;
    }

    if (password.search(/^(?=.*[a-z])/) < 0) {
      errors.password = VALIDATION_TITLES.lower;
    }

    if (password.search(/^(?=.*[A-Z])/) < 0) {
      errors.password = VALIDATION_TITLES.upper;
    }

    if (password.search(/^(?=.*\d)/) < 0) {
      errors.password = VALIDATION_TITLES.number;
    }
  }

  return errors;
};

export default validation;
