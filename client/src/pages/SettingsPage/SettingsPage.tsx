import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import ChangePassword from './components/ChangePassword';
import ChangePin from './components/ChangePin';
import PasswordRecovery from './components/PasswordRecovery';
import ChangeEmail from './components/ChangeEmail';
import TwoFactorAuth from './components/TwoFactorAuth';
import DeleteMyAccount from './components/DeleteMyAccount';
import { EmailNotifications } from './components/EmailNotifications';
import Loader from '../../components/Loader/Loader';

import { showRecoveryModal } from '../../redux/modal/actions';
import { changeRecoveryQuestionsOpen } from '../../redux/edge/actions';

import { showRecovery as showRecoverySelector } from '../../redux/modal/selectors';
import {
  isAuthenticated as isAuthenticatedSelector,
  loading as loadingSelector,
  user as userSelector,
} from '../../redux/profile/selectors';

import { USER_PROFILE_TYPE } from '../../constants/profile';

import useEffectOnce from '../../hooks/general';

import classes from './styles/Settings.module.scss';

export const PREOPENED_MODALS = {
  RECOVERY: 'recovery',
  PIN: 'pin',
};

const SettingsPage: React.FC = () => {
  const loading = useSelector(loadingSelector);
  const showRecovery = useSelector(showRecoverySelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const [preopenedPinModal, togglePreopenedPinModal] = useState(false);

  const { state } = useLocation<{ openSettingsModal: string }>();
  const { openSettingsModal } = state || {};

  useEffectOnce(() => {
    if (openSettingsModal) {
      if (openSettingsModal === PREOPENED_MODALS.RECOVERY && !showRecovery) {
        dispatch(showRecoveryModal());
        dispatch(changeRecoveryQuestionsOpen());
      }
      if (openSettingsModal === PREOPENED_MODALS.PIN && !preopenedPinModal) {
        togglePreopenedPinModal(true);
      }
    }
  }, [dispatch, openSettingsModal, showRecovery]);

  if (loading && !isAuthenticated)
    return (
      <LayoutContainer title="Settings">
        <div className="d-flex justify-content-center align-items-center h-100 pt-5 pb-5">
          <Loader />
        </div>
      </LayoutContainer>
    );

  return (
    <LayoutContainer title="Settings">
      <div className={`${classes.settingsContainer} mb-4 mt-4`}>
        <h5 className={classes.title}>Email Address</h5>
        <ChangeEmail />
        <h5 className={`${classes.title} mt-4`}>Email Notifications</h5>
        <EmailNotifications />
      </div>
      {user.userProfileType === USER_PROFILE_TYPE.PRIMARY && (
        <div className={`${classes.settingsContainer} mb-4`}>
          <h5 className={classes.title}>Security</h5>
          <div className={classes.passwordPinContainer}>
            <ChangePassword />
            <ChangePin preopenedModal={preopenedPinModal} />
          </div>
          <TwoFactorAuth />
          <PasswordRecovery />
        </div>
      )}
      <div className={classes.settingsContainer}>
        <h5 className={classes.title}>Account Management</h5>
        <DeleteMyAccount />
      </div>
    </LayoutContainer>
  );
};

export default SettingsPage;
