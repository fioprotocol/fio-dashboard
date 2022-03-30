import React, { useState } from 'react';

import FormContainer from './FormContainer';
import Notifications from './Notifications';

import { cartHasFreeItem, isFreeDomain } from '../../utils';

import { FormItemsProps } from './types';

const FormItems = (
  props: FormItemsProps,
  innerRef: React.Ref<HTMLDivElement>,
) => {
  const {
    formProps,
    cartItems,
    options,
    isDomain,
    isHomepage,
    domains,
    hasFreeAddress,
    showAvailable,
    debouncedHandleChange,
    handleChange,
    toggleShowAvailable,
  } = props;

  const [showCustomDomain, toggleShowCustomDomain] = useState(false);
  const { values } = formProps;
  const { address, domain } = values;

  const currentCartItem = cartItems.find(item => {
    if (!address) return item.domain === domain;
    return item.address === address && item.domain === domain;
  });

  const hasCustomDomain =
    (domain &&
      options.length > 0 &&
      options.every(option => option !== domain) &&
      cartItems.every(item => item.domain !== domain)) ||
    isDomain ||
    (currentCartItem != null && currentCartItem.hasCustomDomain);

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
    (!!currentCartItem && !currentCartItem.costNativeFio);

  return (
    <>
      <FormContainer
        {...props}
        options={options}
        hasCustomDomain={hasCustomDomain}
        showCustomDomain={showCustomDomain}
        toggleShowCustomDomain={toggleShowCustomDomain}
        domain={domain}
        key="form"
        handleChange={handleChange}
        debouncedHandleChange={debouncedHandleChange}
        toggleShowAvailable={toggleShowAvailable}
        isFree={isFree}
        hasFreeAddress={hasFreeAddress}
      />
      {!isHomepage && (
        <Notifications
          {...props}
          hasCustomDomain={hasCustomDomain}
          currentCartItem={currentCartItem}
          showAvailable={showAvailable}
          key="notifications"
          isFree={isFree}
          ref={innerRef}
          hasCurrentDomain={hasCurrentDomain}
        />
      )}
    </>
  );
};

const FormItemsRef = React.forwardRef<HTMLDivElement, FormItemsProps>(
  FormItems,
);

export default FormItemsRef;
