import React from 'react';

import Modal from '../../../../components/Modal/Modal';
import AccountProfileForm from './AccountProfileForm';

import { FormValuesProps } from '../../types';
import { FioAccountProfile } from '../../../../types';

type Props = {
  initialValues?: FioAccountProfile;
  loading: boolean;
  show: boolean;
  showWarningModal: boolean;
  dangerModaActionClick: (vaues: FormValuesProps) => void;
  toggleShowWarningModal: (showModal: boolean) => void;
  onClose: () => void;
  onSubmit: (values: FormValuesProps) => Promise<void>;
};

const FioAccountProfileModal: React.FC<Props> = props => {
  const {
    initialValues,
    loading,
    show,
    showWarningModal,
    dangerModaActionClick,
    toggleShowWarningModal,
    onClose,
    onSubmit,
  } = props;

  return (
    <Modal
      show={show}
      closeButton={true}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
      enableOverflow
      onClose={onClose}
    >
      <div className="d-flex flex-column w-100">
        <h3 className="text-left mb-3">
          {initialValues ? 'Edit' : 'Create'} FIO Account Profile
        </h3>
        <AccountProfileForm
          onSubmit={onSubmit}
          loading={loading}
          initialValues={initialValues}
          showWarningModal={showWarningModal}
          dangerModaActionClick={dangerModaActionClick}
          toggleShowWarningModal={toggleShowWarningModal}
        />
      </div>
    </Modal>
  );
};

export default FioAccountProfileModal;
