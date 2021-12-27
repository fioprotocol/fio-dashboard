import { PublicAddressDoublet, FioNameItemProps } from '../../types';

export type AddTokenProps = {
  currentFioAddress: FioNameItemProps;
  results: any;
  loading: boolean;
  remaining: number;
};

export type FormValues = {
  tokens: PublicAddressDoublet[];
};

export type ArrayErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
}[];
