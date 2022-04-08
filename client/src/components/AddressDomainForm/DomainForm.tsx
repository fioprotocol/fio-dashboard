import React from 'react';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import Input, { INPUT_COLOR_SCHEMA, INPUT_UI_STYLES } from '../Input/TextInput';

import { DefaultFormProps } from './types';

import classes from './AddressDomainForm.module.scss';

const DomainForm: React.FC<DefaultFormProps> = props => {
  const { debouncedOnChangeHandleField, isValidating } = props;

  return (
    <div className={classes.domainInput}>
      <Field
        name="domain"
        type="text"
        placeholder="Domain name"
        colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        component={Input}
        lowerCased
        hideError="true"
        loading={isValidating}
      />
      <OnChange name="domain">{debouncedOnChangeHandleField}</OnChange>
    </div>
  );
};

export default DomainForm;
