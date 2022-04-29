import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  isAmountValidator,
  isNumberValidator,
  isValidPubAddressValidator,
} from '../../../../util/validators';

const validationSchema: ValidationSchema = {
  field: {
    publicAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isValidPubAddressValidator,
        customArgs: { chainCodeFieldId: 'chainCode' },
        message: 'Please enter valid Public Address.',
      },
    ],
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
        validator: isAmountValidator,
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
