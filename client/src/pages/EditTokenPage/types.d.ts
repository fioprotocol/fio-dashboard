import {
  LinkActionResult,
  FioAddressWithPubAddresses,
  FioWalletDoublet,
} from '../../types';

export type EditTokenValues = {
  pubAddressesArr: EditTokenElement[];
  fioAddressName: string;
};

export type EditTokenElement = {
  chainCode: string;
  tokenCode: string;
  isEditing: boolean;
  id: string;
  publicAddress: string;
  newPublicAddress: string;
};

export type EditTokenContextProps = {
  bundleCost: number;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallet: FioWalletDoublet;
  fioWallets: FioWalletDoublet[];
  hasLowBalance: boolean;
  isDisabled: boolean;
  processing: boolean;
  pubAddressesArr: EditTokenElement[];
  resultsData: LinkActionResult;
  submitData: EditTokenValues | null;
  changeBundleCost: (bundles: number) => void;
  handleEditTokenItem: (editedId: string, editedPubAddress: string) => void;
  onActionClick: () => void;
  onBack: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onSuccess: (result: LinkActionResult) => void;
  setProcessing: (processing: boolean) => void;
  setResultsData: (result: LinkActionResult) => void;
  setSubmitData: (submitData: EditTokenValues | null) => void;
};
