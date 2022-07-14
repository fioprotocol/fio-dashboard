import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

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
    ],
    tfaToken: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
