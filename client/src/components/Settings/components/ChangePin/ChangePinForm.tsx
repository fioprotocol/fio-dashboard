import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputRedux, { INPUT_UI_STYLES } from '../../../Input/InputRedux';
import PinInput from '../../../Input/PinInput/PinInput';
import { ErrorBadge, ERROR_UI_TYPE } from '../../../Input/ErrorBadge';

import classes from './ChangePin.module.scss';
import { ClickEventTypes } from './types';
import { PIN_LENGTH } from '../../../../constants/form';

type Props = {
  onNextClick: (event: ClickEventTypes) => void;
  isConfirmPage: boolean;
  onSubmit: () => void;
  loading: boolean;
  password?: string;
  pin?: string;
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
    pin,
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
          <PinInput
            value={pin}
            onChange={handlePinChange}
            name="pin"
            loading={loading}
            error={error}
          />
        </div>
        <Button
          className={classes.button}
          onClick={onNextClick}
          disabled={isDisabled}
        >
          Next
        </Button>
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
              hasError={error}
              error={error}
            />
          </div>
        )}
        <Button
          onClick={onSubmit}
          disabled={loading}
          className={classes.button}
        >
          {loading ? (
            <>
              <span>Confirming </span>
              <FontAwesomeIcon icon="spinner" spin />
            </>
          ) : error ? (
            'Try Again'
          ) : (
            'Confirm'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChangePinForm;
