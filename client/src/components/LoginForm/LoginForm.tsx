import React, { useCallback, useState, useEffect, useRef } from 'react';
import { osName, osVersion } from 'react-device-detect';

import ModalComponent from '../Modal/Modal';
import Pin from './Pin';
import UsernamePassword from './UsernamePassword';
import TwoFactorDangerModal from './components/TwoFactorDangerModal';
import TwoFactorCodeModal, {
  BackupFormValues,
} from './components/TwoFactorCodeModal';
import PageTitle from '../PageTitle/PageTitle';
import NotificationBadge from '../NotificationBadge';
import { BADGE_TYPES } from '../Badge/Badge';

import { LINKS } from '../../constants/labels';

import apis from '../../api';

import { autoLogin, AutoLoginParams } from '../../util/login';
import useEffectOnce from '../../hooks/general';

import { LastAuthData, LoginFailure, RefProfile } from '../../types';

import classes from './LoginForm.module.scss';

type FormValues = {
  email?: string;
  password?: string;
  pin?: string;
  refCode?: string;
  options?: {
    otpKey?: string;
    challengeId?: string;
  };
  voucherId?: string;
};

type Props = {
  show: boolean;
  onSubmit: (params: FormValues) => void;
  edgeAuthLoading: boolean;
  isPinEnabled: boolean;
  onClose: () => void;
  getCachedUsers: () => void;
  resetLastAuthData: () => void;
  resetLoginFailure: () => void;
  loginFailure: LoginFailure;
  edgeLoginFailure: {
    type?: string;
    reason?: string;
    voucherActivates?: string;
    message?: string;
    voucherId?: string;
    challengeId?: string;
    challengeUri?: string;
  };
  cachedUsers: string[];
  lastAuthData: LastAuthData;
  refProfileInfo: RefProfile;
};

