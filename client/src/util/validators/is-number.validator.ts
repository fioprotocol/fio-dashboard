import { FieldValidationFunctionSync } from '@lemoncode/fonk';

export const isNumberValidator: FieldValidationFunctionSync = ({
  value,
  message,
}: {
  value: string | number;
  message?: string | string[];
}) => {
  const succeeded = !isNaN(Number(`${value}`));

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || 'Should be number';

  return {
    succeeded,
    message: messageString,
    type: 'IS_NUMBER',
  };
};
