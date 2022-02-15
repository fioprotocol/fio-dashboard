import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    newEmail: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: Validators.email,
        message: 'Invalid Email Address',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
