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

import { autoLogin, AutoLoginParams } from '../../util/login';

import { REF_ACTIONS } from '../../constants/common';
import {
  EmailConfirmationResult,
  LastAuthData,
  LoginFailure,
} from '../../types';

type FormValues = {
  email?: string;
  password?: string;
  pin?: string;
  options?: {
    otpKey: string;
  };
  voucherId?: string;
};

type Props = {
  show: boolean;
  onSubmit: (params: FormValues) => void;
  edgeAuthLoading: boolean;
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
  };
  cachedUsers: string[];
  lastAuthData: LastAuthData;
  emailConfirmationResult: EmailConfirmationResult;
};

const REF_SUBTITLES = {
  [REF_ACTIONS.SIGNNFT]: 'Sign in to complete signing your NFT',
};

const LoginForm: React.FC<Props> = props => {
  const {
    show,
    onSubmit,
    edgeAuthLoading,
    onClose,
    cachedUsers,
    lastAuthData,
    getCachedUsers,
    resetLastAuthData,
    resetLoginFailure,
    loginFailure,
    edgeLoginFailure,
    emailConfirmationResult,
  } = props;
  const isEmailVerification = !!emailConfirmationResult?.success;
  const isRefFlow = !!emailConfirmationResult?.stateData?.refProfileQueryParams;
  let subtitle = '';
  if (
    isRefFlow &&
    emailConfirmationResult.stateData?.refProfileQueryParams?.action
  ) {
    subtitle =
      REF_SUBTITLES[
        emailConfirmationResult.stateData.refProfileQueryParams.action
      ];
  }

  const [isForgotPass, toggleForgotPass] = useState(false);
  const [usePinLogin, setUsePinLogin] = useState(false);
  const [showBlockModal, toggleBlockModal] = useState(false);
  const [showCodeModal, toggleCodeModal] = useState(false);
  const [loginParams, setLoginParams] = useState<AutoLoginParams | null>(null);
  const [voucherDate, setVoucherDate] = useState<string | null>(null);

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
    if (emailConfirmationResult && emailConfirmationResult.success) {
      setLoginParams({
        email:
          emailConfirmationResult.email || emailConfirmationResult.newEmail,
      });
    }
  }, [emailConfirmationResult]);

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
      >
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
            headerIcon={isEmailVerification ? 'envelope' : null}
            title={isEmailVerification ? 'Email Verified' : 'Sign In'}
            subtitle={subtitle}
            hideCreateAccount={isEmailVerification}
            onClose={onCloseLogin}
            initialValues={loginParams || {}}
          />
        )}
      </ModalComponent>
    </>
  );
};

export default LoginForm;
