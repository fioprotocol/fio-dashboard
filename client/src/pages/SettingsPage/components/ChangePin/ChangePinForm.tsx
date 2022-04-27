import React, { useEffect } from 'react';
import classnames from 'classnames';

import InputRedux, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/InputRedux';
import Pin from '../../../../components/Input/PinInput/Pin';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import {
  ErrorBadge,
  ERROR_UI_TYPE,
} from '../../../../components/Input/ErrorBadge';

import { PIN_LENGTH } from '../../../../constants/form';

import { ClickEventTypes } from './types';

import classes from '../../styles/ChangePin.module.scss';

type Props = {
  onNextClick: (event: ClickEventTypes) => void;
  isConfirmPage: boolean;
  onSubmit: () => void;
  loading: boolean;
  password?: string;
  pin: string;
  handlePinChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  error?: string;
  onUnmount: () => void;
};

const ChangePinForm: React.FC<Props> = props => {
  const {
    onNextClick,
    onSubmit,
    isConfirmPage,
    loading,
    pin = '',
    password,
    handlePinChange,
    handlePasswordChange,
    error = '',
    onUnmount,
  } = props;

  useEffect(() => {
    return () => onUnmount();
  }, []);

  const isDisabled = !pin || pin.length < PIN_LENGTH;

  return (
    <div className={classes.formBox}>
      <div className={classnames(classes.box, isConfirmPage && classes.show)}>
        <div className={classes.pinContainer}>
          <Pin
            value={pin}
            onChange={handlePinChange}
            name="pin"
            error={error}
            withoutMargin={true}
          />
        </div>

        <SubmitButton onClick={onNextClick} text="Next" disabled={isDisabled} />
      </div>
      <div className={classnames(classes.box, isConfirmPage && classes.show)}>
        <InputRedux
          type="password"
          meta={{ error }}
          showErrorBorder={!!error}
          hideError={true}
          input={{ value: password, onChange: handlePasswordChange }}
          lowerCased={false}
          showClearInput={true}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
        />
        {error && (
          <div className={classes.errorContainer}>
            <ErrorBadge
              type={ERROR_UI_TYPE.BADGE}
              hasError={!!error}
              error={error}
            />
          </div>
        )}
        <SubmitButton
          onClick={onSubmit}
          text={loading ? 'Confirming' : error ? 'Try Again' : 'Confirm'}
          disabled={loading}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ChangePinForm;
