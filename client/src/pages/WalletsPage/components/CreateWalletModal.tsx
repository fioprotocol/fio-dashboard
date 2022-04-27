import React from 'react';

import Modal from '../../../components/Modal/Modal';
import CreateWalletForm from './CreateWalletForm';

import classes from '../styles/CreateWalletModal.module.scss';

import { CreateWalletValues } from '../types';

type Props = {
  show: boolean;
  loading: boolean;
  initialValues: CreateWalletValues;
  onClose: () => void;
  onSubmit: (values: CreateWalletValues) => void;
};

const CreateWalletModal: React.FC<Props> = props => {
  const { show, loading, initialValues, onSubmit, onClose } = props;
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
        <h4 className={classes.title}>Create New Wallet</h4>
        <CreateWalletForm
          onSubmit={onSubmit}
          loading={loading}
          initialValues={initialValues}
        />
      </div>
    </Modal>
  );
};

export default CreateWalletModal;
