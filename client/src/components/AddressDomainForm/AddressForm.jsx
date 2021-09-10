import React, { useEffect } from 'react';
import { Field, FormSpy } from 'react-final-form';

import CustomDropdown from './CustomDropdown';
import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';
import { OnChange } from 'react-final-form-listeners';

import classes from './AddressDomainForm.module.scss';

const suffix = '@';

const AddressForm = props => {
  const {
    isHomepage,
    formName,
    hasCustomDomain,
    showCustomDomain,
    toggleShowCustomDomain,
    options,
    domain,
    updateFormState,
    onChangeHandleField,
    debouncedOnChangeHandleField,
    isFree,
    formNameGet,
    allowCustomDomains,
  } = props;

  const updateFormStateCurrent = (form, state) => {
    updateFormState(form, state);
  };

  useEffect(
    () => () => !isHomepage && updateFormStateCurrent(formNameGet, {}),
    [],
  );

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
          name="address"
          type="text"
          placeholder="Find the perfect username .."
          colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
          component={Input}
          hideError="true"
          isFree={isFree}
          lowerCased
          tooltip={
            <>
              <span className="boldText">Address Cost</span>
              <span>
                {' '}
                - Address Cost will fluctuate based on market condition. In
                addition, if you are already have a free public address, there
                will be cost associated with another address
              </span>
            </>
          }
        />
        <OnChange name="address">{debouncedOnChangeHandleField}</OnChange>
      </div>
      <div className={classes.space}></div>
      <div className={classes.domainContainer}>
        {hasCustomDomain || showCustomDomain ? (
          <Field
            name="domain"
            type="text"
            placeholder="Custom domain"
            colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
            component={Input}
            lowerCased
            onClose={() => {
              toggleShowCustomDomain(false);
            }}
            hideError="true"
            suffix={suffix}
          />
        ) : (
          <Field
            name="domain"
            component={CustomDropdown}
            options={options}
            allowCustomDomains={allowCustomDomains}
            toggle={() => {
              toggleShowCustomDomain(true);
            }}
            initValue={domain}
          />
        )}
        <OnChange name="domain">
          {showCustomDomain
            ? debouncedOnChangeHandleField
            : onChangeHandleField}
        </OnChange>
      </div>
    </>
  );
};

export default AddressForm;
