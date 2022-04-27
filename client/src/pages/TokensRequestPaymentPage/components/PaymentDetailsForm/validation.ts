import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  isAmountValidator,
  isNumberValidator,
} from '../../../../util/validators';

import { MAX_MEMO_SIZE } from '../../../../constants/fio';

const validationSchema: ValidationSchema = {
  field: {
    amount: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: Validators.maxLength,
        customArgs: { length: 9 },
        message: 'Please enter valid amount.',
      },
      {
        validator: isNumberValidator,
        message: 'Please enter valid amount.',
      },
      {
        validator: isAmountValidator,
        customArgs: { chainCodeFieldId: 'chainCode' },
      },
    ],
    obtId: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    memo: [
      {
        validator: Validators.maxLength,
        customArgs: { length: MAX_MEMO_SIZE },
        message: 'Please enter valid memo, the max length is {{length}}',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
