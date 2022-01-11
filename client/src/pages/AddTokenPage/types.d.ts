import { FormRenderProps } from 'react-final-form';

import {
  PublicAddressDoublet,
  FioCryptoHandleWithPubAddresses,
} from '../../types';

export type AddTokenProps = {
  fioCryptoHandle: FioCryptoHandleWithPubAddresses;
};

export type FormValues = {
  tokens: PublicAddressDoublet[];
};

export type AddTokenFormProps = {
  results: LinkActionResult;
  bundleCost: number;
  changeBundleCost: (bundleCost: number) => void;
  onBack: () => void;
  onRetry: () => void;
  formProps: FormRenderProps<FormValues>;
} & AddTokenProps;

export type ArrayErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
}[];
