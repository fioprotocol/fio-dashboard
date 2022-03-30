import React from 'react';
import { Field } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../components/Input/Input';

import classes from '../styles/GenericNftValidationField.module.scss';

export const FIELDS_NAMES = {
  FIO_ADDRESS: 'fioAddress',
  HASH: 'hash',
  CHAIN_CODE: 'chainCode',
  CONTRACT_ADDRESS: 'contractAddress',
  TOKEN_ID: 'tokenId',
};

const FIELDS_PLACEHOLDER = {
  [FIELDS_NAMES.FIO_ADDRESS]: 'Enter or Paste FIO Crypto Handle',
  [FIELDS_NAMES.HASH]: 'Enter or Paste Hash / Media URL',
  [FIELDS_NAMES.CHAIN_CODE]: 'Enter or Paste Chain Code',
  [FIELDS_NAMES.CONTRACT_ADDRESS]: 'Enter or Paste Contract Address',
  [FIELDS_NAMES.TOKEN_ID]: 'Enter or Paste Token ID',
};

type Props = {
  fieldName: string;
  isMaxField?: boolean;
};

const GenericNftValidationField: React.FC<Props> = props => {
  const { fieldName, isMaxField } = props;
  return (
    <div className={isMaxField ? classes.maxField : classes.smallField}>
      <Field
        type="text"
        name={fieldName}
        placeholder={FIELDS_PLACEHOLDER[fieldName]}
        component={Input}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        showPasteButton={true}
        isLowHeight={true}
      />
    </div>
  );
};

export default GenericNftValidationField;
