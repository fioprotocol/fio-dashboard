import React from 'react';
import GenericNftValidationField, {
  FIELDS_NAMES,
} from './GenericNftValidationField';
import NftChainCodeField from '../../../components/NftChainCodeField/NftChainCodeField';

import classes from '../styles/GenericNftValidationField.module.scss';

const ContractAddressField: React.FC = () => {
  return (
    <div className={classes.contractAddressContainer}>
      <div className={classes.smallField}>
        <NftChainCodeField isShort={true} />
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
