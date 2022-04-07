import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import { fioWalletNameValidator } from '../../../../util/validators';

const validationSchema: ValidationSchema = {
  field: {
    name: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: fioWalletNameValidator,
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
