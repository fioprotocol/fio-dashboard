import React from 'react';
import { FormApi } from 'final-form';
import { FormRenderProps } from 'react-final-form';

import {
  CartItem,
  Domain,
  DeleteCartItem,
  Prices,
  FioNameType,
  FioWalletDoublet,
} from '../../types';

type Error =
  | {
      message: string;
      showInfoError?: boolean;
    }
  | string;

type FormError = {
  [key: string]: Error;
};

type DefaultProps = {
  roe: number;
  prices: Prices;
  isFree: boolean;
  isDomain: boolean;
};

export type FormValuesProps = {
  address: string;
  domain: string;
};

export type FormValidationErrorProps = {
  address?: string;
  domain?: string | { message?: string; showInfoError: boolean };
};

export type DefaultValidationProps = {
  formProps: FormApi;
  cartItems: CartItem[];
  options: string[];
  isAddress: boolean;
  toggleShowAvailable: (isAvailable: boolean) => void;
  changeFormErrors: (errors: FormValidationErrorProps) => void;
  toggleValidating: (isValidating: boolean) => void;
};

export type DomainValidationProps = {
  cartItems: CartItem[];
  options: string[];
} & DefaultValidationProps;

export type VerifyAddressProps = {
  isAddress: boolean;
  options: string[];
  toggleValidating: (isValidating: boolean) => void;
} & DefaultValidationProps;

type DefaultFormContainerProps = {
  formProps: FormRenderProps;
  type: FioNameType;
  isAddress: boolean;
  hasFreeAddress: boolean;
  isHomepage: boolean;
  domains: Domain[];
  isDesktop: boolean;
  links: {
    getCryptoHandle: string | React.ReactNode;
  };
  options: string[];
  allowCustomDomains: boolean;
  isValidating: boolean;
  roe: number;
  prices: Prices;
  isDomain: boolean;
  toggleShowAvailable: (isAvailable: boolean) => void;
  handleChange: (formProps: FormApi) => void;
  debouncedHandleChange: (formProps: FormApi) => void;
};

export type AddressDomainFormProps = {
  domains: Domain[];
  isHomepage: boolean;
  type: FioNameType;
  fioWallets: FioWalletDoublet[];
  getDomains: () => void;
  cartItems: CartItem[];
  recalculate: () => void;
  hasFreeAddress: boolean;
  initialValues: FormValuesProps;
  prices: Prices;
  roe: number;
  allowCustomDomains: boolean;
  links: {
    getCryptoHandle: string | React.ReactNode;
  };
  refreshFioNames: (publicKey: string) => void;
};

export type FormItemsProps = {
  cartItems: CartItem[];
  showAvailable: boolean;
  formErrors: FormError;
} & DefaultFormContainerProps;

export type FormContainerProps = {
  hasCustomDomain: boolean;
  showCustomDomain: boolean;
  domain: Domain;
  isFree: boolean;
  toggleShowCustomDomain: (showCustomDomain: boolean) => void;
} & DefaultFormContainerProps;

export type PriceComponent = {
  isDomainPrice?: null | boolean;
  hasCurrentDomain: boolean;
  hasCustomDomain: boolean;
} & DefaultProps;

export type NotificationProps = {
  cartItems: CartItem[];
  currentCartItem: CartItem | undefined;
  domains: Domain[];
  formErrors: FormError;
  formProps: FormRenderProps;
  isAddress: boolean;
  type: FioNameType;
  hasCurrentDomain: boolean;
  isDesktop: boolean;
  showAvailable: boolean;
  hasCustomDomain: boolean;
} & DefaultProps;

export type NotificationActionProps = {
  cartItems: CartItem[];
  domains: Domain[];
  isAddress: boolean;
  currentCartItem: CartItem;
  values: FormValuesProps;
  showAvailable: boolean;
  hasErrors: boolean;
  hasCustomDomain: boolean;
  addItem: (data: CartItem) => void;
  deleteItem: (data: DeleteCartItem) => {};
  recalculate: (cartItems: CartItem[]) => {};
} & DefaultProps;

export type NotificationInfoProps = {
  isDesktop: boolean;
  errors: Error[];
  hasCurrentDomain: boolean;
  type: FioNameType;
  showAvailable: boolean;
  hasErrors: boolean;
  hasCustomDomain: boolean;
} & DefaultProps;

export type DefaultFormProps = {
  isValidating: boolean;
  debouncedOnChangeHandleField: (formProps: FormApi) => void;
};

export type AddressFormProps = {
  hasCustomDomain: boolean;
  showCustomDomain: boolean;
  options: string[];
  domain: Domain;
  allowCustomDomains: boolean;
  toggleShowCustomDomain: (showCustomDomain: boolean) => void;
  onChangeHandleField: () => void;
} & DefaultFormProps;

export type PriceBadgeProps = {
  tooltip: string | React.RactNode;
  hasFreeAddress: boolean;
  domains: Domain[];
  hasCustomDomain: boolean;
} & DefaultProps;
