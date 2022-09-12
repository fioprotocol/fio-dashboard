import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    name: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    actor: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    permission: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
