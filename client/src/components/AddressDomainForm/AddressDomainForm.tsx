import React, { useState, useEffect, useRef } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import * as Scroll from 'react-scroll';
import debounce from 'lodash/debounce';

import FormItems from './FormItems';

import { setDataMutator } from '../../utils';
import { useCheckIfDesktop } from '../../screenType';

import { ADDRESS, DOMAIN } from '../../constants/common';

import { addressValidation, domainValidation } from './validation';

import { AddressDomainFormProps, FormValuesProps } from './types';

const TOP_OFFSET = 35;
const SCROLL_DURATION = 600;
const DEBOUNCE_TIMEOUT = 500;

const AddressDomainForm: React.FC<AddressDomainFormProps> = props => {
  const {
    domains = [],
    isHomepage,
    type,
    cartItems = [],
    hasFreeAddress,
    initialValues,
    pricesLoading,
    prices,
    roe,
    links,
    fioWallets,
    getDomains,
    setCartItems,
    refreshFioNames,
    isReverseColors,
    isDarkWhite,
  } = props;

  const isAddress = type === ADDRESS;
  const isDomain = type === DOMAIN;

  const [showAvailable, toggleShowAvailable] = useState(false);
  const [formErrors, changeFormErrors] = useState({});
  const [isValidating, toggleValidating] = useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  const options = [...domains.map(({ domain }) => domain)];

  const isDesktop = useCheckIfDesktop();

  useEffect(() => {
    getDomains();
  }, [getDomains]);

  useEffect(() => {
    for (const fioWallet of fioWallets) {
      refreshFioNames(fioWallet.publicKey);
    }
  }, [fioWallets, refreshFioNames]);

  const validationProps = {
    options,
    isAddress,
    cartItems,
    setCartItems,
    toggleShowAvailable,
    changeFormErrors,
    toggleValidating,
  };

  const handleSubmit = (
    values: FormValuesProps,
    form: FormApi<FormValuesProps, FormValuesProps>,
  ) => {
    if (isHomepage) return;

    const registeredFields = form.getRegisteredFields();

    const fieldsState = registeredFields.map((registeredField: string) =>
      form.getFieldState(registeredField as keyof FormValuesProps),
    );

    const isEmptyForm = fieldsState.every(fieldState => !fieldState?.value);

    if (isEmptyForm) return;

    const validationPropsToPass = {
      formProps: form,
      ...validationProps,
    };

    if (isAddress) addressValidation(validationPropsToPass);
    if (isDomain) domainValidation(validationPropsToPass);

    const isValidForm = fieldsState.every(
      fieldState => !fieldState?.data?.error,
    );

    if (!isDesktop && isValidForm) {
      const scroll = Scroll.animateScroll;
      notificationRef &&
        notificationRef.current &&
        scroll.scrollTo(notificationRef.current.offsetTop + TOP_OFFSET, {
          duration: SCROLL_DURATION,
        });
    }
  };

  const handleChange = (formApi: FormApi<FormValuesProps, FormValuesProps>) => {
    if (isHomepage) return;

    const validationPropsToPass = {
      formProps: formApi,
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
      initialValues={{
        ...initialValues,
        period: '1',
      }}
      render={(
        formProps: FormRenderProps<FormValuesProps, FormValuesProps>,
      ) => (
        <FormItems
          debouncedHandleChange={debouncedHandleChange}
          hasFreeAddress={hasFreeAddress}
          showAvailable={showAvailable}
          formErrors={formErrors}
          isValidating={isValidating}
          isDesktop={isDesktop}
          handleChange={handleChange}
          ref={notificationRef}
          isLoading={pricesLoading}
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
          links={links}
          isReverseColors={isReverseColors}
          isDarkWhite={isDarkWhite}
        />
      )}
    />
  );
};

export default AddressDomainForm;
