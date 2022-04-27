import React, { useEffect, useState } from 'react';
import { Field, useForm } from 'react-final-form';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import ChainCodeCustomDropdown from '../../../../components/Input/ChainCodeCustomDropdown';

import { CHAIN_CODE_LIST } from '../../../../constants/common';

import classes from '../../styles/TokenDataFields.module.scss';

type Props = {
  isVisible: boolean;
  chainCodeList?: {
    id: string;
    name: string;
    tokens?: { id: string; name: string }[];
  }[];
  chainCodeValue?: string;
  initialValues: { chainCode?: string; tokenCode?: string };
};

const CHAIN_CODE_FIELD_NAME = 'chainCode';
const TOKEN_CODE_FIELD_NAME = 'tokenCode';

const TokenDataFields: React.FC<Props> = props => {
  const { isVisible, chainCodeList, chainCodeValue, initialValues } = props;

  const { change, resetFieldState } = useForm();

  const [tokensCodesList, setTokensCodesList] = useState<
    { id: string; name: string }[] | null
  >(null);
  const [isCustomChainCode, toggleIsCustomChainCode] = useState(false);

  const resetFieldValue = (fieldName: string) => {
    change(fieldName, '');
    resetFieldState(fieldName);
  };

  useEffect(() => {
    if (!isCustomChainCode) {
      if (chainCodeValue) {
        const ChainItemData = CHAIN_CODE_LIST.find(
          o => o.id === chainCodeValue,
        );
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
    <div className={classes.container}>
      <div className={classes.field}>
        <Field
          name={CHAIN_CODE_FIELD_NAME}
          label="Chain Id"
          component={ChainCodeCustomDropdown}
          toggleToCustom={toggleIsCustomChainCode}
          placeholder="Type or Select Chain Code"
          options={chainCodeList?.map(chainCode => ({
            value: chainCode.id,
            label: `${chainCode.id} (${chainCode.name})`,
          }))}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          isSimple={true}
          isHigh={true}
          noShadow={true}
          initialValues={initialValues.chainCode}
        />
      </div>
      <div className={classes.field}>
        {!isCustomChainCode && tokensCodesList?.length ? (
          <Field
            name={TOKEN_CODE_FIELD_NAME}
            label="Token"
            component={ChainCodeCustomDropdown}
            placeholder="Select Token type"
            options={tokensCodesList.map(
              (tokenCode: { id: string; name: string }) => ({
                value: tokenCode.id,
                label: `${tokenCode.name} (${tokenCode.id})`,
              }),
            )}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            isSimple={true}
            errorColor={COLOR_TYPE.WARN}
            isHigh={true}
            noShadow={true}
            initialValues={initialValues.tokenCode}
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
