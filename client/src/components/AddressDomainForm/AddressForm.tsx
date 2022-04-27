import React from 'react';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../Input/TextInput';
import Dropdown from '../Input/Dropdown';

import { AddressFormProps } from './types';

import classes from './AddressDomainForm.module.scss';

const prefix = '@';
const CUSTOM_DROPDOWN_VALUE = {
  id: 'addCustomDomain',
  name: 'Add Custom Domain',
};

const AddressForm: React.FC<AddressFormProps> = props => {
  const {
    hasCustomDomain,
    showCustomDomain,
    options,
    allowCustomDomains,
    isValidating,
    onChangeHandleField,
    debouncedOnChangeHandleField,
    toggleShowCustomDomain,
  } = props;

  const isCustomDomain = hasCustomDomain || showCustomDomain;

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
      <div className={classes.space} />
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
            component={Dropdown}
            options={options
              .sort((a, b) => a.localeCompare(b))
              .map(option => ({ id: option, name: option }))}
            customValue={allowCustomDomains ? CUSTOM_DROPDOWN_VALUE : {}}
            toggleToCustom={() => {
              toggleShowCustomDomain(true);
            }}
            isVoilet={true}
            isWhitePlaceholder={true}
            isWhiteIcon={true}
            noMinWidth={true}
            placeholder="Select Domain"
            hideError={true}
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
