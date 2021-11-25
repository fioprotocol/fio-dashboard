import React from 'react';

import Modal from '../../../components/Modal/Modal';
import EditWalletNameForm from './EditWalletNameForm';

import { EditWalletNameValues } from '../types';

import classes from '../styles/WalletDetailsModal.module.scss';

type Props = {
  show: boolean;
  initialValues: EditWalletNameValues;
  loading: boolean;
  onSubmit: (values: EditWalletNameValues) => void;
  onClose: () => void;
};

const EditWalletNameModal: React.FC<Props> = props => {
  const { show, initialValues, onSubmit, onClose, loading } = props;

  return (
    <Modal
      show={show}
      isSimple={true}
      closeButton={true}
      onClose={onClose}
      isMiddleWidth={true}
      hasDefaultCloseColor={true}
    >
      <div className={classes.container}>
        <h3 className={classes.title}>Edit Wallet Name</h3>
        <EditWalletNameForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default EditWalletNameModal;
