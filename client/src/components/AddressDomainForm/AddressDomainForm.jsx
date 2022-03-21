import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-final-form';
import * as Scroll from 'react-scroll';
import debounce from 'lodash/debounce';

import FormItems from './FormItems';

import { setDataMutator } from '../../utils';
import { useCheckIfDesktop } from '../../screenType';

import { ADDRESS, DOMAIN } from '../../constants/common';

import { addressValidation, domainValidation } from './validation';

const TOP_OFFSET = 35;
const SCROLL_DURATION = 600;
const DEBOUNCE_TIMEOUT = 500;

const AddressDomainForm = props => {
  const {
    domains = [],
    isHomepage,
    type,
    getDomains,
    cartItems = [],
    recalculate,
    hasFreeAddress,
    initialValues,
    prices,
    roe,
    allowCustomDomains,
    links,
  } = props;

  const isAddress = type === ADDRESS;
  const isDomain = type === DOMAIN;

  const [showAvailable, toggleShowAvailable] = useState(false);
  const [formErrors, changeFormErrors] = useState({});
  const [isValidating, toggleValidating] = useState(false);

  const notificationRef = useRef(null);

  const options = [...domains.map(({ domain }) => domain)];

  const isDesktop = useCheckIfDesktop();

  useEffect(() => {
    getDomains();
  }, []);

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
    if (isHomepage) return;

    const validationPropsToPass = {
      formProps,
      ...validationProps,
    };
    if (isAddress) addressValidation(validationPropsToPass);
    if (isDomain) domainValidation(validationPropsToPass);
  };

  const debouncedHandleChange = debounce(handleChange, DEBOUNCE_TIMEOUT);

  return (
    <Form
      onSubmit={handleSubmit}
      mutators={{ setDataMutator }}
      initialValues={initialValues}
      render={formProps => (
        <FormItems
          debouncedHandleChange={debouncedHandleChange}
          hasFreeAddress={hasFreeAddress}
          showAvailable={showAvailable}
          formErrors={formErrors}
          isValidating={isValidating}
          isDesktop={isDesktop}
          handleChange={handleChange}
          ref={notificationRef}
          prices={prices}
          type={type}
          cartItems={cartItems}
          formProps={formProps}
          domains={domains}
          isHomepage={isHomepage}
          isAddress={isAddress}
          isDomain={isDomain}
          options={options}
          toggleShowAvailable={toggleShowAvailable}
          roe={roe}
          allowCustomDomains={allowCustomDomains}
          links={links}
        />
      )}
    />
  );
};

export default AddressDomainForm;
