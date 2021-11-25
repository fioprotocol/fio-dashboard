import React from 'react';
import { Field } from 'react-final-form';

import ChainCodeCustomDropdown from './ChainCodeCustomDropdown';

import { NFT_CHAIN_CODE_LIST } from '../../constants/common';

export const CUSTOM_CHAIN_CODE = 'customChainCode';

type Props = {
  hasAutoWidth?: boolean;
  noShadow?: boolean;
  isShort?: boolean;
  isHigh?: boolean;
  errorColor?: string;
  disabled?: boolean;
  prefixLabel?: string;
};

const NftChainCodeField: React.FC<Props> = props => {
  const {
    hasAutoWidth,
    noShadow,
    isShort,
    isHigh,
    prefixLabel,
    disabled,
  } = props;

  return (
    <Field
      type="dropdown"
      name="chainCode"
      component={ChainCodeCustomDropdown}
      options={NFT_CHAIN_CODE_LIST.map(chainCode => ({
        value: chainCode,
        label: chainCode,
      }))}
      placeholder="Type or Select Chain Code"
      hasAutoWidth={hasAutoWidth}
      noShadow={noShadow}
      isShort={isShort}
      isHigh={isHigh}
      prefix={prefixLabel}
      disabled={disabled}
    />
  );
};

export default NftChainCodeField;
