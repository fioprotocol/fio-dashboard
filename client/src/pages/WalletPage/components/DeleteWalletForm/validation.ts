import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    password: [
      {
        validator: Validators.required,
        message: 'Password is required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
