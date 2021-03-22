import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import classnames from 'classnames';
import classes from './Input.module.scss';
import PinInput from 'react-pin-input';

const regularInputWrapper = (children) => (
  <div className={classes.regInputWrapper}>{children}</div>
);

const Input = props => {
  const { input, meta, onComplete } = props;
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

  if (name === 'pin') {
    return (
      <div className={classes.pin}>
        <PinInput
          length={6}
          initialValue=''
          focus
          type='numeric'
          inputMode='number'
          onComplete={(value, index) => {}}
          regexCriteria={/^[0-9]*$/}
          {...props}
          {...input}
        />
      </div>
    );
  }

  return <input {...input} {...props} />;
};

export default Input;
