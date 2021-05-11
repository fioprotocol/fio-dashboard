import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import Notifications from './Notifications';
import FormContainer from './FormContainer';
import { debounce } from 'lodash';
import { setDataMutator } from '../../utils';

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
    prices,
    // cart, //todo: replace with cart data
  } = props;

  const isAddress = type === ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS;
  const isDomain = type === ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN;

  const [isCustomDomain, toggleCustomDomain] = useState(false);
  const [isAvailable, toggleAvailable] = useState(false);
  const [cartItems, updateCart] = useState([]); //todo: replace with cart data
  const [userDomains, setUserDomains] = useState([]);
  const [formErrors, changeFormErrors] = useState({});
  const [isValidating, toggleValidating] = useState(false);
  const [isFree, setFree] = useState(true);

  const { domain } = formState;
  const options = [
    ...domains.map(({ domain }) => domain),
    ...userDomains.map(({ name }) => name),
  ];

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;
  const showPrice = ({ isAddressPrice, isDomainPrice }) => {
    const {
      usdt: { address: usdcAddressPrice, domain: usdcDomainPrice },
      fio: { address: fioAddressPrice, domain: fioDomainPrice },
    } = prices;
    let price;

    if (isAddressPrice) {
      price = isFree
        ? 'FREE'
        : `${fioAddressPrice.toFixed(2)} FIO (${usdcAddressPrice.toFixed(
            2,
          )} USDC)`;
    }
    if (isDomainPrice) {
      price =
        isFree && !isCustomDomain
          ? 'FREE'
          : `${fioDomainPrice.toFixed(2)} FIO (${usdcDomainPrice.toFixed(
              2,
            )} USDC)`;
    }

    const cost = isDesktop ? 'Cost: ' : '';
    return cost + price;
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
      const userAddresses = [];
      for (const fioWallet of fioWallets) {
        const domains = await fioWallet.otherMethods.getFioDomains();
        const addresses = await fioWallet.otherMethods.getFioAddresses();
        if (domains.length) userDomains.push(domains);
        if (addresses.length) userAddresses.push(addresses);
      }
      setUserDomains(userDomains);
      setFree(userAddresses.length === 0);
    }
    return () => {
      setUserDomains([]);
      setFree(true);
    };
  }, []);

  useEffect(() => {
    if (isDomain) {
      toggleCustomDomain(true);
    }
  }, []);

  const validationProps = {
    options,
    toggleAvailable,
    changeFormErrors,
    isAddress,
    toggleValidating,
  };

  const handleSubmit = (values, form) => {
    if (isHomepage) return;

    const validationPropsToPass = {
      formProps: form,
      ...validationProps,
    };

    if (isAddress) addressValidation(validationPropsToPass);
    if (isDomain) domainValidation(validationPropsToPass);
  };

  const handleChange = debounce(formProps => {
    const validationPropsToPass = {
      formProps,
      ...validationProps,
    };
    if (isAddress) addressValidation(validationPropsToPass);
    if (isDomain) domainValidation(validationPropsToPass);
  }, 500);

  const renderItems = formProps => {
    return [
      <FormContainer
        formProps={formProps}
        {...props}
        options={options}
        isAddress={isAddress}
        isCustomDomain={isCustomDomain}
        toggleCustomDomain={toggleCustomDomain}
        domain={domain}
        key="form"
        showPrice={showPrice}
        handleChange={handleChange}
        toggleAvailable={toggleAvailable}
        isValidating={isValidating}
        formState={formState}
        isFree={isFree}
      />,
      !isHomepage && (
        <Notifications
          formProps={formProps}
          formErrors={formErrors}
          {...props}
          isCustomDomain={isCustomDomain}
          isAvailable={isAvailable}
          toggleAvailable={toggleAvailable}
          cartItems={cartItems} //todo: remove on real cart data
          updateCart={updateCart}
          isAddress={isAddress}
          isDomain={isDomain}
          key="notifications"
          isFree={isFree}
        />
      ),
    ];
  };

  return (
    <Form
      onSubmit={handleSubmit}
      mutators={{ setDataMutator }}
      initialValues={formState}
    >
      {renderItems}
    </Form>
  );
};

export default AddressDomainForm;
