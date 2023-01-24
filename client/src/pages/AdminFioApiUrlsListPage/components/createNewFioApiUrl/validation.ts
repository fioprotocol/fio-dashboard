import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFinalFormValidation } from '@lemoncode/fonk-final-form';
import { isUrl } from '@lemoncode/fonk-is-url-validator';

import { ENDS_WITH_FORWARD_SLASH_REGEX } from '../../../../constants/regExps';

const validationSchema: ValidationSchema = {
  field: {
    url: [
      {
        validator: Validators.required,
        message: 'Required.',
      },
      isUrl.validator,
      {
        validator: Validators.pattern,
        customArgs: { pattern: ENDS_WITH_FORWARD_SLASH_REGEX },
        message: 'Url must ends with /.',
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
