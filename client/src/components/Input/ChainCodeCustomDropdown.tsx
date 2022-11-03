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
} & EditableProps;

const ChainCodeCustomDropdown: React.FC<Props &
  FieldRenderProps<string>> = props => {
  const {
    input,
    meta,
    label,
    uiType,
    errorType = '',
    errorColor = '',
    hideError,
    options,
    placeholder,
    prefix,
    isHigh,
    noShadow,
    disabled,
    forceReset,
    loading,
    upperCased,
    onBlur,
    onClear,
    onInputChange,
    toggleToCustom,
  } = props;
  const { value } = input;
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

  const hasError =
    ((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);

  const editableSelectProps: EditableProps = {
    options,
    input,
    placeholder,
    prefix,
    isHigh,
    noShadow,
    disabled,
    hasError,
    meta,
    forceReset,
    loading,
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
    </>
  );
};

export default ChainCodeCustomDropdown;
