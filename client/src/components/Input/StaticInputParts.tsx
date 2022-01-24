import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import classes from './Input.module.scss';

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

export const LoadingIcon: React.FC<LoadingIconProps> = ({
  isVisible,
  uiType,
}) => {
  if (!isVisible) return null;

  return (
    <FontAwesomeIcon
      icon="spinner"
      spin
      className={classnames(
        classes.inputIcon,
        classes.inputSpinnerIcon,
        uiType && classes[uiType],
      )}
    />
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
