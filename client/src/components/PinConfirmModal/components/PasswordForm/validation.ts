import { ValidationSchema, Validators } from '@lemoncode/fonk';

import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

const validationSchema: ValidationSchema = {
  field: {
    password: [
      {
        validator: Validators.required,
        message: 'Password required',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
