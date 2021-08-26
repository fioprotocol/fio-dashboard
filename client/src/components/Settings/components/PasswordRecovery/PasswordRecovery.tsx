import React from 'react';
import SecurityItem from '../SecurityItem/SecurityItem';

const ITEM_PROPS = {
  title: 'Password Recovery',
  subtitle: 'Need to get password recovery language...',
  attentionText: 'Important information goes here...',
  buttonText: 'Set up Password Recovery',
  modalTitle: 'Confirm Recovery Questions',
};

const ChangePassword = () => {
  return <SecurityItem {...ITEM_PROPS} />;
};

export default ChangePassword;
