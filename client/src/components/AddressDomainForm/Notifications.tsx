import React from 'react';
import isEmpty from 'lodash/isEmpty';

import NotificationInfoBadge from './NotificationInfoBadge';
import NotificationActionBadge from './NotificationActionBadge';

import { FormValuesProps, NotificationProps } from './types';

const Notifications = (
  props: NotificationProps,
  innerRef?: React.Ref<HTMLDivElement>,
) => {
  const {
    cartItems,
    currentCartItem,
    domains,
    formErrors,
    formProps,
    isAddress,
    isDomain,
    isFree,
    hasCustomDomain,
    prices,
    showAvailable,
    hasCurrentDomain,
    type,
    isDesktop,
    roe,
  } = props;

  const { values, form } = formProps;
  const errors: (string | { message: string; showInfoError?: boolean })[] = [];
  !isEmpty(formErrors) &&
    Object.keys(formErrors).forEach((key: string) => {
      const fieldState = form.getFieldState(key as keyof FormValuesProps);
      const { touched, modified, submitSucceeded } = fieldState || {};
      if (touched || modified || submitSucceeded) {
        errors.push(formErrors[key]);
      }
    });

  const hasErrors = !isEmpty(errors);

  return (
    <div key="badges">
      <NotificationInfoBadge
        showAvailable={showAvailable}
        isDesktop={isDesktop}
        errors={errors}
        isFree={isFree}
        isDomain={isDomain}
        hasCustomDomain={hasCustomDomain}
        hasCurrentDomain={hasCurrentDomain}
        roe={roe}
        prices={prices}
        type={type}
        ref={innerRef}
        hasErrors={hasErrors}
      />
      <NotificationActionBadge
        values={values}
        roe={roe}
        cartItems={cartItems}
        currentCartItem={currentCartItem}
        domains={domains}
        isAddress={isAddress}
        hasErrors={hasErrors}
        showAvailable={showAvailable}
        isDomain={isDomain}
        isFree={isFree}
        hasCustomDomain={hasCustomDomain}
        prices={prices}
      />
    </div>
  );
};

const NotificationsRef = React.forwardRef<HTMLDivElement, NotificationProps>(
  Notifications,
);

export default NotificationsRef;
