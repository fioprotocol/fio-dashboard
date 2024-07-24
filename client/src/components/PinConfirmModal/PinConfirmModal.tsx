import React from 'react';
import { isAndroid } from 'react-device-detect';

import FormHeader from '../FormHeader/FormHeader';
import ModalComponent from '../Modal/Modal';
import PinForm from '../PinForm';
import { PasswordForm } from './components/PasswordForm';

import { PIN_LENGTH } from '../../constants/form';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { ROUTES } from '../../constants/routes';

import { PinConfirmModalProps } from './types';

import classes from './PinConfirmModal.module.scss';

const TITLES = {
  [CONFIRM_PIN_ACTIONS.TRANSFER]: 'Transfer',
  [CONFIRM_PIN_ACTIONS.PURCHASE]: 'Purchase',
};

const SUBTITLES_CONFIRM_TYPE = {
  PASSWORD: 'password',
  PIN: '6 digit PIN',
};

const PinConfirmModal: React.FC<PinConfirmModalProps> = props => {
  const {
    showPinConfirm,
    edgeContextSet,
    isPinEnabled,
    onPinSubmit,
    confirmingPin,
    onClose,
    username,
    pathname,
    pinConfirmation,
    resetPinConfirm,
    pinConfirmData,
  } = props;
  if (!showPinConfirm || !edgeContextSet) return null;

  const handleSubmit = ({
    pin,
    password,
  }: {
    pin?: string;
    password?: string;
  }) => {
    if (confirmingPin) return;

    if (pin && pin.length !== PIN_LENGTH) return;
    onPinSubmit(
      {
        username,
        pin,
        password,
      },
      pinConfirmData,
    );
  };

  const handleClose = () => {
    if (pinConfirmData?.data?.onCancel) {
      pinConfirmData.data.onCancel();
    }

    if (confirmingPin) return;
    resetPinConfirm();
    onClose();
  };

  const onReset = () => {
    if (!pinConfirmation.error) return;
    resetPinConfirm();
  };

  const { error } = pinConfirmation;

  let subtitle = `Enter your ${
    isPinEnabled ? SUBTITLES_CONFIRM_TYPE.PIN : SUBTITLES_CONFIRM_TYPE.PASSWORD
  } to confirm this transaction`;

  if (pathname === ROUTES.CREATE_ACCOUNT_PIN) {
    subtitle = `Enter your password to finish PIN setup`;
  }

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
          subtitle={subtitle}
          isSubNarrow
        />
        {isPinEnabled ? (
          <PinForm
            onSubmit={handleSubmit}
            onReset={onReset}
            loading={confirmingPin}
            error={error}
            blockedTime={
              (error && typeof error !== 'string' && error.wait) || 0
            }
          />
        ) : (
          <PasswordForm
            error={error}
            loading={confirmingPin}
            onClose={handleClose}
            onReset={onReset}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </ModalComponent>
  );
};

export default PinConfirmModal;
