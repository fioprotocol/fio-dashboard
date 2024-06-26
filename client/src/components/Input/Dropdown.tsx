import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { Label, LabelSuffix } from './StaticInputParts';
import { ErrorBadge } from './ErrorBadge';
import CustomDropdown from '../CustomDropdown';

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
  description?: string;
  dropdownClassNames?: string;
  controlClassNames?: string;
  placeholderClassNames?: string;
  menuClassNames?: string;
  arrowCloseClassNames?: string;
  arrowOpenClassNames?: string;
  optionItemClassNames?: string;
  optionButtonClassNames?: string;
  defaultOptionValue?: { id: string; name: string };
  toggleToCustom?: (isCustom: boolean) => void;
  actionOnChange?: () => void;
};

const Dropdown: React.FC<DropdownProps & FieldRenderProps<DropdownProps>> = ({
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
  description,
  withoutMarginBottom = true,
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

  const { value } = input;

  const hasError =
    ((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);

  return (
    <>
      <Label label={label} uiType={uiType} />
      <LabelSuffix text={description} uiType={uiType} withBottomMargin={true} />
      <CustomDropdown
        options={options}
        {...input}
        {...rest}
        value={value}
        isHigh={isHigh}
        isSimple={isSimple}
      />
      {!hideError && !data?.hideError && (
        <div className={classes.regInputWrapper}>
          <ErrorBadge
            error={error}
            data={data}
            hasError={hasError}
            type={errorType}
            color={errorColor}
            submitError={submitError}
          />
        </div>
      )}
    </>
  );
};

export default Dropdown;
