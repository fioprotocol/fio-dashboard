import { FieldValidationFunctionSync } from '@lemoncode/fonk';

const MIN_VALID_LENGTH = 3;

export const passwordRecoveryAnswerValidator: FieldValidationFunctionSync = ({
  value,
  message,
}) => {
  const { length } = value || {};

  const succeeded = length >= MIN_VALID_LENGTH;

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || `Must have at least ${MIN_VALID_LENGTH} characters`;

  return {
    succeeded,
    message: messageString,
    type: 'PASSWORD_RECOVERY_ANSWER',
  };
};
