import React from 'react';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import TextInput, { INPUT_COLOR_SCHEMA } from '../Input/TextInput';

import { AddressFormProps } from './types';

import classes from './AddressDomainForm.module.scss';

const AddressForm: React.FC<AddressFormProps> = props => {
  const { isValidating, debouncedOnChangeHandleField } = props;

  return (
    <div className={classes.username}>
      <Field
        name="address"
        type="text"
        placeholder="Enter a Username"
        colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
        component={TextInput}
        hideError="true"
        lowerCased
        loading={isValidating}
        tooltip={
          <>
            <span className="boldText">FIO Handle Cost</span>

            <span>
              {' '}
              - FIO Handle Cost will fluctuate based on market condition. In
              addition, if you are already have a free public address, there
              will be cost associated with another address
            </span>
          </>
        }
      />
      <OnChange name="address">{debouncedOnChangeHandleField}</OnChange>
    </div>
  );
};

export default AddressForm;
