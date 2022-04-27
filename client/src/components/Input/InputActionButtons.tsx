import React from 'react';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './InputActionButtons.module.scss';

type ClearButtonProps = {
  isBW?: boolean;
  disabled?: boolean;
  inputType?: string;
  onClear: () => void;
  onClose?: (val: boolean) => void;
};

type ShowPasswordIconProps = {
  disabled?: boolean;
  showPass: boolean;
  toggleShowPass: (val: boolean) => void;
};

type PasteButtonProps = {
  onClick: () => void;
};

type CopyButtonProps = {
  isSecondary?: boolean;
  onClick: () => void;
};

type DefaultProps = {
  isVisible: boolean;
  uiType?: string;
};

export const QrCodeButton: React.FC<PasteButtonProps & DefaultProps> = ({
  onClick,
  uiType,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon="qrcode"
      className={classnames(classes.inputIcon, uiType && classes[uiType])}
      onClick={onClick}
    />
  );
};

export const CopyButton: React.FC<CopyButtonProps & DefaultProps> = ({
  onClick,
  uiType,
  isVisible,
  isSecondary = false,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon={{ prefix: 'far', iconName: 'copy' }}
      className={classnames(
        classes.inputIcon,
        isSecondary ? classes.doubleIcon : '',
        uiType && classes[uiType],
      )}
      onClick={onClick}
    />
  );
};

export const PasteButton: React.FC<PasteButtonProps &
  DefaultProps &
  Partial<FontAwesomeIconProps>> = ({
  onClick,
  uiType,
  isVisible,
  ...rest
}) => {
  if (!navigator.clipboard?.readText || !isVisible) return null;

  return (
    <FontAwesomeIcon
      icon={{ prefix: 'far', iconName: 'clipboard' }}
      className={classnames(classes.inputIcon, uiType && classes[uiType])}
      onClick={onClick}
      {...rest}
    />
  );
};

export const ClearButton: React.FC<ClearButtonProps & DefaultProps> = ({
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

export const ShowPasswordIcon: React.FC<ShowPasswordIconProps &
  DefaultProps> = ({
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
