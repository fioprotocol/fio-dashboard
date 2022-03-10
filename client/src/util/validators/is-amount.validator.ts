import { FieldValidationFunctionSync } from '@lemoncode/fonk';

import MathOp from '../math';

import { CHAIN_CODES } from '../../constants/common';

interface AmountFieldArgs {
  chainCodeFieldId?: string;
}

const MAX_DECIMALS = 9;

export const isAmountValidator: FieldValidationFunctionSync<AmountFieldArgs> = ({
  value,
  values,
  message,
  customArgs = {},
}) => {
  const customMessage =
    typeof message === 'string' ? message : message?.[0] || '';

  const validationResult = {
    type: 'IS_AMOUNT_VALID',
    succeeded: true,
    message: customMessage,
  };

  if (new MathOp(value).lte(0)) {
    validationResult.succeeded = false;
    validationResult.message = customMessage || 'Required';
  }

  try {
    const { chainCodeFieldId } = customArgs;
    let checkDecimals = true;

    if (
      chainCodeFieldId &&
      values[chainCodeFieldId] &&
      values[chainCodeFieldId] !== CHAIN_CODES.FIO
    )
      checkDecimals = false;

    if (
      checkDecimals &&
      new MathOp(value).toString().split('.')[1].length > MAX_DECIMALS
    ) {
      validationResult.succeeded = false;
      validationResult.message =
        customMessage ||
        `Amount should have less than ${MAX_DECIMALS + 1} decimals`;
    }
  } catch (e) {
    //
  }

  return validationResult;
};
