import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const twoFactorCodeModalValidationSchema: ValidationSchema = {
  field: {
    backupCode: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
  },
};

const usernamePasswordValidationSchema: ValidationSchema = {
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
        message: 'Password Field Should Be Filled',
      },
    ],
  },
};

export const twoFactorCodeModalValidation = createFinalFormValidation(
  twoFactorCodeModalValidationSchema,
);

export const usernamePasswordValidation = createFinalFormValidation(
  usernamePasswordValidationSchema,
);
