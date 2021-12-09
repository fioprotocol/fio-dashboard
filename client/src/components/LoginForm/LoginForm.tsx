import React, { useState, useEffect, useRef } from 'react';
import { osName, osVersion } from 'react-device-detect';

import ModalComponent from '../Modal/Modal';
import Pin from './Pin';
import UsernamePassword from './UsernamePassword';
import TwoFactorDangerModal from './components/TwoFactorDangerModal';
import TwoFactorCodeModal, {
  BackupFormValues,
} from './components/TwoFactorCodeModal';

import apis from '../../api';

import { autoLogin } from '../../util/login';

import { REF_ACTIONS } from '../../constants/common';
import { EmailConfirmationStateData, LastAuthData } from '../../types';

type FormValues = {
  email: string;
  password?: string;
  pin?: string;
};

type Props = {
  show: boolean;
  onSubmit: (params: FormValues) => void;
  edgeAuthLoading: boolean;
  onClose: () => void;
  getCachedUsers: () => void;
  clearCachedUser: (username: string) => void;
  resetLastAuthData: () => void;
  loginFailure: { fields?: { [fieldName: string]: any }; code?: string };
  edgeLoginFailure: {
    type?: string;
    reason?: string;
    voucherActivates?: string;
    message?: string;
    voucherId?: string;
  };
  cachedUsers: string[];
  lastAuthData: LastAuthData;
  emailConfirmationResult: {
    success: boolean;
    stateData?: EmailConfirmationStateData;
  };
};

const REF_SUBTITLES = {
  [REF_ACTIONS.SIGNNFT]: 'Sign in to complete signing your NFT',
};

const LoginForm = (props: Props) => {
  const {
    show,
    onSubmit,
    edgeAuthLoading,
    onClose,
    cachedUsers,
    lastAuthData,
    getCachedUsers,
    clearCachedUser,
    resetLastAuthData,
    loginFailure,
    edgeLoginFailure,
    emailConfirmationResult,
  } = props;
  const isEmailVerification =
    emailConfirmationResult != null && emailConfirmationResult.success;
  const isRefFlow =
    emailConfirmationResult != null &&
    emailConfirmationResult.stateData != null &&
    emailConfirmationResult.stateData.refProfileQueryParams != null;
  let subtitle = '';
  if (isRefFlow) {
    subtitle =
      REF_SUBTITLES[
        emailConfirmationResult.stateData.refProfileQueryParams.action
      ];
  }

  const [isForgotPass, toggleForgotPass] = useState(false);
  const [usePinLogin, setUsePinLogin] = useState(false);
  const [showBlockModal, toggleBlockmodal] = useState(false);
  const [showCodeModal, toggleCodeModal] = useState(false);
  const [loginParams, setLoginParams] = useState(null);

  const timerRef = useRef(null);

  useEffect(getCachedUsers, []);
  useEffect(() => {
    if (lastAuthData && cachedUsers.indexOf(lastAuthData.username) > -1) {
      setUsePinLogin(true);
    } else {
      setUsePinLogin(false);
    }
  }, [cachedUsers, lastAuthData]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    const isOtpError = edgeLoginFailure && edgeLoginFailure.reason === 'otp';

    if (isOtpError) {
      !showCodeModal && toggleBlockmodal(true);
      const deviceDescription = `${osName} ${osVersion}`;
      const voucherId = edgeLoginFailure.voucherId;

      apis.auth.createNewDeviceRequest({
        email: loginParams.email,
        deviceDescription,
        voucherId,
      });
      autoLogin({ voucherId, timerRef, loginParams, login: onSubmit });
    }
  }, [edgeLoginFailure.reason]);

  const handleSubmit = (values: FormValues) => {
    const { email, password, pin } = values;
    setLoginParams({ email, password });
    onSubmit({
      email,
      password,
      pin,
    });
  };

  const onCloseLogin = () => {
    onClose();
    setLoginParams(null);
  };

  const onForgotPassClose = () => {
    toggleForgotPass(false);
  };

  const exitPin = () => {
    resetLastAuthData();
    clearCachedUser(lastAuthData.username);
  };

  const onCloseBlockModal = () => {
    toggleBlockmodal(false);
    clearTimeout(timerRef.current);
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
      <TwoFactorDangerModal
        show={showBlockModal}
        onClose={onCloseBlockModal}
        onActionClick={onOpenCodeModal}
        activationDate={edgeLoginFailure.voucherActivates}
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
      >
        {usePinLogin && lastAuthData ? (
          <Pin
            email={lastAuthData.email}
            onSubmit={handleSubmit}
            edgeAuthLoading={edgeAuthLoading}
            loginFailure={loginFailure}
            edgeLoginFailure={edgeLoginFailure}
            exitPin={exitPin}
          />
        ) : (
          <UsernamePassword
            onSubmit={handleSubmit}
            edgeAuthLoading={edgeAuthLoading}
            loginFailure={loginFailure}
            edgeLoginFailure={edgeLoginFailure}
            isForgotPass={isForgotPass}
            toggleForgotPass={toggleForgotPass}
            headerIcon={isEmailVerification ? 'envelope' : null}
            title={isEmailVerification ? 'Email Verified' : 'Sign In'}
            subtitle={subtitle}
            hideCreateAccount={isEmailVerification}
            onClose={onCloseLogin}
          />
        )}
      </ModalComponent>
    </>
  );
};

export default LoginForm;
