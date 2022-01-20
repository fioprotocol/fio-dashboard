import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CopyButton } from './InputActionButtons';
import { ErrorBadge } from './ErrorBadge';
import { getValueFromPaste } from '../../util/general';

import classes from './Input.module.scss';

export const INPUT_COLOR_SCHEMA = {
  BLACK_AND_WHITE: 'black_and_white',
};

type Props = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showCopyButton?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  prefix?: string;
  prefixLabel?: string;
  upperCased?: boolean;
  lowerCased?: boolean;
  disabled?: boolean;
  showErrorBorder?: boolean;
  isHigh?: boolean;
  isSimple?: boolean;
  input: {
    'data-clear'?: boolean;
    value: string;
  };
  hasSmallText?: boolean;
  hasThinText?: boolean;
};

const TextInput: React.FC<Props & FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    isDebounce = false,
    colorSchema,
    onClose,
    hideError,
    showCopyButton,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    prefix = '',
    prefixLabel = '',
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
    label,
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
    submitSucceeded,
  } = meta;

  const { type, value, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const [showPass, toggleShowPass] = useState(false);
  const [clearInput, toggleClearInput] = useState(value !== '');

  const hasError =
    ((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);
  useEffect(() => {
    toggleClearInput(value !== '');
  });

  const clearInputFn = () => {
    onChange('');
  };

  const renderPrefixLabel = () => {
    if (!prefixLabel) return null;
    if (active || !value) return null;

    return (
      <div
        className={classnames(
          classes.prefixLabel,
          classes[`prefixLabel${uiType}`],
        )}
      >
        {prefixLabel}
      </div>
    );
  };

  const renderLabel = () =>
    label && (
      <div className={classnames(classes.label, uiType && classes[uiType])}>
        {label}
      </div>
    );

  return (
    <div className={classes.regInputWrapper}>
      {renderLabel()}
      <div className={classes.inputGroup}>
        {prefix && (
          <div
            className={classnames(classes.prefix, hasError && classes.error)}
          >
            {prefix}
          </div>
        )}
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            prefix && classes.prefixSpace,
            showCopyButton && classes.hasCopyButton,
            type === 'password' && classes.doubleIconInput,
            isLowHeight && classes.lowHeight,
          )}
        >
          {renderPrefixLabel()}
          {isDebounce ? (
            <DebounceInput
              inputRef={rest.ref}
              debounceTimeout={1000}
              {...input}
              {...rest}
              onChange={e => {
                const currentValue = e.target.value;
                if (lowerCased) return onChange(currentValue.toLowerCase());
                if (upperCased) return onChange(currentValue.toUpperCase());
                onChange(currentValue);
              }}
              type={showPass ? 'text' : type}
              data-clear={clearInput}
            />
          ) : (
            <input
              disabled={disabled}
              {...input}
              {...rest}
              onChange={e => {
                const currentValue = e.target.value;
                if (lowerCased) return onChange(currentValue.toLowerCase());
                if (upperCased) return onChange(currentValue.toUpperCase());
                onChange(currentValue);
              }}
              type={showPass ? 'text' : type}
              data-clear={clearInput}
            />
          )}
        </div>
        {(clearInput || onClose) && !disabled && !loading && (
          <FontAwesomeIcon
            icon="times-circle"
            className={classnames(
              classes.inputIcon,
              type === 'password' && classes.doubleIcon,
              isBW && classes.bw,
              disabled && classes.disabled,
              uiType && classes[uiType],
            )}
            onClick={() => {
              if (disabled) return;
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
            className={classnames(
              classes.inputIcon,
              disabled && classes.disabled,
              uiType && classes[uiType],
            )}
            onClick={() => !disabled && toggleShowPass(!showPass)}
          />
        )}
        {showCopyButton && !value && (
          <CopyButton
            onClick={async () => {
              try {
                onChange(await getValueFromPaste());
              } catch (e) {
                console.error('Paste error: ', e);
              }
            }}
            uiType={uiType}
          />
        )}
        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={classnames(
              classes.inputIcon,
              classes.inputSpinnerIcon,
              uiType && classes[uiType],
            )}
          />
        )}
      </div>
      {!hideError && !data.hideError && (
        <ErrorBadge
          error={error}
          data={data}
          hasError={hasError}
          type={errorType}
          color={errorColor}
          submitError={submitError}
        />
      )}
    </div>
  );
};

export default TextInput;
