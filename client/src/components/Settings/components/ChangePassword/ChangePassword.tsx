import React, { useEffect, useState } from 'react';
import SecurityItem from '../SecurityItem/SecurityItem';
import ModalUIComponent from '../ModalUIComponent';
import SuccessModal from '../../../Modal/SuccessModal';
import ChangePasswordForm from './ChangePasswordForm';

import { PasswordTypes, FormValuesTypes } from './types';

const ITEM_PROPS = {
  title: 'Password',
  subtitle: 'The password is used to login and change sensetive settings.',
  buttonText: 'Change Password',
  modalTitle: 'Change Password',
  modalSubtitle: 'The password is used to login and change sensetive settings',
  successModalTitle: 'PASSWORD CHANGED!',
  successModalSubtitle: 'Your password has been successfully changed',
};

type Props = {
  results: any; // todo: set types for results
  changePassword: (values: PasswordTypes) => void;
  loading: boolean;
};

const ChangePassword: React.FC<Props> = props => {
  const { results, changePassword, loading } = props;

  const [showModal, toggleShowModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);

  const onOpenModal = () => toggleShowModal(true);
  const onCloseModal = () => toggleShowModal(false);

  const onSuccessClose = () => toggleSuccessModal(false);

  const handleSubmit = (values: FormValuesTypes) => {
    const { currentPassword, newPassword } = values;
    changePassword({ currentPassword, newPassword });
  };

  useEffect(() => {
    if (results && results.status === 'OK') {
      onCloseModal();
      toggleSuccessModal(true);
    }
  }, [results]);

  return (
    <SecurityItem {...ITEM_PROPS} isPasswordPin={true} onClick={onOpenModal}>
      <ModalUIComponent
        onClose={onCloseModal}
        showModal={showModal}
        isWide={true}
        subtitle={ITEM_PROPS.modalSubtitle}
        title={ITEM_PROPS.modalTitle}
      >
        <ChangePasswordForm onSubmit={handleSubmit} loading={loading} />
      </ModalUIComponent>
      <SuccessModal
        title={ITEM_PROPS.successModalTitle}
        subtitle={ITEM_PROPS.successModalSubtitle}
        onClose={onSuccessClose}
        showModal={showSuccessModal}
      />
    </SecurityItem>
  );
};

export default ChangePassword;
