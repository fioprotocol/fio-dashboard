import React from 'react';

import Modal from '../../../../components/Modal/Modal';
import AccountProfileForm from './AccountProfileForm';

import { FormValuesProps } from '../../types';
import { FioAccountProfile } from '../../../../types';

type Props = {
  show: boolean;
  loading: boolean;
  onSubmit: (values: FormValuesProps) => Promise<void>;
  onClose: () => void;
  initialValues?: FioAccountProfile;
};

const FioAccountProfileModal: React.FC<Props> = props => {
  const { show, loading, onSubmit, onClose, initialValues } = props;
  return (
    <Modal
      show={show}
      closeButton={true}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
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
        />
      </div>
    </Modal>
  );
};

export default FioAccountProfileModal;
