import React, { useEffect, useRef, useState } from 'react';
import { Field, useForm } from 'react-final-form';
import Dropdown from '../../../../components/Input/Dropdown';
import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import ChainCodeCustomDropdown from '../../../../components/Input/ChainCodeCustomDropdown';
import { CUSTOM_CHAIN_CODE } from '../../../../components/ChainCodeField/ChainCodeField';
import { CHAIN_CODE_LIST } from '../../../../constants/common';

type Props = {
  isVisible: boolean;
  chainCodeList?: {
    id: string;
    name: string;
    tokens?: { id: string; name: string }[];
  }[];
  chainCodeValue?: any;
};

const CHAIN_CODE_FIELD_NAME = 'chainCode';
const TOKEN_CODE_FIELD_NAME = 'tokenCode';

const TokenDataFields: React.FC<Props> = props => {
  const { isVisible, chainCodeList, chainCodeValue } = props;

  const customChainIdInputRef = useRef<HTMLInputElement>(null);

  const { change, resetFieldState } = useForm();

  const [tokensCodesList, setTokensCodesList] = useState(null);
  const [isCustomChainCode, toggleIsCustomChainCode] = useState(false);

  const openCustomChainCode = () => {
    toggleIsCustomChainCode(true);
    setTimeout(() => {
      customChainIdInputRef?.current?.focus();
    });
  };
  const closeCustomChainCode = () => toggleIsCustomChainCode(false);
  const resetFieldValue = (fieldName: string) => {
    change(fieldName, '');
    resetFieldState(fieldName);
  };

  useEffect(() => {
    if (!isCustomChainCode) {
      if (chainCodeValue) {
        const ChainItemData = CHAIN_CODE_LIST.filter(
          o => o.id === chainCodeValue,
        )[0];
        setTokensCodesList(ChainItemData?.tokens || null);
        change(
          TOKEN_CODE_FIELD_NAME,
          ChainItemData?.tokens?.length
            ? ChainItemData.tokens[0].id
            : chainCodeValue,
        );
      } else {
        setTokensCodesList(null);
        resetFieldValue(TOKEN_CODE_FIELD_NAME);
      }
    }
  }, [chainCodeValue, isCustomChainCode]);

  useEffect(() => {
    if (isCustomChainCode) resetFieldValue(TOKEN_CODE_FIELD_NAME);
  }, [isCustomChainCode]);

  if (!isVisible) return null;

  return (
    <div className="d-flex justify-content-between w-100 flex-grow-1">
      <div className="w-100 mr-2">
        {isCustomChainCode ? (
          <Field
            type="text"
            name={CHAIN_CODE_FIELD_NAME}
            placeholder="Custom chain code"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            onClose={closeCustomChainCode}
            isLowHeight={false}
            upperCased={true}
            component={TextInput}
            disabled={false}
            label="Chain Id"
            hideError={false}
            ref={customChainIdInputRef}
          />
        ) : (
          <Field
            name={CHAIN_CODE_FIELD_NAME}
            label="Chain Id"
            component={ChainCodeCustomDropdown}
            customValue={{ id: CUSTOM_CHAIN_CODE, name: 'Custom Chain Code' }}
            toggleToCustom={openCustomChainCode}
            placeholder="Type or Select Chain Code"
            isFormField={true}
            hasAutoWidth={true}
            // options={chainCodeList}
            options={chainCodeList.map(chainCode => ({
              id: chainCode.id,
              name: `${chainCode.name} (${chainCode.id})`,
            }))}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            isSimple={true}
            isWidthResponsive={true}
            isHigh={true}
            isWhite={true}
          />
        )}
      </div>
      <div className="w-100 ml-2">
        {!isCustomChainCode && tokensCodesList?.length ? (
          <Field
            name={TOKEN_CODE_FIELD_NAME}
            label="Token"
            component={Dropdown}
            placeholder="Select Token type"
            options={tokensCodesList.map(
              (tokenCode: { id: string; name: string }) => ({
                id: tokenCode.id,
                name: `${tokenCode.name} (${tokenCode.id})`,
              }),
            )}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            isSimple={true}
            errorColor={COLOR_TYPE.WARN}
            isWidthResponsive={true}
            isHigh={true}
            isWhite={true}
          />
        ) : (
          <Field
            name={TOKEN_CODE_FIELD_NAME}
            label="Token"
            placeholder={
              isCustomChainCode
                ? 'Enter token type'
                : 'Please select Chain Id first'
            }
            component={TextInput}
            disabled={!isCustomChainCode}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            upperCased={true}
          />
        )}
      </div>
    </div>
  );
};

export default TokenDataFields;
