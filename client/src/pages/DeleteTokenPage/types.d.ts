import {
  FioAddressWithPubAddresses,
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../types';

export type CheckedTokenType = {
  isChecked: boolean;
  id: string;
} & PublicAddressDoublet;

export type DeleteTokenContextProps = {
  allChecked: boolean;
  allowDisconnectAll: boolean;
  bundleCost: number;
  checkedPubAddresses: CheckedTokenType[];
  edgeWalletId: string;
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
  submitData: boolean;
  allCheckedChange: (isChecked: boolean) => void;
  setProcessing: (processing: boolean) => void;
  changeBundleCost: (bundles: number) => void;
  onActionClick: () => void;
  onBack: () => void;
  onCancel: () => void;
  onCheckClick: (checkedId: string) => void;
  onRetry: () => void;
  onSuccess: () => void;
  setSubmitData: (submitData: boolean | null) => void;
  setResultsData: (submitData: LinkActionResult) => void;
  submit: ({ keys }: { keys: WalletKeys }) => Promise<void>;
};
