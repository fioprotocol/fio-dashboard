import React from 'react';

import classnames from 'classnames';

import Loader from '../Loader/Loader';

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
    <Loader
      hasSmallSize
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

export const Label: React.FC<{
  label?: string | React.ReactNode;
  uiType?: string;
  hasItalic?: boolean;
}> = ({ label, uiType, hasItalic }) => {
  if (!label) return null;

  return (
    <div
      className={classnames(
        classes.label,
        uiType && classes[uiType],
        hasItalic && classes.hasItalic,
      )}
    >
      {label}
    </div>
  );
};

export const LabelSuffix: React.FC<{
  text?: string;
  uiType?: string;
  withBottomMargin?: boolean;
}> = ({ text, uiType, withBottomMargin }) => {
  if (!text) return null;

  return (
    <span
      className={classnames(
        classes.labelSuffix,
        uiType && classes[uiType],
        withBottomMargin && classes.withBottomMargin,
      )}
    >
      {text}
    </span>
  );
};

export const Prefix: React.FC<{
  prefix?: string;
  hasError?: boolean;
  uiType?: string;
  highZIndex?: boolean;
}> = ({ prefix, hasError, uiType, highZIndex }) => {
  if (!prefix?.length) return null;

  return (
    <div
      className={classnames(
        classes.prefix,
        hasError && classes.error,
        uiType && classes[uiType],
        highZIndex && classes.highZIndex,
      )}
    >
      {prefix}
    </div>
  );
};

export const Suffix: React.FC<{
  hasIconsLeft?: boolean;
  suffix: string;
  uiType?: string;
  disabled?: boolean;
  disabledInputGray?: boolean;
}> = ({ disabled, disabledInputGray, hasIconsLeft, suffix, uiType }) => {
  if (suffix && !suffix.length) return null;

  return (
    <div
      className={classnames(
        classes.suffix,
        uiType && classes[uiType],
        hasIconsLeft && classes.hasIconsLeft,
        disabled && disabledInputGray && classes.disabledGray,
      )}
    >
      {suffix}
    </div>
  );
};
