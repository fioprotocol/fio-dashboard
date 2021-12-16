import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-final-form';
import * as Scroll from 'react-scroll';

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

  const notificationRef = useRef(null);

  const options = [...domains.map(({ domain }) => domain)];

  const isDesktop = useCheckIfDesktop();

  useEffect(() => {
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

    if (!isDesktop && showAvailable) {
      const scroll = Scroll.animateScroll;
      notificationRef &&
        notificationRef.current &&
        scroll.scrollTo(notificationRef.current.offsetTop + 20, {
          duration: 600,
        });
    }
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

      const cost = `Cost: ${price}`;
      return isDomainPrice && !hasCustomDomain && hasCurrentDomain
        ? null
        : cost;
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
        isDesktop={isDesktop}
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
          isDesktop={isDesktop}
          showPrice={showPrice}
          ref={notificationRef}
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
