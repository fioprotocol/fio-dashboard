import React from 'react';
import LayoutContainer from '../LayoutContainer/LayoutContainer';

import ChangePassword from './components/ChangePassword';
import ChangePin from './components/ChangePin';
import PasswordRecovery from './components/PasswordRecovery';

import classes from './Settings.module.scss';
import InputRedux, { INPUT_UI_STYLES } from '../Input/InputRedux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Settings = (props: { loading: boolean; user: { email: string } }) => {
  const { user, loading } = props;
  if (loading || user == null)
    return (
      <LayoutContainer title="Settings">
        <div className="d-flex justify-content-center align-items-center h-100 pt-5 pb-5">
          <FontAwesomeIcon icon="spinner" spin />
        </div>
      </LayoutContainer>
    );

  return (
    <LayoutContainer title="Settings">
      <div className={`${classes.settingsContainer} mb-4`}>
        <h5 className={classes.title}>Email address</h5>
        <div className="w-50">
          <InputRedux
            input={{ disabled: true, value: user.email }}
            lowerCased={true}
            meta={{}}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            type="text"
          />
        </div>
      </div>
      <div className={classes.settingsContainer}>
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
