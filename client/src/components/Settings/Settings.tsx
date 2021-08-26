import React from 'react';
import LayoutContainer from '../LayoutContainer/LayoutContainer';

import ChangePassword from './components/ChangePassword';
import ChangePin from './components/ChangePin';
import PasswordRecovery from './components/PasswordRecovery';

import classes from './Settings.module.scss';

const Settings = () => {
  return (
    <LayoutContainer title="Settings">
      <div className={classes.securityContainer}>
        <h5 className={classes.title}>Security</h5>
        <div className={classes.passwordPinContainer}>
          <ChangePassword />
          <ChangePin />
        </div>
        <PasswordRecovery />
      </div>
    </LayoutContainer>
  );
};

export default Settings;
