import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import classnames from 'classnames';
import PinInput from 'react-pin-input';
import { useForm } from 'react-final-form';

import classes from './Input.module.scss';

const regularInputWrapper = (children) => (
  <div className={classes.regInputWrapper}>{children}</div>
);

const Input = props => {
  const { input, meta } = props;
  const { type, value, name } = input;

  const [showPass, toggleShowPass] = useState(false);
  const [clearInput, toggleClearInput] = useState(value !== '');

  useEffect(() => {
    toggleClearInput(value !== '');
  });

  const clearInputFn = () => {
    input.onChange(meta.initial);
  };
  const hasError = meta.error && (meta.touched || meta.modified);

  const regularInput = (
    <>
      <div className={classes.inputGroup}>
        <input
          className={classnames(classes.regInput, hasError && classes.error)}
          {...input}
          {...props}
          type={showPass ? 'text' : type}
        />
        {clearInput && (
          <FontAwesomeIcon
            icon='times-circle'
            className={classnames(
              classes.inputIcon,
              type === 'password' && classes.doubleIcon
            )}
            onClick={() => clearInputFn()}
          />
        )}
        {clearInput && type === 'password' && (
          <FontAwesomeIcon
            icon={!showPass ? 'eye' : 'eye-slash'}
            className={classes.inputIcon}
            onClick={() => toggleShowPass(!showPass)}
          />
        )}
      </div>
      <div
        className={classnames(classes.errorMessage, hasError && classes.error)}
      >
        <FontAwesomeIcon icon={'info-circle'} className={classes.errorIcon} />
        {meta.error}
      </div>
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
            initialValue=''
            focus
            type='numeric'
            inputMode='number'
            onComplete={(value, index) => {
              !hasError && form.submit();
            }}
            regexCriteria={/^[0-9]*$/}
            {...props}
            {...input}
          />
        </div>
        {hasError && (
          <div className={classes.pinError}>
            <FontAwesomeIcon icon='info-circle' className={classes.icon} />
            {meta.error}
          </div>
        )}
      </>
    );
  }

  return <input {...input} {...props} />;
};

export default Input;
