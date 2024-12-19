import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    minVersion: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
