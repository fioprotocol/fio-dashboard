import React from 'react';

import DangerModal from '../../../components/Modal/DangerModal';

const CancelConfirmModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = props => {
  const { show, onClose, onConfirm } = props;
  return (
    <DangerModal
      show={show}
      onClose={onClose}
      onActionButtonClick={onConfirm}
      buttonText="Yes, Cancel Wallet Import"
      title="Are You Sure?"
      showCancel={true}
      cancelButtonText="Continue"
      subtitle="You are choosing to cancel your wallet import process. Your wallet will not be accessible on the FIO App until you complete the import process."
    />
  );
};

export default CancelConfirmModal;
