import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    fch: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
