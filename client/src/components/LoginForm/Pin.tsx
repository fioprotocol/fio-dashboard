import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import FormHeader from '../FormHeader/FormHeader';
import CloseButton from '../CloseButton/CloseButton';

import classes from './LoginForm.module.scss';
import { PIN_LENGTH } from '../../constants/form';
import PinForm from '../PinForm';

type OwnProps = {
  onSubmit: (params: { email: string; pin: string }) => void;
  exitPin: () => void;
  edgeAuthLoading: boolean;
  loginFailure: { fields?: { [fieldName: string]: any }; code?: string };
  edgeLoginFailure: { type?: string };
  email: string;
};
type Props = OwnProps;

const Pin = (props: Props) => {
  const {
    onSubmit,
    edgeAuthLoading,
    loginFailure,
    edgeLoginFailure,
    exitPin,
    email,
  } = props;
  const [error, setError] = useState({});
  useEffect(() => {
    if (!isEmpty(edgeLoginFailure)) {
      setError({
        message:
          edgeLoginFailure.type === 'PasswordError' ||
          edgeLoginFailure.type === 'UsernameError'
            ? 'Invalid Pin'
            : 'Server Error', // todo: set proper message text
      });
    }
  }, [edgeLoginFailure]);
  useEffect(() => {
    if (!isEmpty(loginFailure)) {
      setError({
        message:
          loginFailure.code === 'AUTHENTICATION_FAILED'
            ? 'Authentication failed'
            : 'Server error',
      });
    }
  }, [loginFailure]);

  const handleSubmit = (pin: string) => {
    if (pin && pin.length !== PIN_LENGTH) return;
    onSubmit({
      email,
      pin,
    });
  };

  const onReset = () => {
    setError({});
  };

  return (
    <div className={classes.formBox}>
      <div className={classes.box}>
        <div className="mt-4">
          <FormHeader
            title="Sign in with"
            titleBluePart="PIN"
            subtitle="Please enter your 6 digit PIN to sign in"
          />
          <PinForm
            onSubmit={handleSubmit}
            onReset={onReset}
            loading={edgeAuthLoading}
            error={error}
          />
          <div className={classes.exitPin} onClick={exitPin}>
            <CloseButton isWhite />{' '}
            <span className={classes.exitPinText}>Exit PIN Sign In</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pin;
