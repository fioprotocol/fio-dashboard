import { FormRenderProps } from 'react-final-form';

import {
  PublicAddressDoublet,
  FioAddressWithPubAddresses,
  LinkActionResult,
} from '../../types';

export type AddTokenProps = {
  fioCryptoHandle: FioAddressWithPubAddresses;
};

export type FormValues = {
  tokens: PublicAddressDoublet[];
};

export type AddTokenFormProps = {
  results: LinkActionResult | null;
  bundleCost: number;
  changeBundleCost: (bundleCost: number) => void;
  onBack: () => void;
  onRetry: (results: LinkActionResult) => void;
  formProps: FormRenderProps<FormValues>;
} & AddTokenProps;

export type ArrayErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
}[];
