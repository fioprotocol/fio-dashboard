import isEmpty from 'lodash/isEmpty';
import {
  CHAIN_CODE_REGEXP,
  TOKEN_CODE_REGEXP,
} from '../../../constants/regExps';

import { PublicAddressDoublet } from '../../../types';

type Props = {
  tokens: PublicAddressDoublet[];
};

type ArrayErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
}[];

export const validate = (values: Props) => {
  const errors: any = {}; // todo: set form redux props to errors
  if (!values.tokens || !values.tokens.length) {
    errors.tokens = 'Required';
  }
  if (!values.tokens || isEmpty(values.tokens)) {
    errors.tokens = 'Enter Chain Code, Token Code and Public Address please';
  } else {
    const tokenArrayErrors: ArrayErrorsProps = [];
    values.tokens.forEach((field: any, index: number) => {
      const tokenErrors: {
        chainCode?: string;
        tokenCode?: string;
        publicAddress?: string;
      } = {};
      const { chainCode, tokenCode, publicAddress } = field || {};
      if (!chainCode) {
        tokenErrors.chainCode = 'Required';
        tokenArrayErrors[index] = tokenErrors;
      }
      if (chainCode && !CHAIN_CODE_REGEXP.test(chainCode)) {
        tokenErrors.chainCode = 'Wrong Chain Code';
        tokenArrayErrors[index] = tokenErrors;
      }

      if (!tokenCode) {
        tokenErrors.tokenCode = 'Required';
        tokenArrayErrors[index] = tokenErrors;
      }
      if (tokenCode && !TOKEN_CODE_REGEXP.test(tokenCode)) {
        tokenErrors.tokenCode = 'Wrong Token Code';
        tokenArrayErrors[index] = tokenErrors;
      }

      if (!publicAddress) {
        tokenErrors.publicAddress = 'Required';
        tokenArrayErrors[index] = tokenErrors;
      }
      if (publicAddress && publicAddress.length >= 128) {
        tokenErrors.publicAddress = 'Too long token';
        tokenArrayErrors[index] = tokenErrors;
      }
    });
    if (tokenArrayErrors.length) {
      errors.tokens = tokenArrayErrors;
    }
  }
  return errors;
};
