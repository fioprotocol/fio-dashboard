import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';

import Notifications from './Notifications';
import FormContainer from './FormContainer';

import { addressValidation, domainValidation } from './validation';

const AddressDomainForm = props => {
  const {
    options,
    isHomepage,
    formState,
    type,
    // cart, //todo: replace with cart data
  } = props;

  const isAddress = type === ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS;
  const isDomain = type === ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN;

  const [isCustomDomain, toggleCustomDomain] = useState(false);
  const [isAvailable, toggleAvailable] = useState(false);
  const [prevValues, changePrevValues] = useState({});
  const [cartItems, updateCart] = useState([]); //todo: replace with cart data

  const { domain } = formState;

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;
  const showPrice = price => {
    return `${isDesktop ? 'Cost: ' : ''}${price} USDC`;
  };

  useEffect(() => {
    if (!isHomepage && domain && options.every(option => option !== domain)) {
      toggleCustomDomain(true);
    }
  }, []);

  const validationProps = {
    forceValidate: false,
    options,
    prevValues,
    toggleAvailable,
    changePrevValues,
  };

  const handleSubmit = values => {
    if (isHomepage) return;

    if (isAddress)
      addressValidation({ values, ...validationProps, forceValidate: true });
    if (isDomain)
      domainValidation({ values, ...validationProps, forceValidate: true });
  };

  const renderItems = formProps => {
    return [
      <FormContainer
        formProps={formProps}
        {...props}
        isAddress={isAddress}
        isCustomDomain={isCustomDomain}
        toggleCustomDomain={toggleCustomDomain}
        isAvailable={isAvailable}
        domain={domain}
        key="form"
        showPrice={showPrice}
      />,
      !isHomepage && (
        <Notifications
          formProps={formProps}
          {...props}
          isCustomDomain={isCustomDomain}
          isAvailable={isAvailable}
          toggleAvailable={toggleAvailable}
          cartItems={cartItems} //todo: remove on real cart data
          updateCart={updateCart}
          isAddress={isAddress}
          isDomain={isDomain}
          key="notifications"
        />
      ),
    ];
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validate={values =>
        !isHomepage
          ? isAddress
            ? addressValidation({ values, ...validationProps })
            : isDomain
            ? domainValidation({ values, ...validationProps })
            : null
          : null
      }
      initialValues={formState}
    >
      {renderItems}
    </Form>
  );
};

export default AddressDomainForm;
