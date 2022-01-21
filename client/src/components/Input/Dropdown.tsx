import CustomDropdown from '../CustomDropdown';
import React from 'react';
import { Label } from './StaticInputParts';
import { ErrorBadge } from './ErrorBadge';
import { FieldRenderProps } from 'react-final-form';
import classes from './Input.module.scss';

type DropdownProps = {
  hideError?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  disabled?: boolean;
  isHigh?: boolean;
  isSimple?: boolean;
  isWhite?: boolean;
  input: {
    'data-clear'?: boolean;
    value: string;
  };
};

const Dropdown = ({
  input,
  meta,
  uiType,
  label,
  options,
  isHigh,
  isSimple,
  errorType = '',
  errorColor = '',
  hideError,
  ...rest
}: DropdownProps & FieldRenderProps<DropdownProps>) => {
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

  const { value, onChange } = input;

  const hasError =
    ((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);

  return (
    <>
      <Label label={label} uiType={uiType} />
      <CustomDropdown
        options={options}
        onChange={onChange}
        {...input}
        {...rest}
        value={value}
        isHigh={isHigh}
        isSimple={isSimple}
        isFormField={true}
      />
      <div className={classes.regInputWrapper}>
        <ErrorBadge
          error={error}
          data={data}
          hasError={!hideError && !data.hideError && hasError}
          type={errorType}
          color={errorColor}
          submitError={submitError}
        />
      </div>
    </>
  );
};

export default Dropdown;
