import { Validators, ValidationSchema } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';

import {
  isFioDomainValidator,
  fioDomainIsNotExistValidator,
  fioDomainWatchlistValidator,
} from '../../../../util/validators';

import { DOMAIN_IS_NOT_EXIST } from '../../../../constants/errors';

const validationSchema: ValidationSchema = {
  field: {
    domain: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      {
        validator: isFioDomainValidator,
        message: 'Invalid Domain name. Please enter again.',
      },
      {
        validator: fioDomainWatchlistValidator,
        message: 'Domain is already present in watchlist',
      },
      {
        validator: fioDomainIsNotExistValidator,
        message: DOMAIN_IS_NOT_EXIST,
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
