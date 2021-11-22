import React, { useState } from 'react';
import { Field } from 'react-final-form';

import ChainCodeCustomDropdown from './ChainCodeCustomDropdown';
import Input, { INPUT_UI_STYLES } from '../Input/Input';

import { NFT_CHAIN_CODE_LIST } from '../../constants/common';

export const CUSTOM_CHAIN_CODE = 'customChainCode';

type Props = {
  hasAutoWidth?: boolean;
  isSimple?: boolean;
  isShort?: boolean;
  isHigh?: boolean;
  errorColor?: string;
  disabled?: boolean;
  prefixLabel?: string;
};

const NftChainCodeField: React.FC<Props> = props => {
  const {
    hasAutoWidth,
    isSimple,
    isShort,
    isHigh,
    errorColor,
    disabled,
    prefixLabel,
  } = props;
  const [showCustom, toggleCustom] = useState(false);

  const openCustom = () => toggleCustom(true);
  const closeCustom = () => toggleCustom(false);

  return showCustom || disabled ? (
    <Field
      type="text"
      name="chainCode"
      component={Input}
      onClose={closeCustom}
      upperCased={true}
      placeholder="Custom domain"
      uiType={INPUT_UI_STYLES.BLACK_WHITE}
      isLowHeight={!isHigh}
      errorColor={errorColor}
      disabled={disabled}
      prefixLabel={prefixLabel}
    />
  ) : (
    <Field
      type="dropdown"
      name="chainCode"
      component={ChainCodeCustomDropdown}
      options={NFT_CHAIN_CODE_LIST.map(chainCode => ({
        id: chainCode,
        name: chainCode,
      }))}
      customValue={{ id: CUSTOM_CHAIN_CODE, name: 'Custom Chain Code' }}
      toggleToCustom={openCustom}
      placeholder="Type or Select Chain Code"
      hasAutoWidth={hasAutoWidth}
      isSimple={isSimple}
      isShort={isShort}
      isHigh={isHigh}
    />
  );
};

export default NftChainCodeField;
