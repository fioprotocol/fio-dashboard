import React, { useEffect, useState, WheelEvent } from 'react';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';

import { ErrorBadge } from './ErrorBadge';
import { Label } from './StaticInputParts';
import { INPUT_COLOR_SCHEMA } from './TextInput';

import classes from './Input.module.scss';
import { Button } from 'react-bootstrap';
import InfoBadge from '../InfoBadge/InfoBadge';
import { BADGE_TYPES } from '../Badge/Badge';

export type StakeAmountInputProps = {
  colorSchema?: string;
  hideError?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  disabled?: boolean;
  showErrorBorder?: boolean;
  isHigh?: boolean;
  isSimple?: boolean;
  input: {
    'data-clear'?: boolean;
    value: string;
  };
  hasSmallText?: boolean;
  hasThinText?: boolean;
  maxValueLabel?: string;
  hasFioAddress: boolean;
  maxValue: string;
  maxAllowedValue: string;
};

export const StakeAmountInput = (
  props: StakeAmountInputProps & FieldRenderProps<StakeAmountInputProps>,
  ref: React.Ref<HTMLInputElement | null>,
) => {
  const {
    input,
    meta,
    maxValueLabel = 'Available Staked FIO Balance: ',
    maxValue,
    maxAllowedValue,
    hasFioAddress,
    colorSchema,
    hideError,
    uiType,
    errorType = '',
    errorColor = '',
    prefix = '',
    disabled,
    showErrorBorder,
    label,
    ...rest
  } = props;
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

  const maxAllowedValueInInput = Number(maxAllowedValue);

  const { value, onChange } = input;

  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const [isInputHasValue, toggleIsInputHasValue] = useState(value !== '');
  const [isMaxValue, setIsMaxValue] = useState(false);

  const hasError =
    ((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);

  useEffect(() => {
    toggleIsInputHasValue(value !== '');
    setIsMaxValue(Number(value) >= maxAllowedValueInInput);
  }, [value, maxAllowedValueInInput]);

  return (
    <div className={classes.regInputWrapper}>
      <Label label={label} uiType={uiType} />
      <InfoBadge
        containerClassname={classes.badge}
        type={BADGE_TYPES.INFO}
        show={!hasFioAddress && isMaxValue && maxAllowedValueInInput > 0}
        title="Max Amount"
        message="A small portion of FIO has been held in your available balance to ensure the transaction does not fail due to not having enough available FIO"
      />

      <div className={classes.inputGroup}>
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            prefix && classes.prefixSpace,
          )}
        >
          <input
            ref={ref}
            {...input}
            {...rest}
            onChange={e => {
              const currentValue = e.target.value;
              onChange(currentValue);
            }}
            onWheel={(event: WheelEvent<HTMLInputElement>) =>
              event.currentTarget.blur()
            }
            type="number"
            data-clear={isInputHasValue}
            disabled={disabled}
          />
        </div>

        <div className={classes.maxButtonContainer}>
          <Button onClick={() => onChange(maxAllowedValueInInput + '')}>
            Max
          </Button>
        </div>
      </div>
      <ErrorBadge
        useVisibility
        error={error}
        data={data}
        hasError={!hideError && !data.hideError && hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />
      {maxValue && (
        <div className={classes.additionalSubInfo}>
          {maxValueLabel}
          <b>{maxValue} FIO</b>
        </div>
      )}
    </div>
  );
};

const StakeAmountInputRef = React.forwardRef<
  HTMLInputElement,
  StakeAmountInputProps & FieldRenderProps<StakeAmountInputProps>
>(StakeAmountInput);

export default StakeAmountInputRef;
