import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import { WALLET_NAME_REGEX } from '../../../../constants/regExps';

const validationSchema: ValidationSchema = {
  field: {
    privateSeed: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    name: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: Validators.pattern,
        customArgs: { pattern: WALLET_NAME_REGEX },
        message:
          'Name is not valid. Name should contain only letters, digits, spaces, dashes or underscores.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
