import { FormRenderProps } from 'react-final-form';

import {
  AnyObject,
  PublicAddressDoublet,
  FioAddressWithPubAddresses,
  LinkActionResult,
  FioWalletDoublet,
} from '../../types';

export type SubmitDataProps = AddTokenValues | PublicAddressDoublet[] | null;

export type AddTokenDefaultProps = {
  bundleCost: number;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallets: FioWalletDoublet[];
  results: LinkActionResult;
  changeBundleCost: (bundle: number) => void;
  onBack: (formProps: FormRenderProps<AddTokenValues>) => void;
  onRetry: (resultsData: LinkActionResult) => void;
};

export type AddTokenContextProps = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: SubmitDataProps;
  onCancel: () => void;
  onSubmit: (values: AddTokenValues) => void;
  onSuccess: (result: LinkActionResult) => void;
  setProcessing: (processing: boolean) => void;
  validate: (values: AddTokenValues) => AnyObject | Promise<AnyObject>;
  validateToken: (
    token: PublicAddressDoublet,
    values: AddTokenValues,
  ) => AnyObject | Promise<AnyObject>;
  publicAddresses: PublicAddressDoublet[];
} & AddTokenDefaultProps;

export type AddTokenValues = {
  name?: string;
  tokens: PublicAddressDoublet[];
};

export type AddTokenFormProps = {
  formProps: FormRenderProps<AddTokenValues>;
  validateToken: (
    values: PublicAddressDoublet,
  ) => AnyObject | Promise<AnyObject>;
  publicAddresses: PublicAddressDoublet[];
} & AddTokenDefaultProps;

export type ArrayErrorsProps = {
  chainCode?: string;
  tokenCode?: string;
  publicAddress?: string;
}[];
