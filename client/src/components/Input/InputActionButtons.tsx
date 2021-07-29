import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import classes from './InputActionButtons.module.scss';

type ClearInputProps = {
  color?: string;
  type: string;
  onClick: () => void;
};

export const ClearInput: React.FC<ClearInputProps> = props => {
  const { color, onClick, type } = props;
  return (
    <FontAwesomeIcon
      icon="times-circle"
      className={classnames(
        classes.inputIcon,
        type === 'password' && classes.doubleIcon,
      )}
      style={color && { color: color }}
      onClick={onClick}
    />
  );
};

type ShowPasswordProps = {
  color?: string;
  onClick: () => void;
  showPass: boolean;
};

export const ShowPassword: React.FC<ShowPasswordProps> = props => {
  const { color, onClick, showPass } = props;
  return (
    <FontAwesomeIcon
      icon={!showPass ? 'eye' : 'eye-slash'}
      className={classes.inputIcon}
      style={color && { color: color }}
      onClick={onClick}
    />
  );
};

type CopyButtonProps = {
  color?: string;
  onClick: () => void;
};

export const CopyButton: React.FC<CopyButtonProps> = props => {
  const { color, onClick } = props;
  return (
    <FontAwesomeIcon
      icon={{ prefix: 'far', iconName: 'clipboard' }}
      className={classes.inputIcon}
      style={color && { color: color }}
      onClick={onClick}
    />
  );
};
