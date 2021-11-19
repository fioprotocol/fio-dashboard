import isEmpty from 'lodash/isEmpty';
import validator from 'email-validator';

import { emailAvailable } from '../../../../api/middleware/auth';
import { minWaitTimeFunction } from '../../../../utils';

import { FormValuesProps } from './types';

const isEmailExists = async (newEmail: string) => {
  const result = await minWaitTimeFunction(
    () => emailAvailable(newEmail),
    1000,
  );
  if (!result.error) return {};

  return { newEmail: 'This Email Address is already registered' };
};

const validation = async (values: FormValuesProps) => {
  const errors: { newEmail?: string } = {};

  const { newEmail } = values;

  if (!newEmail) {
    errors.newEmail = 'Required';
  }

  if (newEmail && !validator.validate(newEmail)) {
    errors.newEmail = 'Invalid Email Address';
  }

  return !isEmpty(errors) ? errors : isEmailExists(newEmail);
};

export default validation;
