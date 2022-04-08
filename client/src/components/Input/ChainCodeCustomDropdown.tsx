import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import EditableSelect from './EditableSelect/EditableSelect';
import { Label } from './StaticInputParts';
import { ErrorBadge } from './ErrorBadge';

import { EditableProps } from './EditableSelect/EditableSelect';

import classes from './Input.module.scss';

type Props = {
  customValue: { id: string; name: string };
  label?: string;
  uiType?: string;
  input: {
    value: string;
  };
  errorType?: string;
  errorColor?: string;
  hideError?: boolean;
  placeholder?: string;
} & EditableProps;

const ChainCodeCustomDropdown: React.FC<Props &
  FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    label,
    uiType,
    errorType = '',
    errorColor = '',
    hideError,
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
    (((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
      (submitError && !modifiedSinceLastSubmit)) &&
    !hideError;

  return (
    <>
      <Label label={label} uiType={uiType} />
      <EditableSelect {...props} hasError={hasError} />
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
