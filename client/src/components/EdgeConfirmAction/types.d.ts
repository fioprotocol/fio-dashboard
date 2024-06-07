import { EdgeAccount } from 'edge-core-js';

import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import {
  AnyObject,
  AnyType,
  EdgeWalletsKeys,
  PinConfirmation,
  WalletKeys,
  FioActionExecuted,
} from '../../types';
import { PinDataType } from '../../redux/modal/types';

export type SubmitActionParams<T = AnyObject> = {
  edgeAccount?: EdgeAccount;
  keys?: WalletKeys | null;
  allWalletKeysInAccount?: EdgeWalletsKeys | null;
  data?: T;
};

type Action = typeof CONFIRM_PIN_ACTIONS;

export type Props = {
  action: keyof Action;
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
  showGenericErrorModal: (
    message?: string,
    title?: string,
    buttonText?: string,
  ) => void;
  submitAction: (params: SubmitActionParams) => Promise<AnyType>;
  onSuccess: (data: AnyType) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  resetPinConfirm: () => void;
  setConfirmPinKeys: (keys: null) => void;
  fioActionExecuted: (data: FioActionExecuted) => void;
};
