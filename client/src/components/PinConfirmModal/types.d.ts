import { PinConfirmDataTypes, PinConfirmation } from '../../types';

export type PinConfirmModalProps = {
  showPinConfirm: boolean;
  edgeContextSet: booelan;
  onSubmit: (
    submitData: { username: string; pin: string },
    pinConfirmData: PinConfirmDataTypes,
  ) => void;
  confirmingPin: boolean;
  onClose: () => void;
  username: string;
  pinConfirmation: PinConfirmation;
  resetPinConfirm: () => void;
  pinConfirmData: PinConfirmDataTypes;
};
