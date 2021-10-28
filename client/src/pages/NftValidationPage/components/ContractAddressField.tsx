import React from 'react';
import GenericNftValidationField, {
  FIELDS_NAMES,
} from './GenericNftValidationField';

import classes from './GenericNftValidationField.module.scss';

const ContractAddressField: React.FC = () => {
  return (
    <div className={classes.contractAddressContainer}>
      <GenericNftValidationField fieldName={FIELDS_NAMES.CHAIN_CODE} />
      <GenericNftValidationField
        fieldName={FIELDS_NAMES.CONTRACT_ADDRESS}
        isMaxField={true}
      />
      <GenericNftValidationField fieldName={FIELDS_NAMES.TOKEN_ID} />
    </div>
  );
};

export default ContractAddressField;
