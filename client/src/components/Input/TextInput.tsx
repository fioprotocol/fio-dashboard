import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';

import {
  PasteButton,
  ClearButton,
  ShowPasswordIcon,
} from './InputActionButtons';
import { ErrorBadge } from './ErrorBadge';
import { getValueFromPaste } from '../../util/general';
import { Label, LoadingIcon, PrefixLabel, Prefix } from './StaticInputParts';

import classes from './Input.module.scss';

export const INPUT_UI_STYLES = {
  BLACK_LIGHT: 'blackLight',
  BLACK_WHITE: 'blackWhite',
};

export const INPUT_COLOR_SCHEMA = {
  BLACK_AND_WHITE: 'black_and_white',
};

type TextInputProps = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showPasteButton?: boolean;
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

export const TextInput: React.FC<TextInputProps &
  FieldRenderProps<TextInputProps>> = props => {
  const {
    input,
    meta,
    debounceTimeout = 0,
    colorSchema,
    onClose,
    hideError,
    showPasteButton,
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

  if (type === 'hidden') return null;

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
            showPasteButton && classes.hasPasteButton,
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
        <ShowPasswordIcon
          isVisible={isInputHasValue && type === 'password'}
          showPass={showPass}
          toggleShowPass={toggleShowPass}
          uiType={uiType}
        />
        <PasteButton
          isVisible={showPasteButton && !value}
          onClick={async () => {
            try {
              onChange(await getValueFromPaste());
            } catch (e) {
              console.error('Paste error: ', e);
            }
          }}
          uiType={uiType}
        />
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
