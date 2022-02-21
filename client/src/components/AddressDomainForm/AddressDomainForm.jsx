import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-final-form';
import * as Scroll from 'react-scroll';

import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { useCheckIfDesktop } from '../../screenType';
import Notifications from './Notifications.tsx';
import FormContainer from './FormContainer';
import debounce from 'lodash/debounce';
import { setDataMutator, cartHasFreeItem, isFreeDomain } from '../../utils';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';

import { addressValidation, domainValidation } from './validation';

const TOP_OFFSET = 35;
const SCROLL_DURATION = 600;
const DEBOUNCE_TIMEOUT = 500;

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
    roe,
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

    const registeredFields = form.getRegisteredFields();
    const isValidForm = registeredFields.every(registeredField => {
      const fieldState = form.getFieldState(registeredField);
      return !fieldState.data.error;
    });

    if (!isDesktop && isValidForm) {
      const scroll = Scroll.animateScroll;
      notificationRef &&
        notificationRef.current &&
        scroll.scrollTo(notificationRef.current.offsetTop + TOP_OFFSET, {
          duration: SCROLL_DURATION,
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

  const debouncedHandleChange = debounce(handleChange, DEBOUNCE_TIMEOUT);

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
      (currentCartItem && !currentCartItem.costNativeFio);

    const showPrice = ({ isDomainPrice = null } = {}) => {
      const {
        nativeFio: {
          address: nativeFioAddressPrice,
          domain: nativeFioDomainPrice,
        },
        fio: { address: fioAddressPrice },
        usdt: { address: usdcAddressPrice },
      } = prices;

      let costNativeFio;
      let costFio;
      let costUsdc;

      if (!isFree && !isDomain) {
        costNativeFio = nativeFioAddressPrice;
        costFio = fioAddressPrice.toFixed(2);
        costUsdc = usdcAddressPrice;
      }
      if (hasCustomDomain) {
        costNativeFio =
          costNativeFio != null
            ? new MathOp(costNativeFio).add(nativeFioDomainPrice).toNumber()
            : nativeFioDomainPrice;
        const fioPrices = convertFioPrices(costNativeFio, roe);
        costFio = fioPrices.fio;
        costUsdc = fioPrices.usdc;
      }

      const price = isFree ? 'FREE' : `${costFio} FIO (${costUsdc} USDC)`;

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
