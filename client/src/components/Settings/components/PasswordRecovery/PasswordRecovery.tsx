import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import SecurityItem from '../SecurityItem/SecurityItem';

import classes from './PasswordRecovery.module.scss';

const ITEM_PROPS = {
  title: 'Password Recovery',
  subtitle: 'Need to get password recovery language...',
  modalTitle: 'Confirm Recovery Questions',
};

type Props = {
  showRecoveryModal: () => void;
  changeRecoveryQuestionsOpen: () => void;
  username: string;
  resendRecovery: () => void;
  hasRecoveryQuestions: boolean;
  checkRecoveryQuestions: (username: string) => void;
};

const PasswordRecovery: React.FC<Props> = props => {
  const {
    showRecoveryModal,
    changeRecoveryQuestionsOpen,
    checkRecoveryQuestions,
    resendRecovery,
    hasRecoveryQuestions,
    username,
  } = props;

  useEffect(() => {
    username && checkRecoveryQuestions(username);
  }, []);

  const onClick = () => {
    showRecoveryModal();
    changeRecoveryQuestionsOpen();
  };

  const onResendClick = () => {
    resendRecovery(); // todo: handle results, show success modal
  };

  const mainButtonText = hasRecoveryQuestions
    ? 'Re Set up Password Recovery'
    : 'Set up Password Recovery';

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
    />
  );
};

export default PasswordRecovery;
