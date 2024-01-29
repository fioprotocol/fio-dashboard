import { FormRenderProps } from 'react-final-form';

import {
  AnyObject,
  PublicAddressDoublet,
  FioAddressWithPubAddresses,
  LinkActionResult,
  FioWalletDoublet,
  WalletKeys,
} from '../../types';

export type SubmitDataProps = FormValues | PublicAddressDoublet[] | null;

export type AddTokenDefaultProps = {
  bundleCost: number;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallets: FioWalletDoublet[];
  results: LinkActionResult;
  changeBundleCost: (bundle: number) => void;
  onBack: (formProps: FormRenderProps<FormValues>) => void;
  onRetry: (resultsData: LinkActionResult) => void;
};

export type AddTokenContextProps = {
  edgeWalletId: string;
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: SubmitDataProps;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
  onSuccess: () => void;
  setSubmitData: (submitData: SubmitDataProps | null) => void;
  setProcessing: (processing: boolean) => void;
  setResultsData: (result: LinkActionResult) => void;
  submit: (params: { keys: WalletKeys; data: FormValues }) => Promise<void>;
  validate: (values: FormValues) => AnyObject | Promise<AnyObject>;
  validateToken: (
    token: PublicAddressDoublet,
    values: FormValues,
  ) => AnyObject | Promise<AnyObject>;
  publicAddresses: PublicAddressDoublet[];
} & AddTokenDefaultProps;

export type FormValues = {
  tokens: PublicAddressDoublet[];
};

export type AddTokenFormProps = {
  formProps: FormRenderProps<FormValues>;
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
