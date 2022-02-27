import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import CustomDropdown from '../CustomDropdown';
import { Label } from './StaticInputParts';
import classes from './Input.module.scss';
import { ErrorBadge } from './ErrorBadge';

type Props = {
  options: { id: string; name: string }[];
  customValue: { id: string; name: string };
  toggleToCustom: (isCustom: boolean) => void;
  hasAutoWidth?: boolean;
  isShort?: boolean;
  isSimple?: boolean;
  isFormField?: boolean;
  isHigh?: boolean;
  label?: string;
  uiType?: string;
  input: {
    value: string;
  };
};

const ChainCodeCustomDropdown: React.FC<Props &
  FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    options,
    customValue,
    toggleToCustom,
    placeholder,
    hasAutoWidth,
    isShort,
    isSimple,
    isHigh,
    label,
    uiType,
    errorType = '',
    errorColor = '',
    hideError,
    isFormField,
  } = props;
  const { onChange, value } = input;
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
    ((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);

  return (
    <>
      <Label label={label} uiType={uiType} />
      <CustomDropdown
        onChange={onChange}
        options={options}
        value={value}
        customValue={customValue}
        toggleToCustom={toggleToCustom}
        placeholder={placeholder}
        isShort={isShort}
        isSimple={isSimple}
        isFormField={isFormField}
        isWhite={true}
        hasAutoWidth={hasAutoWidth}
        isHigh={isHigh}
        hasError={hasError}
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

export default ChainCodeCustomDropdown;
