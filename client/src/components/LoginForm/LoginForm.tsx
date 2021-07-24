import React, { useState, useEffect } from 'react';

import ModalComponent from '../Modal/Modal';
import Pin from './Pin';
import UsernamePassword from './UsernamePassword';
import { LastAuthData } from '../../types';

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
  edgeLoginFailure: { type?: string };
  cachedUsers: string[];
  lastAuthData: LastAuthData;
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
  } = props;
  const [isForgotPass, toggleForgotPass] = useState(false);
  const [usePinLogin, setUsePinLogin] = useState(false);
  useEffect(getCachedUsers, []);
  useEffect(() => {
    if (lastAuthData && cachedUsers.indexOf(lastAuthData.username) > -1) {
      setUsePinLogin(true);
    } else {
      setUsePinLogin(false);
    }
  }, [cachedUsers, lastAuthData]);

  const handleSubmit = (values: FormValues) => {
    const { email, password, pin } = values;
    onSubmit({
      email,
      password,
      pin,
    });
  };

  const onForgotPassClose = () => {
    toggleForgotPass(false);
  };

  const exitPin = () => {
    resetLastAuthData();
    clearCachedUser(lastAuthData.username);
  };

  return (
    <ModalComponent
      show={show}
      backdrop="static"
      onClose={isForgotPass ? onForgotPassClose : onClose}
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
          onClose={onClose}
        />
      )}
    </ModalComponent>
  );
};

export default LoginForm;
