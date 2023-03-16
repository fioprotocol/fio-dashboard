import React, { Dispatch, SetStateAction, MouseEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FioNameItemProps,
  FioWalletDoublet,
  FioNameType,
  FeePrice,
  CartItem,
} from '../../types';

export type HasMore = { [key: string]: number };
type GetWalletAddresses = (
  publicKey: string,
  limit: number,
  offset: number,
) => void;

export interface ContainerProps extends RouteComponentProps {
  children?: React.ReactNode;
  fioNameList: FioNameItemProps[];
  fioWallets: FioWalletDoublet[];
  hasMore: HasMore;
  noProfileLoaded?: boolean;
  loading: boolean;
  pageName: FioNameType;
  getWalletAddresses: GetWalletAddresses;
  showExpired?: boolean;
  showBundles?: boolean;
  showStatus?: boolean;
  showFioAddressName?: boolean;
  cartItems: CartItem[];
  addItemToCart: (data: CartItem) => void;
  addBundlesFeePrice?: FeePrice;
  renewDomainFeePrice?: FeePrice;
  getAddBundlesFee: () => void;
  getRenewDomainFee: () => void;
}

export type BoolStateFunc = Dispatch<SetStateAction<boolean>>;

export type IsExpiredFunc = (expiration: Date) => boolean;
type ModalOpenActionType = (
  data: FioNameItemProps,
) => MouseEventHandler<HTMLDivElement> | void;

export type DefaultProps = {
  fioNameList: FioNameItemProps[];
  isDesktop: boolean;
  pageName: FioNameType;
  showInfoBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  toggleShowWarnBadge: BoolStateFunc;
  isDomainExpired: IsExpiredFunc;
  onItemModalOpen?: ModalOpenActionType;
  onSettingsOpen?: ModalOpenActionType;
  showFioAddressName?: boolean;
  onAddBundles?: (name: string) => void;
  onRenewDomain?: (name: string) => void;
};

export type NotificationsProps = {
  pageName: FioNameType;
  showInfoBadge: boolean;
  showWarnBadge: boolean;
  toggleShowInfoBadge: BoolStateFunc;
  toggleShowWarnBadge: BoolStateFunc;
};

export type ItemComponentProps = {
  fioNameItem: FioNameItemProps;
  isDomainExpired: IsExpiredFunc;
  isDesktop: boolean;
  onSettingsOpen: ModalOpenActionType;
  showExpired?: boolean;
  showStatus?: boolean;
  showBundles?: boolean;
  onAddBundles?: (name: string) => void;
  onRenewDomain?: (name: string) => void;
};

export type SettingsProps = {
  fioNameItem: FioNameItemProps;
  pageName: FioNameType;
  fioWallets: FioWalletDoublet[];
  showStatus?: boolean;
};

export type ActionButtonProps = {
  pageName: FioNameType;
  isDesktop: boolean;
  onSettingsOpen?: ModalOpenActionType;
  fioNameItem: FioNameItemProps;
  onRenewDomain?: (domain: string) => void;
};
