import React, { useState } from 'react';
import { Field } from 'react-final-form';

import ChainCodeCustomDropdown from '../Input/ChainCodeCustomDropdown';
import Input, { INPUT_UI_STYLES } from '../Input/Input';

export const CUSTOM_CHAIN_CODE = 'customChainCode';

type Props = {
  hasAutoWidth?: boolean;
  isSimple?: boolean;
  isShort?: boolean;
  isHigh?: boolean;
  errorColor?: string;
  disabled?: boolean;
  prefixLabel?: string;
  list: { id: string; name: string }[];
  fieldName?: string;
  hideError?: boolean;
};

const ChainCodeField: React.FC<Props> = props => {
  const {
    hasAutoWidth,
    isSimple,
    isShort,
    isHigh,
    errorColor,
    disabled,
    prefixLabel,
    list,
    fieldName = 'chainCode',
    hideError,
  } = props;
  const [showCustom, toggleCustom] = useState(false);

  const openCustom = () => toggleCustom(true);
  const closeCustom = () => toggleCustom(false);

  return showCustom || disabled ? (
    <Field
      type="text"
      name={fieldName}
      component={Input}
      onClose={closeCustom}
      upperCased={true}
      placeholder="Custom chain code"
      uiType={INPUT_UI_STYLES.BLACK_WHITE}
      isLowHeight={!isHigh}
      errorColor={errorColor}
      disabled={disabled}
      prefixLabel={prefixLabel}
      hideError={hideError}
    />
  ) : (
    <Field
      type="dropdown"
      name={fieldName}
      component={ChainCodeCustomDropdown}
      options={list.map(chainCode => ({
        id: chainCode.id,
        name: `${chainCode.name} (${chainCode.id})`,
      }))}
      customValue={{ id: CUSTOM_CHAIN_CODE, name: 'Custom Chain Code' }}
      toggleToCustom={openCustom}
      placeholder="Type or Select Chain Code"
      hasAutoWidth={hasAutoWidth}
      isSimple={isSimple}
      isShort={isShort}
      isHigh={isHigh}
      isFormField={true}
    />
  );
};

export default ChainCodeField;
