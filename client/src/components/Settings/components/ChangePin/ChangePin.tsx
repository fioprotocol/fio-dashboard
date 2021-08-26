import React from 'react';
import SecurityItem from '../SecurityItem/SecurityItem';

const ITEM_PROPS = {
  title: 'PIN',
  subtitle: 'Your PIN is a 4 digit code used to do quick re-logins.',
  buttonText: 'Change PIN',
  modalTitle: 'Change PIN',
  modalSubtitle:
    'Enter a new 6 digit code used to do quick re-logins into your account.',
  successModalTitle: 'PASSWORD CHANGED!',
  successModalSubtitle: 'Your password has been successfully changed',
};

const ChangePin = () => {
  return <SecurityItem {...ITEM_PROPS} isPasswordPin={true} onClick={() => {}} />;
};

export default ChangePin;
