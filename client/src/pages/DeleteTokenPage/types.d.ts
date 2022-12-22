import {
  FioAddressWithPubAddresses,
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
} from '../../types';

export type DeleteTokenValues = {
  pubAddressesArr: CheckedTokenType[];
  fioCryptoHandle: FioAddressWithPubAddresses;
  allChecked: boolean;
};

export type CheckedTokenType = {
  isChecked: boolean;
  id: string;
} & PublicAddressDoublet;

export type DeleteTokenContextProps = {
  allChecked: boolean;
  allowDisconnectAll: boolean;
  bundleCost: number;
  checkedPubAddresses: CheckedTokenType[];
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallet: FioWalletDoublet;
  fioWallets: FioWalletDoublet[];
  hasChecked: boolean;
  hasLowBalance: boolean;
  isDisabled: boolean;
  loading: boolean;
  processing: boolean;
  pubAddressesArr: CheckedTokenType[];
  resultsData: LinkActionResult;
  submitData: DeleteTokenValues | null;
  allCheckedChange: (isChecked: boolean) => void;
  setProcessing: (processing: boolean) => void;
  changeBundleCost: (bundles: number) => void;
  onActionClick: () => void;
  onBack: () => void;
  onCancel: () => void;
  onCheckClick: (checkedId: string) => void;
  onRetry: () => void;
  setSubmitData: (submitData: DeleteTokenValues | null) => void;
  setResultsData: (submitData: LinkActionResult) => void;
  onSuccess: (result: LinkActionResult) => void;
};
