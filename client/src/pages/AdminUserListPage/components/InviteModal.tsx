import React from 'react';

import Modal from '../../../components/Modal/Modal';
import InviteForm from './InviteForm';

import { FormValuesProps } from '../types';

type Props = {
  show: boolean;
  loading: boolean;
  onSubmit: (values: FormValuesProps) => void;
  onClose: () => void;
};

const InviteModal: React.FC<Props> = props => {
  const { show, loading, onSubmit, onClose } = props;
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
        <h3 className="text-left mb-3">Invite admin user</h3>
        <InviteForm onSubmit={onSubmit} loading={loading} />
      </div>
    </Modal>
  );
};

export default InviteModal;
