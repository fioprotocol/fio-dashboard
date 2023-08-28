import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  isFioAddressValidator,
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
    fioAddress: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isFioAddressValidator,
        message: 'Please enter valid FIO Handle.',
        customArgs: { onlyFioAddress: true },
      },
    ],
    wrappedDomainTokenId: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isNumberValidator,
        message: 'Enter valid token id.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
