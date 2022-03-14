import React from 'react';
import { Field } from 'react-final-form';

import ChainCodeCustomDropdown from '../Input/ChainCodeCustomDropdown';

export const CUSTOM_CHAIN_CODE = 'customChainCode';

type Props = {
  hasAutoWidth?: boolean;
  noShadow?: boolean;
  isShort?: boolean;
  isHigh?: boolean;
  errorColor?: string;
  disabled?: boolean;
  prefixLabel?: string;
  optionsList: { id: string; name: string }[];
  label?: string;
  hideError?: boolean;
  fieldName?: string;
};

const ChainCodeField: React.FC<Props> = props => {
  const {
    hasAutoWidth,
    noShadow,
    isShort,
    isHigh,
    prefixLabel,
    disabled,
    optionsList,
    label,
    errorColor,
    hideError,
    fieldName = 'chainCode',
  } = props;

  return (
    <Field
      type="dropdown"
      name={fieldName}
      component={ChainCodeCustomDropdown}
      options={optionsList.map(chainCode => ({
        value: chainCode.id,
        label: `${chainCode.id} (${chainCode.name})`,
      }))}
      placeholder="Type or Select Chain Code"
      hasAutoWidth={hasAutoWidth}
      noShadow={noShadow}
      isShort={isShort}
      isHigh={isHigh}
      prefix={prefixLabel}
      disabled={disabled}
      label={label}
      errorColor={errorColor}
      hideError={hideError}
    />
  );
};

export default ChainCodeField;
