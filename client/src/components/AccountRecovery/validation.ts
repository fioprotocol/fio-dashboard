import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  matchFieldValidator,
  hasLowercaseLetterValidator,
  hasUppercaseLetterValidator,
  hasNumberCharValidator,
} from '../../util/validators';

import { VALIDATION_TITLES } from '../CreateAccountForm/EmailPassword';

const validationSchema: ValidationSchema = {
  field: {
    password: [
      {
        validator: Validators.required,
        message: 'Password is required.',
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
        message: 'Confirmation password is required.',
      },
      {
        validator: matchFieldValidator,
        customArgs: { fieldId: 'password' },
        message: 'Passwords do not match.',
      },
    ],
    recoveryAnswerOne: [
      {
        validator: Validators.required,
        message: 'Answer Required.',
      },
    ],
    recoveryAnswerTwo: [
      {
        validator: Validators.required,
        message: 'Answer Required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
