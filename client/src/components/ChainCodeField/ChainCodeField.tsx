import React from 'react';
import { Field } from 'react-final-form';

import ChainCodeCustomDropdown from '../Input/ChainCodeCustomDropdown';

export const CUSTOM_CHAIN_CODE = 'customChainCode';
const CHAIN_CODE_FIELD_NAME = 'chainCode';
const CHAIN_CODE_PLACEHOLDER = 'Type or Select Chain Code';

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
  forceReset?: boolean;
  loading?: boolean;
  placeholder?: string;
  uiType?: string;
  upperCased?: boolean;
  onClear?: () => void;
  onInputChange?: (chainCodeValue: string) => Promise<void> | void;
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
    fieldName = CHAIN_CODE_FIELD_NAME,
    forceReset,
    loading,
    placeholder = CHAIN_CODE_PLACEHOLDER,
    uiType,
    upperCased,
    onClear,
    onInputChange,
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
      placeholder={placeholder}
      hasAutoWidth={hasAutoWidth}
      noShadow={noShadow}
      isShort={isShort}
      isHigh={isHigh}
      prefix={prefixLabel}
      disabled={disabled}
      label={label}
      errorColor={errorColor}
      hideError={hideError}
      forceReset={forceReset}
      loading={loading}
      uiType={uiType}
      upperCased={upperCased}
      onClear={onClear}
      onInputChange={onInputChange}
    />
  );
};

export default ChainCodeField;
