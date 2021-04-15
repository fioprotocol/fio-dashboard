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
    domains,
    isHomepage,
    formState,
    type,
    getPrices,
    getDomains,
    fioWallets,
    refreshFioWallets,
    account,
    // cart, //todo: replace with cart data
  } = props;

  const isAddress = type === ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS;
  const isDomain = type === ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN;

  const [isCustomDomain, toggleCustomDomain] = useState(false);
  const [isAvailable, toggleAvailable] = useState(false);
  const [prevValues, changePrevValues] = useState({});
  const [cartItems, updateCart] = useState([]); //todo: replace with cart data
  const [userDomains, setUserDomains] = useState([]);

  const { domain } = formState;
  const options = [
    ...domains.map(({ domain }) => domain),
    ...userDomains.map(({ name }) => name),
  ];

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

  useEffect(async () => {
    getPrices();
    getDomains();
    if (account) {
      refreshFioWallets(account);
    }
    if (fioWallets) {
      const userDomains = [];
      for (const fioWallet of fioWallets) {
        const domains = await fioWallet.otherMethods.getFioDomains();
        if (domains.length) userDomains.push(domains);
      }
      setUserDomains(userDomains);
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
        options={options}
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
