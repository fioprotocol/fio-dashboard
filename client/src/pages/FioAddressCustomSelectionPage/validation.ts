import { ValidationSchema, Validators } from '@lemoncode/fonk';

import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  fioAddressCustomDomainValidator,
  fioAddressFieldValidator,
} from '../../util/validators';

const validationSchema: ValidationSchema = {
  field: {
    address: [
      {
        validator: Validators.required,
        message: 'FIO Handle Field Should Be Filled',
      },
      {
        validator: fioAddressFieldValidator,
      },
    ],
    domain: [
      {
        validator: Validators.required,
        message: 'Domain Field Should Be Filled',
      },
      {
        validator: fioAddressCustomDomainValidator,
        message:
          'FIO Handle only allows letters, numbers and dash in the middle',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
