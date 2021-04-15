import React from 'react';
import { Field } from 'react-final-form';

import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';
import classes from './AddressDomainForm.module.scss';

const DomainForm = props => {
  const { prices, showPrice } = props;
  return (
    <div className={classes.domainInput}>
      <Field
        name="domain"
        type="text"
        placeholder="Domain name"
        colorschema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
        component={Input}
        badge={showPrice(prices.usdt.domain)}
        hideerror="true"
      />
    </div>
  );
};

export default DomainForm;
