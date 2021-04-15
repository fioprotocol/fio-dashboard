import React from 'react';
import { Field, FormSpy } from 'react-final-form';
import classnames from 'classnames';

import CustomDropdown from './CustomDropdown';
import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';

import classes from './AddressDomainForm.module.scss';

const AddressForm = props => {
  const {
    isHomepage,
    formName,
    isCustomDomain,
    toggleCustomDomain,
    prices,
    options,
    domain,
    updateFormState,
    showPrice,
  } = props;

  const updateFormStateCurrent = (form, state) => {
    updateFormState(form, state);
  };

  return (
    <>
      {isHomepage && (
        <FormSpy
          onChange={state => {
            setTimeout(() => updateFormStateCurrent(formName, state.values), 0); //stupid lib issue, fixed with hack from github issues
          }}
        />
      )}
      <div className={classes.username}>
        <Field
          name="username"
          type="text"
          placeholder="Find the perfect username .."
          colorschema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
          badge={showPrice(prices.address)}
          component={Input}
          hideerror="true"
        />
      </div>
      <div className={classnames(classes.at, 'boldText')}>@</div>
      <div className={classes.domainContainer}>
        {isCustomDomain ? (
          <Field
            name="domain"
            type="text"
            placeholder="Custom domain"
            colorschema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
            component={Input}
            onClose={toggleCustomDomain}
            badge={showPrice(prices.domain)}
            hideerror="true"
          />
        ) : (
          <Field
            name="domain"
            component={CustomDropdown}
            options={options}
            toggle={toggleCustomDomain}
            initValue={domain}
          />
        )}
      </div>
    </>
  );
};

export default AddressForm;
