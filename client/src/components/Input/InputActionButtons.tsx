import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './InputActionButtons.module.scss';

type DefaultProps = {
  onClick: () => void;
  uiType?: string;
};

type ClearInputProps = {
  type: string;
};

export const ClearInput: React.FC<ClearInputProps & DefaultProps> = props => {
  const { onClick, type, uiType } = props;
  return (
    <FontAwesomeIcon
      icon="times-circle"
      className={classnames(
        classes.inputIcon,
        type === 'password' && classes.doubleIcon,
        uiType && classes[uiType],
      )}
      onClick={onClick}
    />
  );
};

type ShowPasswordProps = {
  showPass: boolean;
};

export const ShowPassword: React.FC<ShowPasswordProps &
  DefaultProps> = props => {
  const { onClick, showPass, uiType } = props;
  return (
    <FontAwesomeIcon
      icon={!showPass ? 'eye' : 'eye-slash'}
      className={classnames(classes.inputIcon, uiType && classes[uiType])}
      onClick={onClick}
    />
  );
};

type CopyButtonProps = {
  disabled: boolean;
};

export const CopyButton: React.FC<DefaultProps & CopyButtonProps> = props => {
  const { onClick, uiType, disabled } = props;
  return (
    <FontAwesomeIcon
      icon={{ prefix: 'far', iconName: 'clipboard' }}
      className={classnames(
        classes.inputIcon,
        uiType && classes[uiType],
        disabled && classes.disabled,
      )}
      onClick={onClick}
    />
  );
};
