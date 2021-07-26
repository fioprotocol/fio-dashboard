import React from 'react';
import FormHeader from '../FormHeader/FormHeader';

import ModalComponent from '../Modal/Modal';
import { PIN_LENGTH } from '../../constants/form';

import PinForm from '../PinForm';
import classes from './PinConfirmModal.module.scss';

const PinConfirmModal = props => {
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

  const handleSubmit = pin => {
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

  return (
    <ModalComponent
      show={showPinConfirm}
      backdrop="static"
      onClose={handleClose}
      closeButton
    >
      <div className={classes.form}>
        <FormHeader
          title="Confirm Purchase"
          isDoubleColor
          subtitle="Enter your 6 digit PIN to confirm this transaction"
          isSubNarrow
        />
        <PinForm
          onSubmit={handleSubmit}
          onReset={resetPinConfirm}
          loading={confirmingPin}
          error={pinConfirmation.error}
        />
      </div>
    </ModalComponent>
  );
};

export default PinConfirmModal;
