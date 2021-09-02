import React from 'react';
import SecurityItem from '../SecurityItem/SecurityItem';

const ITEM_PROPS = {
  title: 'Password Recovery',
  subtitle: 'Need to get password recovery language...',
  buttonText: 'Set up Password Recovery',
  modalTitle: 'Confirm Recovery Questions',
};

type Props = {
  showRecoveryModal: () => void;
  changeRecoveryQuestionsOpen: () => void;
};

const PasswordRecovery: React.FC<Props> = props => {
  const { showRecoveryModal, changeRecoveryQuestionsOpen } = props;

  const onClick = () => {
    showRecoveryModal();
    changeRecoveryQuestionsOpen();
  };

  return <SecurityItem {...ITEM_PROPS} onClick={onClick} />;
};

export default PasswordRecovery;
