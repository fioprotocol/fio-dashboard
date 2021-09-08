import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { useCheckIfDesktop } from '../../screenType';
import Notifications from './Notifications.tsx';
import FormContainer from './FormContainer';
import debounce from 'lodash/debounce';
import {
  setDataMutator,
  cartHasFreeItem,
  isFreeDomain,
  priceToNumber,
} from '../../utils';

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
    refreshFioNames,
    prices,
    cartItems,
    recalculate,
    hasFreeAddress,
  } = props;

  const isAddress = type === ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS;
  const isDomain = type === ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN;

  const [showCustomDomain, toggleShowCustomDomain] = useState(false);
  const [showAvailable, toggleShowAvailable] = useState(false);
  const [formErrors, changeFormErrors] = useState({});
  const [isValidating, toggleValidating] = useState(false);

  const options = [...domains.map(({ domain }) => domain)];

  const isDesktop = useCheckIfDesktop();

  useEffect(() => {
    getPrices();
    getDomains();
  }, []);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      refreshFioNames(fioWallet.publicKey);
    }
  }, [fioWallets]);

  const validationProps = {
    options,
    toggleShowAvailable,
    changeFormErrors,
    isAddress,
    toggleValidating,
    cartItems,
    recalculate,
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

  const handleChange = formProps => {
    const validationPropsToPass = {
      formProps,
      ...validationProps,
    };
    if (isAddress) addressValidation(validationPropsToPass);
    if (isDomain) domainValidation(validationPropsToPass);
  };

  const debouncedHandleChange = debounce(handleChange, 500);

  const renderItems = formProps => {
    const { values: { address, domain } = {} } = formProps || {};

    const currentCartItem = cartItems.find(item => {
      if (!address) return item.domain === domain;
      return item.address === address && item.domain === domain;
    });

    const hasCustomDomain =
      (domain &&
        options.every(option => option !== domain) &&
        cartItems.every(item => item.domain !== domain)) ||
      isDomain ||
      (currentCartItem && currentCartItem.hasCustomDomain);

    const hasCurrentDomain =
      domain &&
      cartItems.some(
        item =>
          item.domain === domain.toLowerCase() &&
          item.id !== (currentCartItem && currentCartItem.id),
      );

    const isFree =
      (!hasCustomDomain &&
        !cartHasFreeItem(cartItems) &&
        !hasFreeAddress &&
        isFreeDomain({ domains, domain })) ||
      (currentCartItem && !currentCartItem.costFio);

    const showPrice = ({ isDomainPrice = null } = {}) => {
      const {
        usdt: { address: usdcAddressPrice, domain: usdcDomainPrice },
        fio: { address: fioAddressPrice, domain: fioDomainPrice },
      } = prices;

      let costUsdc;
      let costFio;

      if (!isFree && !isDomain) {
        costUsdc = priceToNumber(usdcAddressPrice);
        costFio = priceToNumber(fioAddressPrice);
      }
      if (hasCustomDomain) {
        costUsdc = costUsdc
          ? costUsdc + priceToNumber(usdcDomainPrice)
          : priceToNumber(usdcDomainPrice);
        costFio = costFio
          ? costFio + priceToNumber(fioDomainPrice)
          : priceToNumber(fioDomainPrice);
      }

      const price = isFree
        ? 'FREE'
        : `${costFio.toFixed(2)} FIO (${costUsdc.toFixed(2)} USDC)`;

      const cost = isDesktop ? 'Cost: ' : '';
      return isDomainPrice && !hasCustomDomain && hasCurrentDomain
        ? null
        : cost + price;
    };

    return [
      <FormContainer
        formProps={formProps}
        {...props}
        options={options}
        isAddress={isAddress}
        isDomain={isDomain}
        hasCustomDomain={hasCustomDomain}
        showCustomDomain={showCustomDomain}
        toggleShowCustomDomain={toggleShowCustomDomain}
        domain={domain}
        key="form"
        showPrice={showPrice}
        handleChange={handleChange}
        debouncedHandleChange={debouncedHandleChange}
        toggleShowAvailable={toggleShowAvailable}
        isValidating={isValidating}
        formState={formState}
        isFree={isFree}
        hasFreeAddress={hasFreeAddress}
      />,
      !isHomepage && (
        <Notifications
          formProps={formProps}
          formErrors={formErrors}
          {...props}
          hasCustomDomain={hasCustomDomain}
          showCustomDomain={showCustomDomain}
          currentCartItem={currentCartItem}
          showAvailable={showAvailable}
          toggleShowAvailable={toggleShowAvailable}
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
