import React from 'react';
import { Field } from 'react-final-form';
import { OnChange, OnBlur } from 'react-final-form-listeners';

import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';
import classes from './AddressDomainForm.module.scss';

const DomainForm = props => {
  const { prices, showPrice, onChangeHandleField, onBlurHandleField } = props;

  return (
    <div className={classes.domainInput}>
      <Field
        name="domain"
        type="text"
        placeholder="Domain name"
        colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
        component={Input}
        badge={showPrice(prices.usdt.domain)}
        hideError="true"
      />
      <OnChange name="domain">{onChangeHandleField}</OnChange>
      <OnBlur name="domain">{() => onBlurHandleField('domain')}</OnBlur>
    </div>
  );
};

export default DomainForm;
