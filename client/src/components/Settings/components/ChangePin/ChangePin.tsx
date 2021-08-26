import React from 'react';
import SecurityItem from '../SecurityItem/SecurityItem';

const ITEM_PROPS = {
  title: 'PIN',
  subtitle: 'Your PIN is a 4 digit code used to do quick re-logins.',
  buttonText: 'Change PIN',
};

const ChangePassword = () => {
  return <SecurityItem {...ITEM_PROPS} isPasswordPin={true} />;
};

export default ChangePassword;
