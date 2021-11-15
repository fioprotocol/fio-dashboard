import isEmpty from 'lodash/isEmpty';
import validator from 'email-validator';

import { emailAvailable } from '../../../../api/middleware/auth';
import { minWaitTimeFunction } from '../../../../utils';

import { FormValuesProps } from './types';

const isEmailExists = async (email: string) => {
  const result = await minWaitTimeFunction(() => emailAvailable(email), 1000);
  if (!result.error) return {};

  return { email: 'This Email Address is already registered' };
};

const validation = async (values: FormValuesProps) => {
  const errors: { email?: string } = {};

  const { email } = values;

  if (!email) {
    errors.email = 'Required';
  }

  if (email && !validator.validate(email)) {
    errors.email = 'Invalid Email Address';
  }

  return !isEmpty(errors) ? errors : isEmailExists(email);
};

export default validation;
