import { CreateWalletValues } from '../../types';

const NAME_REGEX = /^[a-zA-Z0-9\s\-_]{1,32}$/i;

export const validate = (values: CreateWalletValues) => {
  if (!values.name) {
    return { name: 'Name is required' };
  }

  if (!NAME_REGEX.test(values.name)) {
    return {
      name:
        'Name is not valid. Name should be from 1 to 32 symbols and contain only letters, digits, spaces, dashes or underscores',
    };
  }

  return {};
};
