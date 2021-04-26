import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import PinInput from 'react-pin-input';
import { useForm } from 'react-final-form';
import classes from './Input.module.scss';

export const INPUT_COLOR_SCHEMA = {
  BLACK_AND_WHITE: 'black_and_white',
};

const regularInputWrapper = children => (
  <div className={classes.regInputWrapper}>{children}</div>
);

const Input = props => {
  const {
    input,
    meta,
    colorSchema,
    onClose,
    badge,
    hideError,
    loading,
    ...rest
  } = props;
  const {
    error,
    data,
    touched,
    active,
    modified,
    submitError,
    modifiedSinceLastSubmit,
    initial,
    dirty,
    submitSucceeded,
  } = meta;
  const { type, value, name, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const [showPass, toggleShowPass] = useState(false);
  const [clearInput, toggleClearInput] = useState(value !== '');

  useEffect(() => {
    toggleClearInput(value !== '');
  });

  const clearInputFn = () => {
    onChange('');
  };

  const hasError =
    ((error || data.error) &&
      (touched || modified || submitSucceeded) &&
      !active) || // todo: remove !active to show red border on focused field. make debounce on create account user field
    (submitError && !modifiedSinceLastSubmit);

  const regularInput = (
    <>
      <div className={classes.inputGroup}>
        <input
          className={classnames(
            classes.regInput,
            hasError && classes.error,
            isBW && classes.bw,
          )}
          {...input}
          {...rest}
          type={showPass ? 'text' : type}
          data-clear={clearInput}
        />
        {(clearInput || onClose) && !loading && (
          <FontAwesomeIcon
            icon="times-circle"
            className={classnames(
              classes.inputIcon,
              type === 'password' && classes.doubleIcon,
              isBW && classes.bw,
              badge && classes.iconPosition,
            )}
            onClick={() => {
              clearInputFn();
              if (onClose) {
                onClose(false);
              }
            }}
          />
        )}
        {clearInput && type === 'password' && (
          <FontAwesomeIcon
            icon={!showPass ? 'eye' : 'eye-slash'}
            className={classes.inputIcon}
            onClick={() => toggleShowPass(!showPass)}
          />
        )}
        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={classnames(classes.inputIcon, classes.inputSpinnerIcon)}
          />
        )}
        <div
          className={classnames(
            classes.badge,
            badge && (dirty || initial) && classes.showBadge,
          )}
        >
          {badge}
        </div>
      </div>
      {!hideError && !data.hideError && (
        <div
          className={classnames(
            classes.errorMessage,
            hasError && classes.error,
          )}
        >
          <FontAwesomeIcon icon="info-circle" className={classes.errorIcon} />
          {hasError && (error || data.error || submitError)}
        </div>
      )}
    </>
  );

  if (type === 'text') {
    return regularInputWrapper(regularInput);
  }

  if (type === 'password' && name !== 'pin') {
    return regularInputWrapper(regularInput);
  }

  if (name === 'pin' || name === 'confirmPin') {
    const form = useForm();

    return (
      <>
        <div className={classnames(classes.pin, hasError && classes.error)}>
          <PinInput
            length={6}
            initialValue=""
            focus
            type="numeric"
            inputMode="number"
            onComplete={(value, index) => {
              !hasError && form.submit();
            }}
            regexCriteria={/^[0-9]*$/}
            {...rest}
            {...input}
          />
        </div>
        {hasError && (
          <div className={classes.pinError}>
            <FontAwesomeIcon icon="info-circle" className={classes.icon} />
            {error}
          </div>
        )}
      </>
    );
  }

  return <input {...input} {...props} />;
};

export default Input;
