import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import {
  fioAddressExistsValidator,
  isFioAddressValidator,
  matchFieldValidator,
  isNumberValidator,
} from '../../../../util/validators';

import { MAX_MEMO_SIZE } from '../../../../constants/fio';

const validationSchema: ValidationSchema = {
  field: {
    payeeFioAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    payerFioAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: matchFieldValidator,
        customArgs: { fieldId: 'payeeFioAddress', isMatch: false },
        message: 'FIO Crypto Handle cannot be same.',
      },
      {
        validator: isFioAddressValidator,
        customArgs: { onlyFioAddress: true },
        message: 'Please enter valid FIO Crypto Handle.',
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
    ],
    tokenCode: [Validators.required],
    chainCode: [Validators.required],
    memo: [
      {
        validator: Validators.maxLength,
        customArgs: { length: MAX_MEMO_SIZE },
        message: 'Please enter valid memo, the max length is {{length}}',
      },
    ],
  },
};

const onSubmitValidationSchema: ValidationSchema = {
  field: {
    payerFioAddress: [
      {
        validator: fioAddressExistsValidator,
        customArgs: {
          fieldIdToCompare: 'payeeTokenPublicAddress',
          sameWalletMessage: "Can't request to same wallet.",
        },
        message: 'Please enter valid FIO Crypto Handle.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
export const submitValidation = createFinalFormValidation(
  onSubmitValidationSchema,
);
