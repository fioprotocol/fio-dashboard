import React from 'react';

import GenericNftValidationField, {
  FIELDS_NAMES,
} from './GenericNftValidationField';

import ChainCodeField from '../../../components/ChainCodeField/ChainCodeField';

import { NFT_CHAIN_CODE_LIST } from '../../../constants/common';

import classes from '../styles/GenericNftValidationField.module.scss';

const ContractAddressField: React.FC = () => {
  return (
    <div className={classes.contractAddressContainer}>
      <div className={classes.smallField}>
        <ChainCodeField isShort={true} optionsList={NFT_CHAIN_CODE_LIST} />
      </div>
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.CONTRACT_ADDRESS}
        isMaxField={true}
      />
      <GenericNftValidationField fieldName={FIELDS_NAMES.TOKEN_ID} />
    </div>
  );
};

export default ContractAddressField;
