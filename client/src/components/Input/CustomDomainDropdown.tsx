import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import EditableSelect from './EditableSelect/EditableSelect';
import { Label } from './StaticInputParts';
import { ErrorBadge } from './ErrorBadge';

import { EditableProps } from './EditableSelect/EditableSelect';

import classes from './Input.module.scss';

type Props = {
  label?: string;
  uiType?: string;
  input: {
    value: string;
  };
  errorType?: string;
  errorColor?: string;
  hideError?: boolean;
  hasErrorForced?: boolean;
} & EditableProps;

export const CustomDomainDropdown: React.FC<Props &
  FieldRenderProps<string>> = props => {
  const {
    actionButtonText,
    containerHasFullWidth,
    disabled,
    defaultMenuIsOpen,
    errorColor = '',
    errorType = '',
    forceReset,
    hasErrorForced,
    hasMarginBottom,
    hideError,
    input,
    inputPrefix,
    isHigh,
    label,
    loading,
    meta,
    noShadow,
    options,
    placeholder,
    prefix,
    removeFilter,
    uiType,
    upperCased,
    onBlur,
    onClear,
    onInputChange,
    toggleToCustom,
  } = props;

  const {
    error,
    data,
    touched,
    active,
    submitError,
    modifiedSinceLastSubmit,
    submitSucceeded,
  } = meta;

  const hasError =
    hasErrorForced ||
    ((error || data?.error) && (touched || submitSucceeded) && !active) ||
    (submitError && !modifiedSinceLastSubmit);

  const editableSelectProps: EditableProps = {
    actionButtonText,
    containerHasFullWidth,
    disabled,
    defaultMenuIsOpen,
    forceReset,
    hasError,
    hasMarginBottom,
    input,
    inputPrefix,
    isHigh,
    loading,
    meta,
    noShadow,
    options,
    placeholder,
    prefix,
    removeFilter,
    uiType,
    upperCased,
    onBlur,
    onClear,
    onInputChange,
    toggleToCustom,
  };

  return (
    <>
      <Label label={label} uiType={uiType} />
      <EditableSelect {...editableSelectProps} />
      {!hideError && (
        <div className={classes.regInputWrapper}>
          <ErrorBadge
            error={error}
            data={data}
            hasError={!hideError && !data?.hideError && hasError}
            type={errorType}
            color={errorColor}
            submitError={submitError}
          />
        </div>
      )}
    </>
  );
};
