import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PIN_LENGTH } from '../../../constants/form';
import { useCheckIfDesktop } from '../../../screenType';

import classes from './PinInput.module.scss';
import PinDots from './PinDots';

type Props = {
  error: string;
  value: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  name: string;
  loading: boolean;
  unfocusOnFinish?: boolean;
  submit?: () => void;
};

type eventProps = {
  nativeEvent?: {
    inputType?: string;
  };
} & ChangeEvent<HTMLInputElement>;

const PinInput: React.FC<Props> = props => {
  const {
    error,
    onFocus,
    onBlur,
    name,
    value,
    onChange,
    submit,
    unfocusOnFinish,
  } = props;

  const [showKeyboard, toggleShowKeyboard] = useState(false); //handle mobile keyboard

  const innerRef = useRef(null);
  const valueRef = useRef(value);

  const setMyState = (data: string) => {
    valueRef.current = data;
    onChange(data);
  };

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    setMyState(value);
  }, [value]);

  useEffect(() => innerRef.current && innerRef.current.focus(), []);

  const onKeyUp = (e: KeyboardEvent) => {
    const { key } = e;
    if (/\d/.test(key)) {
      const pinValue = valueRef && valueRef.current;
      const retValue = (pinValue && pinValue + key) || key;

      if (retValue && retValue.length > PIN_LENGTH) {
        unfocusOnFinish && innerRef.current && innerRef.current.blur();
        submit && !error && submit();
        return;
      }
      onChange(retValue);
    }
  };

  const onClick = () => {
    innerRef.current && innerRef.current.focus();
  };

  const isDesktop = useCheckIfDesktop();
  const isIOS = /iPad|iPhone/i.test(window.navigator.appVersion);

  const handleBlur = () => {
    onBlur && onBlur();
    toggleShowKeyboard(false);
  };

  const handleFocus = () => {
    onFocus && onFocus();
    toggleShowKeyboard(true);
  };

  return (
    <>
      <div
        className={classnames(classes.pin, error && classes.error)}
        onClick={onClick}
      >
        <input
          type="tel"
          max={PIN_LENGTH}
          value={value}
          autoComplete="off"
          className={classes.pinInput}
          id={name}
          onChange={(e: eventProps) => {
            // fixes android backspace keyup event
            if (e.nativeEvent.inputType === 'deleteContentBackward') {
              const currentValue = e.target.value;
              onChange(currentValue);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={innerRef}
        />
        <PinDots value={value} error={!!error} />
        {!isDesktop && showKeyboard && isIOS && (
          <div className={classes.keyboardPlug} />
        )}
      </div>

      {error && (
        <div className={classes.pinError}>
          <FontAwesomeIcon icon="info-circle" className={classes.icon} />
          {error}
        </div>
      )}
    </>
  );
};

export default PinInput;
