import { ValidationSchema, Validators } from '@lemoncode/fonk';

import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  isChainCodeValidator,
  isHashValidator,
  isNativeBlockchainPublicAddressValidator,
  metaValidator,
} from '../../../../util/validators';

const TOKEN_ID_MAX_LENGTH = 64;
const URL_MAX_LENGTH = 128;

const validationSchema: ValidationSchema = {
  field: {
    chainCode: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isChainCodeValidator,
      },
    ],
    contractAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isNativeBlockchainPublicAddressValidator,
      },
    ],
    tokenId: [
      {
        validator: Validators.maxLength,
        customArgs: { length: TOKEN_ID_MAX_LENGTH },
        message: 'Not valid token',
      },
    ],
    url: [
      {
        validator: Validators.maxLength,
        customArgs: { length: URL_MAX_LENGTH },
        message: 'Not valid url',
      },
    ],
    hash: [
      {
        validator: isHashValidator,
      },
    ],
    creatorUrl: [
      {
        validator: metaValidator,
        customArgs: { title: 'creator_url' },
        message: 'Creator URL is too long',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
