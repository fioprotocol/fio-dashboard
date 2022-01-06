import { PublicAddressDoublet, FioAddressWithPubAddresses } from '../../types';

export type AddTokenProps = {
  currentFioAddress: FioAddressWithPubAddresses;
};

export type FormValues = {
  tokens: PublicAddressDoublet[];
};

export type ArrayErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
}[];
