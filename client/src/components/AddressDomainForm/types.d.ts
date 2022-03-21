import { FormProps } from 'react-final-form';

import {
  CartItem,
  Domain,
  DeleteCartItem,
  Prices,
  FioNameType,
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

export type FormItemsProps = {
  formProps: FormProps;
  cartItems: CartItem[];
  options: string[];
  isAddress: boolean;
  isHomepage: boolean;
  domains: Domain[];
  hasFreeAddress: boolean;
  showAvailable: boolean;
  formErrors: FormError;
  isValidating: boolean;
  isDesktop: boolean;
  allowCustomDomains: boolean;
  links: {
    getCryptoHandle: string | React.ReactNode;
  };
  type: FioNameType;
  debouncedHandleChange: () => void;
  handleChange: (formProps: FormProps) => void;
  toggleShowAvailable: (isAvaliable: boolean) => void;
} & DefaultProps;

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
  formProps: FormProps;
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
  values: { address: string; domain: string };
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
