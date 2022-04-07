import { FieldValidationFunctionSync } from '@lemoncode/fonk';

interface MetaFieldArgs {
  title?: string;
}

const META_MAX_LENGTH = 128;

export const metaValidator: FieldValidationFunctionSync<MetaFieldArgs> = ({
  value,
  message,
  customArgs,
}) => {
  const { title = 'meta' } = customArgs || {};

  const succeeded =
    JSON.stringify({ [title]: value }).length <= META_MAX_LENGTH;

  const messageString = succeeded
    ? ''
    : typeof message === 'string'
    ? message
    : message?.[0] || 'Meta valid hash';

  return {
    succeeded,
    message: messageString,
    type: 'META',
  };
};
