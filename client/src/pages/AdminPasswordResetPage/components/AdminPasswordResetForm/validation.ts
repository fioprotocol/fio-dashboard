import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  hasLowercaseLetterValidator,
  hasNumberCharValidator,
  hasUppercaseLetterValidator,
  matchFieldValidator,
} from '../../../../util/validators';
import { VALIDATION_TITLES } from '../../../../components/CreateAccountForm/EmailPassword';

const validationSchema: ValidationSchema = {
  field: {
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
    hash: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
