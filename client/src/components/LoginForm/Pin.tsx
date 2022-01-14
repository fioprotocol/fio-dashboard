import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import FormHeader from '../FormHeader/FormHeader';
import CloseButton from '../CloseButton/CloseButton';
import PinForm from '../PinForm';

import { PIN_LENGTH } from '../../constants/form';
import { IOS_KEYBOARD_PLUG_TYPE } from '../Input/PinInput/constants';

import classes from './LoginForm.module.scss';

type OwnProps = {
  onSubmit: (params: { email: string; pin: string }) => void;
  exitPin: () => void;
  resetLoginFailure: () => void;
  edgeAuthLoading: boolean;
  loginFailure: { fields?: { [fieldName: string]: any }; code?: string };
  edgeLoginFailure: { type?: string };
  email: string;
};
type Props = OwnProps;

const Pin = (props: Props) => {
  const {
    email,
    edgeAuthLoading,
    loginFailure,
    edgeLoginFailure,
    exitPin,
    resetLoginFailure,
    onSubmit,
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
    resetLoginFailure();
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
            iosKeyboardPlugType={
              error
                ? IOS_KEYBOARD_PLUG_TYPE.emptyPlug
                : IOS_KEYBOARD_PLUG_TYPE.highPlug
            }
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
