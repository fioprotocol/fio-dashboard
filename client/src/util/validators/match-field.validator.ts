import { FieldValidationFunctionSync } from '@lemoncode/fonk';

interface MatchFieldArgs {
  fieldId?: string;
  isMatch?: boolean;
}

export const matchFieldValidator: FieldValidationFunctionSync<MatchFieldArgs> = ({
  value,
  values,
  message,
  customArgs,
}) => {
  const { fieldId = '', isMatch = true } = customArgs || {};

  const succeeded = isMatch
    ? value === values[fieldId]
    : value !== values[fieldId];

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || (isMatch ? 'Must match.' : 'Must differ.');

  return {
    succeeded,
    message: messageString,
    type: 'MATCH_FIELD',
  };
};
