import React from 'react';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import CancelIcon from '@mui/icons-material/Cancel';
import classnames from 'classnames';

import { CheckIconComponent } from '../CheckIconComponent';

import classes from './InputActionButtons.module.scss';

type ClearButtonProps = {
  isBW?: boolean;
  isIW?: boolean;
  isBG?: boolean;
  isBigDoubleIcon?: boolean;
  isMiddleDoubleIcon?: boolean;
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
  isBigDoubleIcon?: boolean;
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
  isBigDoubleIcon,
  ...rest
}) => {
  if (!navigator.clipboard?.readText || !isVisible) return null;

  return (
    <FontAwesomeIcon
      icon={{ prefix: 'far', iconName: 'clipboard' }}
      className={classnames(
        classes.inputIcon,
        uiType && classes[uiType],
        isBigDoubleIcon && classes.bigDoubleIcon,
      )}
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
  isIW,
  isBG,
  onClear,
  onClose,
  isBigDoubleIcon,
  isMiddleDoubleIcon,
}) => {
  if (!isVisible) return null;

  return (
    <CancelIcon
      className={classnames(
        classes.inputIcon,
        inputType === 'password' && classes.doubleIcon,
        isBigDoubleIcon && classes.bigDoubleIcon,
        isMiddleDoubleIcon && classes.middleDoubleIcon,
        isBW && classes.bw,
        isIW && classes.iw,
        isBG && classes.bg,
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

export const CheckedIcon: React.FC<DefaultProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className={classnames(
        classes.inputIcon,
        classes.hasAutoSizes,
        classes.hasDefaultCursor,
      )}
    >
      <CheckIconComponent isGreen fontSize="24px" />
    </div>
  );
};