const LoginForm: React.FC<Props> = props => {
  const {
    show,
    onSubmit,
    edgeAuthLoading,
    isPinEnabled,
    onClose,
    cachedUsers,
    lastAuthData,
    refProfileInfo,
    getCachedUsers,
    resetLastAuthData,
    resetLoginFailure,
    loginFailure,
    edgeLoginFailure,
  } = props;
  const [isForgotPass, toggleForgotPass] = useState(false);
  const [usePinLogin, setUsePinLogin] = useState(false);
  const [showBlockModal, toggleBlockModal] = useState(false);
  const [showCodeModal, toggleCodeModal] = useState(false);
  const [loginParams, setLoginParams] = useState<AutoLoginParams | null>(null);
  const [voucherDate, setVoucherDate] = useState<string | null>(null);
  const [
    alternativeLoginError,
    setAlternativeLoginErrorToParentsComponent,
  ] = useState<string | null>(null);

  const timerRef = useRef(null);

  useEffect(getCachedUsers, [getCachedUsers]);

  const handlePinLogin = useCallback(() => {
    if (
      lastAuthData &&
      cachedUsers.indexOf(lastAuthData.username) > -1 &&
      isPinEnabled &&
      !edgeAuthLoading
    ) {
      setUsePinLogin(true);
    } else {
      setUsePinLogin(false);
    }
  }, [cachedUsers, edgeAuthLoading, isPinEnabled, lastAuthData]);

  useEffectOnce(() => {
    handlePinLogin();
  }, [handlePinLogin]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const isOtpError =
      edgeLoginFailure &&
      edgeLoginFailure.reason === 'otp' &&
      edgeLoginFailure.voucherId &&
      edgeLoginFailure.voucherActivates;

    if (isOtpError) {
      setVoucherDate(edgeLoginFailure.voucherActivates || null);
      !showCodeModal && toggleBlockModal(true);
      const deviceDescription = `${osName} ${osVersion}`;
      const voucherId = edgeLoginFailure.voucherId;

      if (voucherId && loginParams?.email) {
        apis.auth.createNewDeviceRequest({
          email: loginParams.email,
          deviceDescription,
          voucherId,
        });
        autoLogin({
          voucherId,
          timerRef,
          loginParams,
          login: onSubmit,
          onCloseBlockModal,
        });
      }
    }
  }, [
    edgeLoginFailure,
    edgeLoginFailure.reason,
    loginParams,
    onSubmit,
    showCodeModal,
  ]);

  const handleSubmit = (values: FormValues) => {
    const { email, password, pin } = values;
    setLoginParams({ email, password });
    const submitParams: {
      email: string;
      password: string;
      pin: string;
      refCode: string;
      options?: {
        challengeId?: string;
      };
    } = {
      email,
      password,
      pin,
      refCode: refProfileInfo?.code || '',
    };

    if (edgeLoginFailure && edgeLoginFailure.challengeId) {
      submitParams.options = { challengeId: edgeLoginFailure.challengeId };
    }

    onSubmit(submitParams);
  };

  const onCloseLogin = useCallback(() => {
    onClose();
    setLoginParams(null);
    handlePinLogin();
  }, [handlePinLogin, onClose]);

  const onForgotPassClose = () => {
    toggleForgotPass(false);
  };

  const exitPin = () => {
    resetLastAuthData();
  };

  const onCloseBlockModal = () => {
    toggleBlockModal(false);
    timerRef.current && clearTimeout(timerRef.current);
    setVoucherDate(null);
  };

  const onOpenCodeModal = () => {
    onCloseBlockModal();
    toggleCodeModal(true);
  };
  const onCloseCodeModal = () => toggleCodeModal(false);

  const submitBackupCode = (values: BackupFormValues) => {
    onSubmit({
      ...loginParams,
      options: {
        otpKey: values.backupCode,
      },
      voucherId: edgeLoginFailure.voucherId,
    });
  };

  return (
    <>
      <PageTitle link={LINKS.SIGN_IN} isVirtualPage />
      <TwoFactorDangerModal
        show={showBlockModal}
        onClose={onCloseBlockModal}
        onActionClick={onOpenCodeModal}
        activationDate={voucherDate}
      />
      <TwoFactorCodeModal
        show={showCodeModal}
        onClose={onCloseCodeModal}
        onSubmit={submitBackupCode}
        loading={edgeAuthLoading}
        otpError={edgeLoginFailure.message}
      />
      <ModalComponent
        show={show && !showBlockModal && !showCodeModal}
        backdrop="static"
        onClose={isForgotPass ? onForgotPassClose : onCloseLogin}
        closeButton
        enableOverflow
      >
        <NotificationBadge
          type={BADGE_TYPES.RED}
          show={!!alternativeLoginError}
          hasNewDesign
          message={alternativeLoginError}
          className={classes.errorBadge}
          messageClassnames={classes.errorMessage}
        />
        {usePinLogin && lastAuthData ? (
          <Pin
            email={lastAuthData.email}
            onSubmit={handleSubmit}
            edgeAuthLoading={edgeAuthLoading}
            loginFailure={loginFailure}
            edgeLoginFailure={edgeLoginFailure}
            exitPin={exitPin}
            resetLoginFailure={resetLoginFailure}
          />
        ) : (
          <UsernamePassword
            onSubmit={handleSubmit}
            edgeAuthLoading={edgeAuthLoading}
            loginFailure={loginFailure}
            edgeLoginFailure={edgeLoginFailure}
            isForgotPass={isForgotPass}
            toggleForgotPass={toggleForgotPass}
            title="Sign in to your account"
            onClose={onCloseLogin}
            initialValues={loginParams || {}}
            resetLoginFailure={resetLoginFailure}
            setAlternativeLoginErrorToParentsComponent={
              setAlternativeLoginErrorToParentsComponent
            }
          />
        )}
      </ModalComponent>
    </>
  );
};

export default LoginForm;
