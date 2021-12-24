import { PublicAddressDoublet, FioNameItemProps } from '../../types';

export type AddTokenProps = {
  currentFioAddress: FioNameItemProps;
  results: any;
  loading: boolean;
};

export type FormValues = {
  tokens: PublicAddressDoublet[];
};

export type ArrayErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
}[];
