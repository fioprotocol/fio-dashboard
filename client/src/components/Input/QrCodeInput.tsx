import React, { useState, WheelEvent } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';

import { CopyButton, QrCodeButton } from './InputActionButtons';
import { ErrorBadge } from './ErrorBadge';
import { copyToClipboard } from '../../util/general';
import { Label, LoadingIcon, PrefixLabel, Prefix } from './StaticInputParts';
import { INPUT_COLOR_SCHEMA, TextInputProps } from './TextInput';

import classes from './Input.module.scss';

export type QrModalProps = {
  isVisible: boolean;
  inputValue: string;
  handleClose: () => void;
};

type Props = TextInputProps & {
  isBlue: boolean;
  renderModalComponent: (props: QrModalProps) => HTMLDivElement;
};

export const QrCodeInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  Props & FieldRenderProps<Props>
> = (
  props: Props & FieldRenderProps<Props>,
  ref?: React.Ref<HTMLInputElement>,
) => {
  const {
    input,
    meta,
    debounceTimeout = 0,
    colorSchema,
    hideError,
    showCopyButton = true,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    prefix = '',
    prefixLabel = '',
    upperCased = false,
    lowerCased = false,
    disabled = true,
    showErrorBorder,
    isLowHeight,
    renderModalComponent,
    isBlue = true,
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

  const [isVisibleQrModal, setIsVisibleQrModal] = useState(false);

  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const hasError =
    ((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);

  const closeQr = () => setIsVisibleQrModal(false);
  const showQr = () => setIsVisibleQrModal(true);

  const handleCopy = () => copyToClipboard(value);

  if (type === 'hidden') return null;

  return (
    <div className={classes.regInputWrapper}>
      {renderModalComponent({
        inputValue: value,
        isVisible: isVisibleQrModal,
        handleClose: closeQr,
      })}
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
            showCopyButton && classes.hasPasteButton,
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
            inputRef={ref}
            debounceTimeout={debounceTimeout}
            {...input}
            {...rest}
            className={classnames(isBlue && classes.blue)}
            onChange={e => {
              const currentValue = e.target.value;
              if (lowerCased) return onChange(currentValue.toLowerCase());
              if (upperCased) return onChange(currentValue.toUpperCase());
              onChange(currentValue);
            }}
            onWheel={(event: WheelEvent<HTMLInputElement>) => {
              if (type === 'number') event.currentTarget.blur();
            }}
            type={type}
            disabled={disabled}
          />
        </div>
        <LoadingIcon isVisible={loading} uiType={uiType} />
        <CopyButton
          isSecondary={true}
          isVisible={showCopyButton && !!value}
          onClick={handleCopy}
          uiType={uiType}
        />
        <QrCodeButton
          isVisible={showCopyButton && !!value}
          onClick={showQr}
          uiType={uiType}
        />
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

const QrCodeInputRef = React.forwardRef<
  HTMLInputElement,
  Props & FieldRenderProps<Props>
>(QrCodeInput);

export default QrCodeInputRef;
