import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  isNumberValidator,
  isAmountValidator,
} from '../../../../util/validators';

const validationSchema: ValidationSchema = {
  field: {
    amount: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isNumberValidator,
        message: 'Please enter valid amount.',
      },
      {
        validator: isNumberValidator,
        message: 'Please enter valid amount.',
      },
      {
        validator: isAmountValidator,
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
