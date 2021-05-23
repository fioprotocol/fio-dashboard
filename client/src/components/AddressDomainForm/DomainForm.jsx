import React from 'react';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';
import classes from './AddressDomainForm.module.scss';

const DomainForm = props => {
  const { showPrice, debouncedOnChangeHandleField } = props;

  return (
    <div className={classes.domainInput}>
      <Field
        name="domain"
        type="text"
        placeholder="Domain name"
        colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
        component={Input}
        badge={showPrice({ isDomainPrice: true })}
        hideError="true"
      />
      <OnChange name="domain">{debouncedOnChangeHandleField}</OnChange>
    </div>
  );
};

export default DomainForm;
