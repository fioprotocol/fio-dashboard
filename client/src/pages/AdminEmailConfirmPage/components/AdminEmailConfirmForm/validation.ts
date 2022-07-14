import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  hasLowercaseLetterValidator,
  hasNumberCharValidator,
  hasUppercaseLetterValidator,
  isNumberValidator,
  matchFieldValidator,
} from '../../../../util/validators';
import { VALIDATION_TITLES } from '../../../../components/CreateAccountForm/EmailPassword';

const validationSchema: ValidationSchema = {
  field: {
    email: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: Validators.email,
        message: 'Invalid Email Address',
      },
    ],
    password: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: Validators.minLength,
        customArgs: { length: 10 },
        message: VALIDATION_TITLES.length,
      },
      {
        validator: hasLowercaseLetterValidator,
        message: VALIDATION_TITLES.lower,
      },
      {
        validator: hasUppercaseLetterValidator,
        message: VALIDATION_TITLES.upper,
      },
      {
        validator: hasNumberCharValidator,
        message: VALIDATION_TITLES.number,
      },
    ],
    confirmPassword: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: matchFieldValidator,
        customArgs: { fieldId: 'password' },
        message: 'Passwords do not match.',
      },
    ],
    tfaToken: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: Validators.maxLength,
        customArgs: { length: 6 },
        message: 'Must be 6-digit.',
      },
      {
        validator: Validators.minLength,
        customArgs: { length: 6 },
        message: 'Must be 6-digit.',
      },
      {
        validator: isNumberValidator,
        message: 'Invalid.',
      },
    ],
    hash: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
