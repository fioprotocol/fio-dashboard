import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import ChangePassword from './components/ChangePassword';
import ChangePin from './components/ChangePin';
import PasswordRecovery from './components/PasswordRecovery';
import ChangeEmail from './components/ChangeEmail';
import TwoFactorAuth from './components/TwoFactorAuth';
import DeleteMyAccount from './components/DeleteMyAccount';

import { showRecoveryModal } from '../../redux/modal/actions';
import { changeRecoveryQuestionsOpen } from '../../redux/edge/actions';

import { showRecovery as showRecoverySelector } from '../../redux/modal/selectors';
import {
  loading as loadingSelector,
  user as userSelector,
} from '../../redux/profile/selectors';

import useEffectOnce from '../../hooks/general';

import classes from './styles/Settings.module.scss';

export const PREOPENED_MODALS = {
  RECOVERY: 'recovery',
  PIN: 'pin',
};

const SettingsPage: React.FC = () => {
  const user = useSelector(userSelector);
  const loading = useSelector(loadingSelector);
  const showRecovery = useSelector(showRecoverySelector);

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
      <div className={`${classes.settingsContainer} mb-4`}>
        <h5 className={classes.title}>Security</h5>
        <div className={classes.passwordPinContainer}>
          <ChangePassword />
          <ChangePin preopenedModal={preopenedPinModal} />
        </div>
        <TwoFactorAuth />
        <PasswordRecovery />
      </div>
      <div className={classes.settingsContainer}>
        <h5 className={classes.title}>Account Management</h5>
        <DeleteMyAccount />
      </div>
    </LayoutContainer>
  );
};

export default SettingsPage;
