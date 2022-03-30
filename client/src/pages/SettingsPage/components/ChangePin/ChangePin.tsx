import React, { useState, useEffect } from 'react';
import { isAndroid } from 'react-device-detect';

import SecurityItem from '../SecurityItem';
import ModalUIComponent from '../ModalUIComponent';
import SuccessModal from '../../../../components/Modal/SuccessModal';
import ChangePinForm from './ChangePinForm';

import { ClickEventTypes } from './types';

const ITEM_PROPS = {
  title: 'PIN',
  subtitle: 'Your PIN is a 6 digit code used to do quick re-logins.',
  buttonText: 'Change PIN',
  modalTitle: 'Change PIN',
  modalSubtitle:
    'Enter a new 6 digit code used to do quick re-logins into your account.',
  successModalTitle: 'PIN CHANGED!',
  successModalSubtitle: 'Your PIN has been successfully changed',
};

const CONFIRM_MODAL_ITEM_PROPS = {
  modalTitle: 'Confirm PIN Change',
  modalSubtitle:
    'Enter your password to confirm the change and update to your new PIN.',
};

type Props = {
  results: { status?: number };
  changePin: (values: {
    pin: string;
    password: string;
    username: string;
  }) => void;
  loading: boolean;
  username: string;
  changePinError?: { type: string };
  clearChangePinResults: () => void;
  clearChangePinError: () => void;
};

const ChangePin: React.FC<Props> = props => {
  const {
    results,
    changePin,
    loading,
    username,
    changePinError,
    clearChangePinResults,
    clearChangePinError,
  } = props;

  const { status } = results;
  const error =
    (changePinError &&
      changePinError.type === 'PasswordError' &&
      'Invalid Password') ||
    undefined;

  const [showModal, toggleShowModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);
  const [isConfirmPage, changeConfirmPage] = useState(false);
  const [pin, handlePinChange] = useState<string>('');
  const [password, handlePasswordChange] = useState('');

  const onOpenModal = () => toggleShowModal(true);
  const onCloseModal = () => {
    handlePinChange('');
    handlePasswordChange('');
    changeConfirmPage(false);
    toggleShowModal(false);
  };

  const onSuccessClose = () => {
    toggleSuccessModal(false);
  };

  const handleSubmit = () => {
    changePin({ pin, password, username });
  };

  const onNextClick = (e: ClickEventTypes) => {
    e.target.blur();
    changeConfirmPage(true);
  };

  const onBack = () => {
    changeConfirmPage(false);
    clearChangePinError();
  };

  useEffect(() => {
    if (status) {
      onCloseModal();
      toggleSuccessModal(true);
    }
  }, [status]);

  const onUnmount = () => {
    clearChangePinError();
    clearChangePinResults();
  };

  return (
    <>
      <SecurityItem {...ITEM_PROPS} isSmall={true} onClick={onOpenModal} />
      <ModalUIComponent
        onClose={onCloseModal}
        showModal={showModal}
        hasOnBack={isConfirmPage}
        onBack={onBack}
        subtitle={
          isConfirmPage
            ? CONFIRM_MODAL_ITEM_PROPS.modalSubtitle
            : ITEM_PROPS.modalSubtitle
        }
        title={
          isConfirmPage
            ? CONFIRM_MODAL_ITEM_PROPS.modalTitle
            : ITEM_PROPS.modalTitle
        }
        withoutPaggingBottom={isAndroid}
      >
        <ChangePinForm
          handlePinChange={handlePinChange}
          handlePasswordChange={handlePasswordChange}
          pin={pin}
          password={password}
          onSubmit={handleSubmit}
          onNextClick={onNextClick}
          loading={loading}
          isConfirmPage={isConfirmPage}
          error={error}
          onUnmount={onUnmount}
        />
      </ModalUIComponent>
      <SuccessModal
        title={ITEM_PROPS.successModalTitle}
        subtitle={ITEM_PROPS.successModalSubtitle}
        onClose={onSuccessClose}
        showModal={showSuccessModal}
      />
    </>
  );
};

export default ChangePin;
