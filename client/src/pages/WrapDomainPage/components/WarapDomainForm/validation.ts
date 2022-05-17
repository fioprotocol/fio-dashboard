import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import { isValidPubAddressValidator } from '../../../../util/validators';

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
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
