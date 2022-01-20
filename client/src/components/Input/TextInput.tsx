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

type TextInputProps = {
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
  debounceTimeout?: number;
};

type ClearButtonProps = {
  isVisible: boolean;
  uiType?: string;
  isBW?: boolean;
  disabled?: boolean;
  inputType?: string;
  onClear: () => void;
  onClose?: (val: boolean) => void;
};

type LoadingIconProps = {
  isVisible?: boolean;
  uiType?: string;
  isBW?: boolean;
};

type PrefixLabelProps = {
  isVisible?: boolean;
  uiType?: string;
  label: string;
};

type PasswordIconProps = {
  isVisible: boolean;
  uiType?: string;
  disabled?: boolean;
  showPass?: boolean;
  toggleShowPass?: (val: boolean) => void;
};

export const ClearButton: React.FC<ClearButtonProps> = ({
  isVisible,
  inputType,
  uiType,
  disabled,
  isBW,
  onClear,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon="times-circle"
      className={classnames(
        classes.inputIcon,
        inputType === 'password' && classes.doubleIcon,
        isBW && classes.bw,
        disabled && classes.disabled,
        uiType && classes[uiType],
      )}
      onClick={() => {
        if (disabled) return;
        onClear();
        if (onClose) {
          onClose(false);
        }
      }}
    />
  );
};

export const LoadingIcon: React.FC<LoadingIconProps> = ({
  isVisible,
  uiType,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon={faSpinner}
      spin
      className={classnames(
        classes.inputIcon,
        classes.inputSpinnerIcon,
        uiType && classes[uiType],
      )}
    />
  );
};

export const PasswordIcon: React.FC<PasswordIconProps> = ({
  isVisible,
  uiType,
  disabled,
  showPass,
  toggleShowPass,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon={!showPass ? 'eye' : 'eye-slash'}
      className={classnames(
        classes.inputIcon,
        disabled && classes.disabled,
        uiType && classes[uiType],
      )}
      onClick={() => !disabled && toggleShowPass(!showPass)}
    />
  );
};

export const Label: React.FC<{ label?: string; uiType?: string }> = ({
  label,
  uiType,
}) => {
  if (!label?.length) return null;

  return (
    <div className={classnames(classes.label, uiType && classes[uiType])}>
      {label}
    </div>
  );
};

export const Prefix: React.FC<{ prefix?: string; hasError?: boolean }> = ({
  prefix,
  hasError,
}) => {
  if (!prefix?.length) return null;

  return (
    <div className={classnames(classes.prefix, hasError && classes.error)}>
      {prefix}
    </div>
  );
};

export const PrefixLabel: React.FC<PrefixLabelProps> = ({
  isVisible = true,
  label,
  uiType,
}) => {
  if (!isVisible || !label?.length) return null;

  return (
    <div
      className={classnames(
        classes.prefixLabel,
        classes[`prefixLabel${uiType}`],
      )}
    >
      {label}
    </div>
  );
};

export const TextInput: React.FC<TextInputProps &
  FieldRenderProps<TextInputProps>> = props => {
  const {
    input,
    meta,
    debounceTimeout = 0,
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
  const [isInputHasValue, toggleIsInputHasValue] = useState(value !== '');

  const hasError =
    ((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);

  useEffect(() => {
    toggleIsInputHasValue(value !== '');
  });

  const clearInputFn = () => {
    onChange('');
  };

  return (
    <div className={classes.regInputWrapper}>
      <Label label={label} uiType={uiType} />
      <div className={classes.inputGroup}>
        <Prefix prefix={prefix} hasError={hasError} />
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
          <PrefixLabel
            label={prefixLabel}
            isVisible={!(active || !value)}
            uiType={uiType}
          />
          <DebounceInput
            inputRef={rest.ref}
            debounceTimeout={debounceTimeout}
            {...input}
            {...rest}
            onChange={e => {
              const currentValue = e.target.value;
              if (lowerCased) return onChange(currentValue.toLowerCase());
              if (upperCased) return onChange(currentValue.toUpperCase());
              onChange(currentValue);
            }}
            type={showPass ? 'text' : type}
            data-clear={isInputHasValue}
          />
        </div>
        <ClearButton
          isVisible={(isInputHasValue || onClose) && !disabled && !loading}
          onClear={clearInputFn}
          onClose={onClose}
          inputType={type}
          isBW={isBW}
          disabled={disabled}
          uiType={uiType}
        />
        <PasswordIcon
          isVisible={isInputHasValue && type === 'password'}
          showPass={showPass}
          toggleShowPass={toggleShowPass}
          uiType={uiType}
        />
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
        <LoadingIcon isVisible={loading} uiType={uiType} />
      </div>
      <ErrorBadge
        error={error}
        data={data}
        hasError={!hideError && !data.hideError && hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />
    </div>
  );
};

export default TextInput;
