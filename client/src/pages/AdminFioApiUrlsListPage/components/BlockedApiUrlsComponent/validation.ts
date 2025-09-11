import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { isUrl } from '@lemoncode/fonk-is-url-validator';

const validationSchema: ValidationSchema = {
  field: {
    url: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      isUrl.validator,
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
