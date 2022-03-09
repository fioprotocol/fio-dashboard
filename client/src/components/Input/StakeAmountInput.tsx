import React, { useEffect, useState, WheelEvent } from 'react';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';

import { ErrorBadge } from './ErrorBadge';
import { Label } from './StaticInputParts';
import { INPUT_COLOR_SCHEMA } from './TextInput';
import { BADGE_TYPES } from '../Badge/Badge';
import InfoBadge from '../InfoBadge/InfoBadge';
import MathOp from '../../util/math';

import classes from './Input.module.scss';

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
  availableTitle?: string;
  hasFioAddress: boolean;
  availableValue: string;
  maxValue?: string;
};

export const StakeAmountInput = (
  props: StakeAmountInputProps & FieldRenderProps<StakeAmountInputProps>,
  ref: React.Ref<HTMLInputElement | null>,
) => {
  const {
    input,
    meta,
    availableTitle = 'Available FIO Balance',
    availableValue = '0',
    maxValue = availableValue,
    hasFioAddress,
    colorSchema,
    hideError,
    uiType,
    errorType = '',
    errorColor = '',
    prefix = '',
    disabled,
    showErrorBorder,
    label = 'FIO Stake Amount',
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
    setIsMaxValue(new MathOp(value || 0).gte(maxValue));
  }, [value, maxValue]);

  return (
    <div className={classes.regInputWrapper}>
      <Label label={label} uiType={uiType} />
      <InfoBadge
        className={classes.badge}
        type={BADGE_TYPES.INFO}
        show={!hasFioAddress && isMaxValue && new MathOp(maxValue).gt(0)}
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
            onWheel={(event: WheelEvent<HTMLInputElement>) =>
              event.currentTarget.blur()
            }
            type="number"
            data-clear={isInputHasValue}
            disabled={disabled}
          />
        </div>

        <div className={classes.maxButtonContainer}>
          <Button onClick={() => onChange(maxValue)}>Max</Button>
        </div>
      </div>
      <ErrorBadge
        error={error}
        data={data}
        hasError={!hideError && !data.hideError && hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />
      <div className={classes.additionalSubInfo}>
        <span>{availableTitle + ': '}</span>
        <b>{availableValue} FIO</b>
      </div>
    </div>
  );
};

const StakeAmountInputRef = React.forwardRef<
  HTMLInputElement,
  StakeAmountInputProps & FieldRenderProps<StakeAmountInputProps>
>(StakeAmountInput);

export default StakeAmountInputRef;
