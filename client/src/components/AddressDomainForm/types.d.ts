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
  period: string;
};

export type FormValidationErrorProps = {
  address?: string;
  domain?: string | { message?: string; showInfoError: boolean };
};

export type DefaultValidationProps = {
  formProps: FormApi<FormValuesProps, FormValuesProps>;
  cartItems: CartItem[];
  options: string[];
  isAddress: boolean;
  toggleShowAvailable: (isAvailable: boolean) => void;
  changeFormErrors: (errors: FormValidationErrorProps) => void;
  toggleValidating: (isValidating: boolean) => void;
};

type DefaultFormContainerProps = {
  formProps: FormRenderProps<FormValuesProps, FormValuesProps>;
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
  isValidating: boolean;
  roe: number;
  prices: Prices;
  isDomain: boolean;
  toggleShowAvailable: (isAvailable: boolean) => void;
  handleChange: (formProps: FormApi<FormValuesProps, FormValuesProps>) => void;
  debouncedHandleChange: (
    formProps: FormApi<FormValuesProps, FormValuesProps>,
  ) => void;
  isReverseColors?: boolean;
  isDarkWhite?: boolean;
};

export type AddressDomainFormProps = {
  domains: Domain[];
  isHomepage: boolean;
  type: FioNameType;
  fioWallets: FioWalletDoublet[];
  getDomains: () => void;
  cartItems: CartItem[];
  setCartItems: () => void;
  hasFreeAddress: boolean;
  initialValues: FormValuesProps;
  pricesLoading: boolean;
  prices: Prices;
  roe: number;
  links: {
    getCryptoHandle: string | React.ReactNode;
  };
  refreshFioNames: (publicKey: string) => void;
  isReverseColors?: boolean;
  isDarkWhite?: boolean;
};

export type FormItemsProps = {
  isLoading: boolean;
  cartItems: CartItem[];
  showAvailable: boolean;
  formErrors: FormError;
} & DefaultFormContainerProps;

export type FormContainerProps = {
  hasCustomDomain: boolean;
  showCustomDomain: boolean;
  domain: string;
  isFree: boolean;
  toggleShowCustomDomain: (showCustomDomain: boolean) => void;
} & DefaultFormContainerProps;

export type NotificationProps = {
  isLoading: boolean;
  cartItems: CartItem[];
  currentCartItem: CartItem | undefined;
  domains: Domain[];
  formErrors: FormError;
  formProps: FormRenderProps<FormValuesProps, FormValuesProps>;
  isAddress: boolean;
  type: FioNameType;
  hasCurrentDomain: boolean;
  isDesktop: boolean;
  showAvailable: boolean;
  hasCustomDomain: boolean;
} & DefaultProps;

export type NotificationActionProps = {
  isLoading: boolean;
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
  setCartItems: (cartItems: CartItem[]) => {};
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
  domain: string;
  toggleShowCustomDomain: (showCustomDomain: boolean) => void;
  onChangeHandleField: () => void;
} & DefaultFormProps;

export type PriceBadgeProps = {
  tooltip: string | React.RactNode;
  hasFreeAddress: boolean;
  domains: Domain[];
  hasCustomDomain: boolean;
} & DefaultProps;
