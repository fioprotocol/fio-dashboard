import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isIOS } from 'react-device-detect';
import PinDots from './PinDots';

import { useCheckIfDesktop } from '../../../screenType';

import { PIN_LENGTH } from '../../../constants/form';
import { IOS_KEYBOARD_PLUG_TYPE } from './constants';

import { PinInputProps, PinInputEventProps } from './types';

import classes from './PinInput.module.scss';

const PinInput: React.FC<PinInputProps> = props => {
  const {
    error,
    name,
    value,
    withoutMargin,
    form,
    iosKeyboardPlugType,
    onChange,
    submit,
    onFocus,
    onBlur,
    onReset,
  } = props;

  const [showKeyboard, toggleShowKeyboard] = useState(false); // handle mobile keyboard

  const innerRef = useRef(null);
  const valueRef = useRef(value);

  const isActiveElement = document.activeElement === innerRef.current;

  const setMyState = (data: string) => {
    valueRef.current = data;
    onChange(data);

    if (error && data.length === PIN_LENGTH - 1) {
      form &&
        form.mutators.setDataMutator(name, {
          error: false,
        });
      onReset();
    }
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

  useEffect(() => {
    if (innerRef && innerRef.current) {
      innerRef.current && innerRef.current.focus();
    }
  }, [innerRef]);

  const onKeyUp = (e: KeyboardEvent) => {
    const { key } = e;
    if (/\d/.test(key)) {
      const pinValue = valueRef && valueRef.current;
      const retValue = (pinValue && pinValue + key) || key;

      if (retValue.length > PIN_LENGTH) return;

      if (retValue && retValue.length === PIN_LENGTH) {
        onChange(retValue);
        submit && !error && submit();
        !isDesktop && refInputBlur();
        return;
      }
      onChange(retValue);
    }
  };

  const onClick = () => {
    innerRef.current && innerRef.current.focus();
  };

  const refInputBlur = () => {
    innerRef.current && innerRef.current.blur();
    handleBlur();
  };

  const isDesktop = useCheckIfDesktop();

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
        className={classnames(
          classes.pin,
          error && classes.error,
          withoutMargin && classes.withoutMargin,
        )}
        onClick={onClick}
      >
        <input
          type="tel"
          max={PIN_LENGTH}
          value={value}
          autoComplete="off"
          className={classes.pinInput}
          id={name}
          onChange={(e: PinInputEventProps) => {
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
        {!isDesktop && showKeyboard && isActiveElement && (
          <div
            className={classnames(
              isIOS &&
                (IOS_KEYBOARD_PLUG_TYPE[iosKeyboardPlugType]
                  ? classes[iosKeyboardPlugType]
                  : classes.keyboardPlug),
            )}
          />
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
