import { CHAIN_CODE_REGEXP, TOKEN_CODE_REGEXP } from '../../constants/regExps';

import { FormValues } from './types';

type ErrorsProps = {
  chainCode?: {
    message: string;
  };
  tokenCode?: {
    message: string;
  };
  publicAddress?: {
    message: string;
  };
};

type FieldProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
};

export const validate = (values: FormValues) => {
  const errors: {
    tokens: ErrorsProps[] | string;
  } = { tokens: [] };

  if (!values.tokens) {
    errors.tokens = 'Required';
  } else {
    const tokenArrayErrors: ErrorsProps[] = [];

    values.tokens.forEach((field: FieldProps, index: number) => {
      const tokenErrors: ErrorsProps = {};
      const { chainCode, tokenCode, publicAddress } = field || {};

      if (!chainCode) {
        tokenErrors.chainCode = { message: 'Required' };
        tokenArrayErrors[index] = tokenErrors;
      }
      if (chainCode && !CHAIN_CODE_REGEXP.test(chainCode)) {
        tokenErrors.chainCode = { message: 'Wrong Chain Code' };
        tokenArrayErrors[index] = tokenErrors;
      }

      if (!tokenCode) {
        tokenErrors.tokenCode = { message: 'Required' };
        tokenArrayErrors[index] = tokenErrors;
      }
      if (tokenCode && !TOKEN_CODE_REGEXP.test(tokenCode)) {
        tokenErrors.tokenCode = { message: 'Wrong Token Code' };
        tokenArrayErrors[index] = tokenErrors;
      }

      if (!publicAddress) {
        tokenErrors.publicAddress = { message: 'Required' };
        tokenArrayErrors[index] = tokenErrors;
      }
      if (publicAddress && publicAddress.length >= 128) {
        tokenErrors.publicAddress = { message: 'Too long token' };
        tokenArrayErrors[index] = tokenErrors;
      }
    });

    if (tokenArrayErrors.length) {
      errors.tokens = tokenArrayErrors;
    }
  }

  return errors;
};
