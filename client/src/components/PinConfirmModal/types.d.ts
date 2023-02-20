import { PinConfirmDataTypes, PinConfirmation } from '../../types';

export type PinConfirmModalProps = {
  showPinConfirm: boolean;
  edgeContextSet: boolean;
  isPinEnabled: boolean;
  onPinSubmit: (
    submitData: { username: string; pin?: string; password?: string },
    pinConfirmData: PinConfirmDataTypes,
  ) => void;
  confirmingPin: boolean;
  onClose: () => void;
  username: string;
  pinConfirmation: PinConfirmation;
  resetPinConfirm: () => void;
  pinConfirmData: PinConfirmDataTypes;
};
