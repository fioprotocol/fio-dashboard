import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { ErrorBadge, COLOR_TYPE } from './ErrorBadge';
import {
  ClearButton,
  CopyButton,
  ShowPasswordIcon,
} from './InputActionButtons';

import classes from './Input.module.scss';

export const INPUT_UI_STYLES = {
  BLACK_LIGHT: 'blackLight',
  BLACK_WHITE: 'blackWhite',
};

export type InputProps = {
  input: any;
  meta: any;
};

export type FieldProps = {
  hideError?: boolean;
  loading?: boolean;
  lowerCased?: boolean;
  onClose?: (isOpen: boolean) => void;
  showClearInput?: boolean;
  showCopyButton?: boolean;
  prefix?: string;
  type: string;
  errorType?: string;
  uiType?: string;
  upperCased?: boolean;
  errorUIColor?: string;
  showErrorBorder?: boolean;
};

type Props = InputProps & FieldProps;

const InputRedux: React.FC<Props> = props => {
  const {
    hideError,
    input,
    loading,
    lowerCased,
    meta,
    onClose,
    showClearInput,
    showCopyButton,
    prefix = '',
    type,
    errorType = '',
    uiType,
    upperCased,
    errorUIColor = COLOR_TYPE.WHITE,
    showErrorBorder,
    ...rest
  } = props;

  const { onChange, value } = input;
  const {
    error,
    touched,
    active,
    modified,
    submitError,
    modifiedSinceLastSubmit,
    submitSucceeded,
  } = meta;

  const [showPass, toggleShowPass] = useState(false);
  const [clearInput, toggleClearInput] = useState(
    showClearInput && value !== '',
  );

  useEffect(() => {
    if (showClearInput) {
      toggleClearInput(value !== '');
    }
  });

  const onClearInputClick = () => {
    onChange('');
  };

  const hasError =
    (error && (touched || modified || submitSucceeded) && !active) ||
    (submitError && !modifiedSinceLastSubmit) ||
    showErrorBorder;

  return (
    <div className={classes.regInputWrapper}>
      <div className={classes.inputGroup}>
        {prefix && (
          <div
            className={classnames(classes.prefix, hasError && classes.error)}
          >
            {prefix}
          </div>
        )}
        <input
          className={classnames(
            classes.regInput,
            hasError && classes.error,
            uiType && classes[uiType],
            prefix && classes.prefixSpace,
            type === 'password' && classes.doubleIconInput,
          )}
          {...input}
          {...rest}
          onChange={e => {
            const currentValue = e.target.value;
            if (lowerCased) return onChange(currentValue.toLowerCase());
            if (upperCased) return onChange(currentValue.toUpperCase());
            onChange(currentValue);
          }}
          type={showPass ? 'text' : type}
          data-clear={clearInput || showCopyButton}
        />
        <ClearButton
          isVisible={(clearInput || onClose) && !loading}
          onClear={onClearInputClick}
          onClose={onClose}
          inputType={type}
          uiType={uiType}
        />
        <ShowPasswordIcon
          isVisible={clearInput && type === 'password'}
          showPass={showPass}
          toggleShowPass={toggleShowPass}
          uiType={uiType}
        />
        <CopyButton
          isVisible={showCopyButton}
          onClick={async () => {
            try {
              const data = await navigator.clipboard.readText();
              onChange(data);
            } catch (e) {
              console.error('Paste error: ', e);
            }
          }}
          uiType={uiType}
        />
        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={classnames(classes.inputIcon, classes.inputSpinnerIcon)}
          />
        )}
      </div>
      {!hideError && (
        <ErrorBadge
          error={error}
          hasError={hasError}
          submitError={submitError}
          type={errorType}
          color={errorUIColor}
        />
      )}
    </div>
  );
};

export default InputRedux;
