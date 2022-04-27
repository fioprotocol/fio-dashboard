import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  fioAddressExistsValidator,
  isFioAddressValidator,
  matchFieldValidator,
  isNumberValidator,
  isValidPubAddressValidator,
  isAmountValidator,
} from '../../../../util/validators';

import {
  MAX_MEMO_SIZE,
  MAX_CHAIN_LENGTH,
  MAX_TOKEN_LENGTH,
} from '../../../../constants/fio';

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
      {
        validator: isAmountValidator,
        customArgs: { chainCodeFieldId: 'chainCode' },
      },
    ],
    payeeTokenPublicAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
    ],
    tokenCode: [
      Validators.required,
      {
        validator: Validators.maxLength,
        customArgs: { length: MAX_TOKEN_LENGTH },
        message: 'Please enter valid token code, the max length is {{length}}',
      },
    ],
    chainCode: [
      Validators.required,
      {
        validator: Validators.maxLength,
        customArgs: { length: MAX_CHAIN_LENGTH },
        message: 'Please enter valid chain code, the max length is {{length}}',
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

const onSubmitValidationSchema: ValidationSchema = {
  field: {
    payeeFioAddress: [
      {
        validator: fioAddressExistsValidator,
      },
    ],
    payerFioAddress: [
      {
        validator: fioAddressExistsValidator,
        customArgs: {
          fieldIdToCompare: 'payeeTokenPublicAddress',
          sameWalletMessage: "Can't request to same wallet.",
        },
      },
    ],
    payeeTokenPublicAddress: [
      {
        validator: isValidPubAddressValidator,
        customArgs: { chainCodeFieldId: 'chainCode' },
        message: 'Please enter valid Public Address.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
export const submitValidation = createFinalFormValidation(
  onSubmitValidationSchema,
);
