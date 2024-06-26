import { ERROR_UI_TYPE } from '../../components/Input/ErrorBadge';

import { CHAIN_CODE_REGEXP, TOKEN_CODE_REGEXP } from '../../constants/regExps';

import { MAX_CHAIN_LENGTH, MAX_TOKEN_LENGTH } from '../../constants/fio';

import { ASTERISK_SIGN, CHAIN_CODES } from '../../constants/common';

import { AddTokenValues } from './types';

import { PublicAddressDoublet } from '../../types';

export type ErrorsProps = {
  chainCode?: {
    message: string;
    type?: string;
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

export const validateToken = (
  token: PublicAddressDoublet,
  publicAddresses: PublicAddressDoublet[],
): ErrorsProps => {
  const tokenErrors: ErrorsProps = {};
  const { chainCode, tokenCode, publicAddress } = token || {};

  if (!chainCode) {
    tokenErrors.chainCode = { message: 'Required' };
  }
  if (chainCode && !CHAIN_CODE_REGEXP.test(chainCode)) {
    tokenErrors.chainCode = { message: 'Wrong Chain Code' };
  }
  if ((chainCode?.length || 0) > MAX_CHAIN_LENGTH) {
    tokenErrors.chainCode = { message: 'Chain Code is too long' };
  }

  if (!tokenCode) {
    tokenErrors.tokenCode = { message: 'Required' };
  }
  if (tokenCode && !TOKEN_CODE_REGEXP.test(tokenCode)) {
    tokenErrors.tokenCode = { message: 'Wrong Token Code' };
  }
  if ((tokenCode?.length || 0) > MAX_TOKEN_LENGTH) {
    tokenErrors.tokenCode = { message: 'Token Code is too long' };
  }

  if (chainCode && tokenCode) {
    if (
      publicAddresses.some(
        pubAddressItem =>
          pubAddressItem.chainCode === chainCode &&
          (pubAddressItem.tokenCode === tokenCode ||
            tokenCode === ASTERISK_SIGN),
      )
    ) {
      tokenErrors.tokenCode = {
        message: 'This pair of Chain and Token Codes already exists',
      };
    }

    if (chainCode === CHAIN_CODES.FIO && tokenCode === CHAIN_CODES.FIO) {
      tokenErrors.chainCode = {
        message:
          'Your FIO Public Key is already mapped to your FIO Handle and that mapping cannot be changed via the FIO App.',
        type: ERROR_UI_TYPE.BADGE,
      };
    }
  }

  if (!publicAddress) {
    tokenErrors.publicAddress = { message: 'Required' };
  }
  if (publicAddress && publicAddress.length >= 128) {
    tokenErrors.publicAddress = { message: 'Too long token' };
  }

  return tokenErrors;
};

export const validate = (
  values: AddTokenValues,
  publicAddresses: PublicAddressDoublet[],
): {
  tokens: ErrorsProps[] | string;
} => {
  const errors: {
    tokens: ErrorsProps[] | string;
  } = { tokens: [] };

  if (!values.tokens) {
    errors.tokens = 'Required';
  } else {
    const tokenArrayErrors: ErrorsProps[] = [];

    values.tokens.forEach((field: FieldProps, index: number) => {
      const tokenErrors: ErrorsProps = validateToken(
        field as PublicAddressDoublet,
        [...publicAddresses, ...values.tokens.slice(0, index)].filter(Boolean),
      );

      if (Object.keys(tokenErrors).length > 0) {
        tokenArrayErrors[index] = tokenErrors;
      }
    });

    if (tokenArrayErrors.length) {
      errors.tokens = tokenArrayErrors;
    }
  }

  return errors;
};
