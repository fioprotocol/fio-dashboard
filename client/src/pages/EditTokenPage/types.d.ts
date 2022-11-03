import {
  LinkActionResult,
  WalletKeys,
  FioAddressWithPubAddresses,
  FioWalletDoublet,
} from '../../types';

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
  edgeWalletId: string;
  fioCryptoHandleObj: FioAddressWithPubAddresses;
  fioWallet: FioWalletDoublet;
  fioWallets: FioWalletDoublet[];
  hasLowBalance: boolean;
  isDisabled: boolean;
  processing: boolean;
  pubAddressesArr: EditTokenElement[];
  resultsData: LinkActionResult;
  submitData: boolean | null;
  changeBundleCost: (bundles: number) => void;
  handleEditTokenItem: (editedId: string, editedPubAddress: string) => void;
  onActionClick: () => void;
  onBack: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onSuccess: () => void;
  setProcessing: (processing: boolean) => void;
  submit: ({ keys }: { keys: WalletKeys }) => Promise<void>;
};
