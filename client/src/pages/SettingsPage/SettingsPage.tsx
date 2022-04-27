import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import ChangePassword from './components/ChangePassword';
import ChangePin from './components/ChangePin';
import PasswordRecovery from './components/PasswordRecovery';
import ChangeEmail from './components/ChangeEmail';
import TwoFactorAuth from './components/TwoFactorAuth';

import classes from './styles/Settings.module.scss';

type Props = { loading: boolean; user: { email: string } };
const SettingsPage: React.FC<Props> = props => {
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
        <h5 className={classes.title}>Email Address</h5>
        <ChangeEmail />
      </div>
      <div className={classes.settingsContainer}>
        <h5 className={classes.title}>Security</h5>
        <div className={classes.passwordPinContainer}>
          <ChangePassword />
          <ChangePin />
        </div>
        <TwoFactorAuth />
        <PasswordRecovery />
      </div>
    </LayoutContainer>
  );
};

export default SettingsPage;
