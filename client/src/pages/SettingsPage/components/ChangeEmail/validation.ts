import validator from 'email-validator';

import { FormValuesProps } from './types';

const validation = async (values: FormValuesProps) => {
  const errors: { newEmail?: string } = {};

  const { newEmail } = values;

  if (!newEmail) {
    errors.newEmail = 'Required';
  }

  if (newEmail && !validator.validate(newEmail)) {
    errors.newEmail = 'Invalid Email Address';
  }

  return errors;
};

export default validation;
