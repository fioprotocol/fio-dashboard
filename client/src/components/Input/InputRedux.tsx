import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { ErrorBadge, COLOR_TYPE } from './ErrorBadge';
import {
  ClearButton,
  PasteButton,
  ShowPasswordIcon,
} from './InputActionButtons';

import { getValueFromPaste, log } from '../../util/general';

import classes from './Input.module.scss';

import { FieldValue } from './Field';
import { AnyObject } from '../../types';

export const INPUT_UI_STYLES = {
  BLACK_LIGHT: 'blackLight',
  BLACK_WHITE: 'blackWhite',
};

export type InputProps = {
  input: { value: FieldValue; onChange: (val: FieldValue) => void } & AnyObject;
  meta: {
    error: string;
    touched?: boolean;
    active?: boolean;
    modified?: boolean;
    submitError?: boolean;
    modifiedSinceLastSubmit?: boolean;
    submitSucceeded?: boolean;
  };
};

export type FieldProps = {
  hideError?: boolean;
  loading?: boolean;
  lowerCased?: boolean;
  onClose?: (isOpen: boolean) => void;
  showClearInput?: boolean;
  showPasteButton?: boolean;
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
    showPasteButton = false,
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
  }, [value, showClearInput]);

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
          data-clear={clearInput || showPasteButton}
        />
        <ClearButton
          isVisible={!!(clearInput || onClose) && !loading}
          onClear={onClearInputClick}
          onClose={onClose}
          inputType={type}
          uiType={uiType}
        />
        <ShowPasswordIcon
          isVisible={!!clearInput && type === 'password'}
          showPass={showPass}
          toggleShowPass={toggleShowPass}
          uiType={uiType}
        />
        <PasteButton
          isVisible={showPasteButton}
          onClick={async () => {
            try {
              onChange(await getValueFromPaste());
            } catch (e) {
              log.error('Paste error: ', e);
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
