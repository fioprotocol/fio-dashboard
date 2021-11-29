import React, { useState } from 'react';
import TwoFactorDangerModal from './components/TwoFactorDangerModal';
import TwoFactorCodeModal from './components/TwoFactorCodeModal';
import TwoFactorApproveModal from './components/TwoFactorApproveModal';

type Props = {};

const TwoFactorAuth: React.FC<Props> = props => {
  const [showBlockModal, toggleBlockmodal] = useState(false);
  const [showCodeModal, toggleCodeModal] = useState(false);
  const [showApprove, toggleApproveModal] = useState(false);

  const onCloseBlockModal = () => toggleBlockmodal(false);

  const onOpenCodeModal = () => {
    onCloseBlockModal();
    toggleCodeModal(true);
  };
  const onCloseCodeModal = () => toggleCodeModal(false);

  const onCloseApproveModal = () => toggleApproveModal(false);

  return (
    <>
      <TwoFactorDangerModal
        show={showBlockModal}
        onClose={onCloseBlockModal}
        onActionClick={onOpenCodeModal}
      />
      <TwoFactorCodeModal show={showCodeModal} onClose={onCloseCodeModal} />
      <TwoFactorApproveModal show={showApprove} onClose={onCloseApproveModal} />
    </>
  );
};

export default TwoFactorAuth;
