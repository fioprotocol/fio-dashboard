import { FioNamePublicAddress } from '../../types';

export type CommonTypes = {
  isConfirm?: boolean;
};

export type NameType = {
  name: string;
};

export type TokenItemType = {
  onClick: () => void;
} & FioNamePublicAddress;

export type PublicAddressSubItemType = {
  title: string;
  tokenItem: string;
};

export type BundledTransactionType = {
  bundles: number;
  remaining: number;
};

export type CheckedPublicAddressType = {
  isChecked: boolean;
  id: string;
} & FioNamePublicAddress;
