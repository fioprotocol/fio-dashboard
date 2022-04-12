import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

import FormHeader from '../FormHeader/FormHeader';
import CloseButton from '../CloseButton/CloseButton';
import PinForm from '../PinForm';
import { FIELD_NAME } from '../PinForm/PinForm';

import { PIN_LENGTH } from '../../constants/form';

import classes from './LoginForm.module.scss';

import { LoginFailure } from '../../types';

type OwnProps = {
  onSubmit: (params: { email: string; pin: string }) => void;
  exitPin: () => void;
  resetLoginFailure: () => void;
  edgeAuthLoading: boolean;
  loginFailure: LoginFailure;
  edgeLoginFailure: { type?: string; wait?: number };
  email: string;
};
type Props = OwnProps;

const Pin: React.FC<Props> = props => {
  const {
    email,
    edgeAuthLoading,
    loginFailure,
    edgeLoginFailure,
    exitPin,
    resetLoginFailure,
    onSubmit,
  } = props;
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isEmpty(edgeLoginFailure)) {
      const messageText = (type?: string) => {
        if (type === 'PasswordError' || type === 'UsernameError') {
          if (edgeLoginFailure.wait && edgeLoginFailure.wait > 0)
            return 'Pin login has been blocked';
          return 'Invalid Pin';
        }
        return 'Server Error';
      };
      setError({
        name: FIELD_NAME,
        message: messageText(edgeLoginFailure.type),
      });
    }
  }, [edgeLoginFailure]);

  useEffect(() => {
    if (!isEmpty(loginFailure)) {
      setError({
        name: FIELD_NAME,
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
    setError(null);
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
            blockedTime={(edgeLoginFailure && edgeLoginFailure.wait) || 0}
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
