import { FieldValidationFunctionAsync } from '@lemoncode/fonk';

import apis from '../../api';
import { CHAIN_CODES } from '../../constants/common';

interface FieldArgs {
  chainCodeFieldId?: string;
}

const defaultMessage = 'Please enter valid Public Address.';

export const isValidPubAddressValidator: FieldValidationFunctionAsync<FieldArgs> = async ({
  value,
  values,
  message = defaultMessage,
  customArgs,
}) => {
  const { chainCodeFieldId } = customArgs || {};

  const chainCode = chainCodeFieldId ? values[chainCodeFieldId] : null;
  const validationResult = {
    type: 'PUB_ADDRESS_NOT_VALID',
    succeeded: false,
    message:
      typeof message === 'string'
        ? message
        : message?.[0] || 'Public address is not valid',
  };

  if (![CHAIN_CODES.ETH, CHAIN_CODES.BTC].includes(chainCode)) {
    return {
      ...validationResult,
      succeeded: true,
      message: '',
    };
  }

  try {
    const { isValid } = await apis.client.get('check-pub-address', {
      pubAddress: value,
      chainCode,
    });

    if (!isValid) return validationResult;
  } catch (e) {
    return validationResult;
  }

  return {
    ...validationResult,
    succeeded: true,
    message: '',
  };
};
