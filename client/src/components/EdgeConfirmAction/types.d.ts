import { EdgeAccount } from 'edge-core-js';

import {
  AnyObject,
  AnyType,
  EdgeWalletsKeys,
  PinConfirmation,
  WalletKeys,
} from '../../types';
import { PinDataType } from '../../redux/modal/types';

export type SubmitActionParams = {
  edgeAccount?: EdgeAccount;
  keys?: WalletKeys | null;
  data?: AnyObject;
};

export type Props = {
  action: string;
  confirmingPin: boolean;
  pinModalIsOpen: boolean;
  edgeAccountLogoutBefore: boolean;
  data: AnyType | null;
  processing: boolean;
  pinConfirmation: PinConfirmation;
  confirmPinKeys?: EdgeWalletsKeys | null;
  hideProcessing?: boolean;
  fioWalletEdgeId?: string;
  processingProps?: { title?: string; message?: string };

  showPinModal: (action: string, data: PinDataType) => void;
  showGenericErrorModal: (message?: string) => void;
  submitAction: (params: SubmitActionParams) => Promise<AnyType>;
  onSuccess: (data: AnyType) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  resetPinConfirm: () => void;
  setConfirmPinKeys: (keys: null) => void;
  fioActionExecuted: (data: { executeActionType: string } & AnyType) => void;
};
