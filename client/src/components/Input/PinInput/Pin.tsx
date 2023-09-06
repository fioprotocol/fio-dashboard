import React, { useCallback, useEffect, useRef } from 'react';
import classnames from 'classnames';
import InfoIcon from '@mui/icons-material/Info';

import PinDots from './PinDots';
import NumericKeyboard from './NumericKeyboard';

import { PIN_LENGTH } from '../../../constants/form';

import { PinProps } from './types';

import classes from '../styles/PinInput.module.scss';

const PinInput: React.FC<PinProps> = props => {
  const {
    disabled,
    error,
    name,
    value,
    withoutMargin,
    resetError,
    onChange,
    submit,
  } = props;

  const innerRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<string | undefined>(value);

  const setMyState = useCallback(
    (data: string) => {
      valueRef.current = data;
      onChange(data);

      if (resetError && error && data?.length === PIN_LENGTH - 1) {
        resetError();
      }
    },
    [error, onChange, resetError],
  );

  const handleKeyChange = useCallback(
    (key: string) => {
      if (disabled) return;
      const pinValue = valueRef && valueRef.current;

      if (/backspace/i.test(key)) {
        pinValue && onChange(pinValue.slice(0, -1));
        return;
      }

      const retValue = (pinValue && pinValue + key) || key;

      if (retValue.length > PIN_LENGTH) return;

      if (retValue && retValue.length === PIN_LENGTH) {
        onChange(retValue);
        submit && !error && submit();
        return;
      }
      onChange(retValue);
    },
    [disabled, error, onChange, submit], // todo: onChange changes every render - investigate
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      if (/\d|backspace/i.test(key)) handleKeyChange(key);
    },
    [handleKeyChange],
  );

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyUp]);

  useEffect(() => {
    setMyState(value);
  }, [value, setMyState]);

  useEffect(() => {
    if (innerRef && innerRef.current) {
      innerRef.current && innerRef.current.focus();
    }
  }, [innerRef]);

  return (
    <>
      <div
        className={classnames(
          classes.pin,
          error && classes.error,
          withoutMargin && classes.withoutMargin,
        )}
      >
        <input
          inputMode="none" // hide mobile keyboard
          max={PIN_LENGTH}
          autoComplete="off"
          className={classes.pinInput}
          id={name}
          ref={innerRef}
        />
        <PinDots value={value} error={!!error} />
        <NumericKeyboard onChange={handleKeyChange} value={value} />
      </div>

      {error && (
        <div className={classes.pinError}>
          <InfoIcon className={classes.icon} />
          {error}
        </div>
      )}
    </>
  );
};

export default PinInput;
