import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import SecurityItem from '../SecurityItem/SecurityItem';
import SuccessModal from '../../../Modal/SuccessModal';
import DangerModal from '../../../Modal/DangerModal';

import classes from './PasswordRecovery.module.scss';

const ITEM_PROPS = {
  title: 'Password Recovery',
  subtitle: `Set up your password recovery, so you don't loose your account forever`,
  modalTitle: 'Confirm Recovery Questions',
  dangerTitle: 'Are You Sure?',
  dangerSubtitle:
    'This is required to recover your account in addition to your username and recovery questions.',
  successModalTitle: 'PASSWORD RECOVERY DISABLED',
  successModalSubtitle:
    'Your Password Recovery has been successfully disabled.',
};

type Props = {
  showRecoveryModal: () => void;
  changeRecoveryQuestionsOpen: () => void;
  username: string;
  resendRecovery: () => void;
  hasRecoveryQuestions: boolean;
  checkRecoveryQuestions: (username: string) => void;
  disableQuestionsResult: { status?: number };
};

const PasswordRecovery: React.FC<Props> = props => {
  const {
    showRecoveryModal,
    changeRecoveryQuestionsOpen,
    checkRecoveryQuestions,
    resendRecovery,
    hasRecoveryQuestions,
    username,
    disableQuestionsResult,
  } = props;

  const [showDisableModal, toggleDisableModal] = useState(false);
  const [showSuccessModal, toggleSuccessModal] = useState(false);

  useEffect(() => {
    username && checkRecoveryQuestions(username);
  }, []);

  useEffect(() => {
    if (disableQuestionsResult && disableQuestionsResult.status)
      toggleSuccessModal(true);
  }, [disableQuestionsResult]);

  const onClick = () => {
    if (hasRecoveryQuestions) {
      toggleDisableModal(true);
    } else {
      showRecoveryModal();
      changeRecoveryQuestionsOpen();
    }
  };

  const onResendClick = () => {
    resendRecovery(); // todo: handle results, show success modal
  };

  const onDisableClose = () => toggleDisableModal(false);

  const onSuccessClose = () => toggleSuccessModal(false);

  const mainButtonText = hasRecoveryQuestions
    ? 'Disable Password Recovery'
    : 'Setup Password Recovery';

  const renderResendButton = (
    <Button onClick={onResendClick} className={classes.resendButton}>
      Resend Recovery Email
    </Button>
  );

  return (
    <SecurityItem
      {...ITEM_PROPS}
      buttonText={mainButtonText}
      isGreen={hasRecoveryQuestions}
      onClick={onClick}
      bottomChildren={hasRecoveryQuestions && renderResendButton}
    >
      <DangerModal
        show={showDisableModal}
        onClose={onDisableClose}
        onActionButtonClick={() => {}}
        buttonText={mainButtonText}
        showCancel={true}
        title={ITEM_PROPS.dangerTitle}
        subtitle={ITEM_PROPS.dangerSubtitle}
      />
      <SuccessModal
        title={ITEM_PROPS.successModalTitle}
        subtitle={ITEM_PROPS.successModalSubtitle}
        onClose={onSuccessClose}
        showModal={showSuccessModal}
      />
    </SecurityItem>
  );
};

export default PasswordRecovery;
