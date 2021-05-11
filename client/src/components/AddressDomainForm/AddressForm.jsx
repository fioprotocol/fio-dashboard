import React from 'react';
import { Field, FormSpy } from 'react-final-form';
import classnames from 'classnames';

import CustomDropdown from './CustomDropdown';
import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';
import { OnChange, OnBlur } from 'react-final-form-listeners';

import classes from './AddressDomainForm.module.scss';

const AddressForm = props => {
  const {
    isHomepage,
    formName,
    isCustomDomain,
    toggleCustomDomain,
    options,
    domain,
    updateFormState,
    showPrice,
    onChangeHandleField,
    onBlurHandleField,
    isFree,
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
          colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
          badge={showPrice({ isAddressPrice: true })}
          component={Input}
          hideError="true"
          isFree={isFree}
          tooltip={
            <>
              <span className="boldText">Address Cost</span>
              <span>
                {' '}
                - Address Cost will fluctuate based on market condition. In
                addition, if you are already have a free public address, there
                will be cost assosiated with another address
              </span>
            </>
          }
        />
        <OnChange name="username">{onChangeHandleField}</OnChange>
        <OnBlur name="username">{() => onBlurHandleField('username')}</OnBlur>
      </div>
      <div className={classnames(classes.at, 'boldText')}>@</div>
      <div className={classes.domainContainer}>
        {isCustomDomain ? (
          <Field
            name="domain"
            type="text"
            placeholder="Custom domain"
            colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
            component={Input}
            onClose={toggleCustomDomain}
            badge={showPrice({ isDomainPrice: true })}
            hideError="true"
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
        <OnChange name="domain">{onChangeHandleField}</OnChange>
        <OnBlur name="domain">{() => onBlurHandleField('domain')}</OnBlur>
      </div>
    </>
  );
};

export default AddressForm;
