import React, { ChangeEvent, useEffect, useState, WheelEvent } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';

import {
  ClearButton,
  PasteButton,
  ShowPasswordIcon,
} from './InputActionButtons';
import { Label, LoadingIcon, Prefix, PrefixLabel } from './StaticInputParts';
import { ErrorBadge } from './ErrorBadge';
import ConnectWalletButton from '../ConnectWallet/ConnectWalletButton/ConnectWalletButton';

import {
  getValueFromPaste,
  log,
  transformInputValues,
} from '../../util/general';
import { useFieldElemActiveState } from '../../util/hooks';

import { ConnectProviderType } from '../../hooks/externalWalletsConnection/useInitializeProviderConnection';

import classes from './Input.module.scss';
import metamaskIcon from '../../assets/images/metamask.svg';

export const INPUT_UI_STYLES = {
  BLACK_LIGHT: 'blackLight',
  BLACK_WHITE: 'blackWhite',
  INDIGO_WHITE: 'indigoWhite',
};

export const INPUT_COLOR_SCHEMA = {
  BLACK_AND_WHITE: 'black_and_white',
  INDIGO_AND_WHITE: 'indigo_and_white',
};

export type TextInputProps = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showConnectWalletButton?: boolean;
  connectWalletModalText?: string;
  showPasteButton?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  prefix?: string;
  prefixLabel?: string;
  suffix?: boolean;
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
  additionalOnchangeAction?: (val: string) => void;
  wFioBalance?: string;
  connectWalletProps: ConnectProviderType;
  withoutBottomMargin?: boolean;
  hasItalicLabel?: boolean;
  hasErrorForced?: boolean;
};

export const TextInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  TextInputProps & FieldRenderProps<TextInputProps>
> = (
  props: TextInputProps & FieldRenderProps<TextInputProps>,
  ref?: React.Ref<HTMLInputElement>,
) => {
  const {
    input,
    meta,
    debounceTimeout = 0,
    colorSchema,
    onClose,
    hideError,
    showPasteButton = false,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    prefix = '',
    prefixLabel = '',
    suffix,
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
    label,
    additionalOnchangeAction,
    connectWalletProps,
    showConnectWalletButton,
    connectWalletModalText,
    wFioBalance,
    withoutBottomMargin,
    hasItalicLabel,
    hasErrorForced,
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
  const isIW = colorSchema === INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE;

  const [showPass, toggleShowPass] = useState(false);

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [isInputHasValue, toggleIsInputHasValue] = useState(value !== '');
  const [
    fieldElemActive,
    setFieldElemActive,
    setFieldElemInactive,
  ] = useFieldElemActiveState();

  const hasError =
    hasErrorForced ||
    ((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active &&
      !fieldElemActive) ||
    (submitError && !modifiedSinceLastSubmit);

  useEffect(() => {
    toggleIsInputHasValue(value !== '');
  }, [value]);

  const clearInputFn = () => {
    onChange('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.type !== 'change') return;

    const currentValue = e.target.value;

    if (lowerCased) {
      const transformedValue = currentValue.toLowerCase();
      transformInputValues({
        e,
        transformedValue,
        onChange,
      });
      return;
    }
    if (upperCased) {
      const transformedValue = currentValue.toUpperCase();
      transformInputValues({
        e,
        transformedValue,
        onChange,
      });
      return;
    }
    onChange(currentValue);
    if (additionalOnchangeAction) additionalOnchangeAction(currentValue);
  };

  if (type === 'hidden') return null;

  return (
    <div
      className={classnames(classes.regInputWrapper, {
        [classes.withoutBottomMargin]: withoutBottomMargin,
      })}
    >
      <Label label={label} uiType={uiType} hasItalic={hasItalicLabel} />
      <div className={classes.inputGroup}>
        <Prefix
          prefix={prefix}
          suffix={suffix}
          hasError={hasError}
          uiType={uiType}
        />
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            isIW && classes.iw,
            !suffix && prefix && classes.prefixSpace,
            showPasteButton && classes.hasPasteButton,
            type === 'password' && classes.doubleIconInput,
            isLowHeight && classes.lowHeight,
            isWalletConnected ? classes.dark : '',
          )}
        >
          <PrefixLabel
            label={prefixLabel}
            isVisible={!(active || !value)}
            uiType={uiType}
          />
          {isWalletConnected ? (
            <>
              <img
                src={metamaskIcon}
                className={classes.connectedWalletIcon}
                alt="metamask"
              />
              <div className={classes.fullCircle} />
            </>
          ) : null}
          <DebounceInput
            inputRef={ref}
            debounceTimeout={debounceTimeout}
            {...input}
            {...rest}
            onChange={handleInputChange}
            onWheel={(event: WheelEvent<HTMLInputElement>) => {
              if (type === 'number') event.currentTarget.blur();
            }}
            type={showPass ? 'text' : type}
            data-clear={isInputHasValue}
            disabled={disabled || isWalletConnected}
            className={isWalletConnected ? classes.dark : ''}
          />
        </div>
        {connectWalletProps ? (
          <ConnectWalletButton
            isVisible={showConnectWalletButton}
            handleAddressChange={val => {
              input.onChange(val);
              if (additionalOnchangeAction) additionalOnchangeAction(val);
            }}
            inputValue={value}
            setIsWalletConnected={setIsWalletConnected}
            isWalletConnected={isWalletConnected}
            description={connectWalletModalText}
            wFioBalance={wFioBalance}
            {...connectWalletProps}
          />
        ) : null}
        <ClearButton
          isVisible={
            (isInputHasValue || !!onClose) &&
            (isWalletConnected ? true : !disabled) &&
            !loading
          }
          onClear={clearInputFn}
          onClose={onClose}
          inputType={type}
          isBW={isBW}
          isIW={isIW}
          isBigDoubleIcon={showConnectWalletButton && !isWalletConnected}
          disabled={isWalletConnected ? false : disabled}
          uiType={isWalletConnected ? 'whiteBlack' : uiType}
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
              log.error('Paste error: ', e);
            }
          }}
          onMouseDown={setFieldElemActive}
          onMouseUp={setFieldElemInactive}
          uiType={uiType}
          isBigDoubleIcon={showConnectWalletButton}
        />
        <LoadingIcon isVisible={loading} uiType={uiType} />
      </div>
      <ErrorBadge
        error={error}
        data={data}
        hasError={!hideError && !data?.hideError && hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />
    </div>
  );
};

const TextInputRef = React.forwardRef<
  HTMLInputElement,
  TextInputProps & FieldRenderProps<TextInputProps>
>(TextInput);

export default TextInputRef;
