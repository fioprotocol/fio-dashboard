import React, { useEffect } from 'react';
import { Field } from 'react-final-form';

import CustomDropdown from './CustomDropdown';
import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../Input/TextInput';
import { OnChange } from 'react-final-form-listeners';

import classes from './AddressDomainForm.module.scss';

const prefix = '@';

const AddressForm = props => {
  const {
    hasCustomDomain,
    showCustomDomain,
    toggleShowCustomDomain,
    options,
    domain,
    onChangeHandleField,
    debouncedOnChangeHandleField,
    allowCustomDomains,
    isValidating,
  } = props;

  const isCustomDomain = hasCustomDomain || showCustomDomain;

  useEffect(() => {
    if (isCustomDomain) toggleShowCustomDomain(true);
  }, []);

  return (
    <>
      <div className={classes.username}>
        <Field
          name="address"
          type="text"
          placeholder="Find the perfect username .."
          colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          component={TextInput}
          hideError="true"
          lowerCased
          loading={isValidating}
          tooltip={
            <>
              <span className="boldText">FIO Crypto Handle Cost</span>
              <span>
                {' '}
                - FIO Crypto Handle Cost will fluctuate based on market
                condition. In addition, if you are already have a free public
                address, there will be cost associated with another address
              </span>
            </>
          }
        />
        <OnChange name="address">{debouncedOnChangeHandleField}</OnChange>
      </div>
      <div className={classes.space}></div>
      <div className={classes.domainContainer}>
        {isCustomDomain ? (
          <Field
            name="domain"
            type="text"
            placeholder="Custom domain"
            colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            component={TextInput}
            lowerCased
            onClose={() => {
              toggleShowCustomDomain(false);
            }}
            hideError="true"
            prefix={prefix}
            loading={isValidating}
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
