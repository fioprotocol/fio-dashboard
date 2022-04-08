import React from 'react';
import { isAndroid } from 'react-device-detect';

import FormHeader from '../FormHeader/FormHeader';
import ModalComponent from '../Modal/Modal';
import PinForm from '../PinForm';

import { PIN_LENGTH } from '../../constants/form';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import { PinConfirmModalProps } from './types';

import classes from './PinConfirmModal.module.scss';

const TITLES = {
  [CONFIRM_PIN_ACTIONS.TRANSFER]: 'Transfer',
  [CONFIRM_PIN_ACTIONS.PURCHASE]: 'Purchase',
};

const PinConfirmModal: React.FC<PinConfirmModalProps> = props => {
  const {
    showPinConfirm,
    edgeContextSet,
    onSubmit,
    confirmingPin,
    onClose,
    username,
    pinConfirmation,
    resetPinConfirm,
    pinConfirmData,
  } = props;
  if (!showPinConfirm || !edgeContextSet) return null;

  const handleSubmit = (pin: string) => {
    if (confirmingPin) return;
    if (pin && pin.length !== PIN_LENGTH) return;
    onSubmit(
      {
        username,
        pin,
      },
      pinConfirmData,
    );
  };

  const handleClose = () => {
    if (confirmingPin) return;
    resetPinConfirm();
    onClose();
  };

  const onReset = () => {
    if (!pinConfirmation.error) return;
    resetPinConfirm();
  };

  const { error } = pinConfirmation;

  return (
    <ModalComponent
      show={showPinConfirm}
      backdrop="static"
      onClose={handleClose}
      closeButton
      withoutPaggingBottom={isAndroid}
    >
      <div className={classes.form}>
        <FormHeader
          title={`Confirm ${TITLES[pinConfirmData.action] || 'to continue'}`}
          isDoubleColor
          subtitle="Enter your 6 digit PIN to confirm this transaction"
          isSubNarrow
        />
        <PinForm
          onSubmit={handleSubmit}
          onReset={onReset}
          loading={confirmingPin}
          error={error}
          blockedTime={(error && typeof error !== 'string' && error.wait) || 0}
        />
      </div>
    </ModalComponent>
  );
};

export default PinConfirmModal;
