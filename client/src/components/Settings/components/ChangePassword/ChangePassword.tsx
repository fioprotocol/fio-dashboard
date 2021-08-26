import React from 'react';
import SecurityItem from '../SecurityItem/SecurityItem';

const ITEM_PROPS = {
  title: 'Password',
  subtitle: 'The password is used to login and change sensetive settings.',
  buttonText: 'Change Password',
};

const ChangePassword = () => {
  return <SecurityItem {...ITEM_PROPS} isPasswordPin={true} />;
};

export default ChangePassword;
