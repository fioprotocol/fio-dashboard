import React, { useEffect, useRef, useState, WheelEvent } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps, useForm } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { ErrorBadge } from './ErrorBadge';
import { Label, LoadingIcon, PrefixLabel } from './StaticInputParts';
import Amount from '../common/Amount';
import InfoBadge from '../InfoBadge/InfoBadge';

import { useFieldElemActiveState, useRoe } from '../../util/hooks';
import MathOp from '../../util/math';

import apis from '../../api';

import { INPUT_COLOR_SCHEMA } from './TextInput';
import { BADGE_TYPES } from '../Badge/Badge';

import exchangeIcon from '../../assets/images/exchange.svg';

import classes from './Input.module.scss';

const EMPTY_VALUE = '0.00';

type Props = {
  colorSchema?: string;
  hideError?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  disabled?: boolean;
  showErrorBorder?: boolean;
  input: {
    'data-clear'?: boolean;
    value: string;
  };
  debounceTimeout?: number;
  amountCurrencyCode?: string;
  exchangeAmountCurrencyCode?: string;
  nativeAmountFieldName?: string;
  availableTitle?: string;
  availableValue?: string;
  maxValue?: string;
};

const AmountInput: React.FC<Props & FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    availableTitle = 'Available FIO Balance',
    availableValue = '0',
    maxValue = availableValue,
    debounceTimeout = 0,
    colorSchema,
    hideError,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    disabled,
    showErrorBorder,
    isLowHeight,
    label,
    amountCurrencyCode = 'FIO',
    exchangeAmountCurrencyCode = 'USDC',
    nativeAmountFieldName,
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

  const { change } = useForm();

  const roe = useRoe();
  const inputRef = useRef<HTMLInputElement>(null);
  const initRef = useRef(false);

  // todo: extent formula to use currencyCode
  const relationFormula = (val: string, isReverse: boolean = false) => {
    let valueToExchange = Number(val);
    if (!valueToExchange) return '';
    valueToExchange = !isReverse
      ? apis.fio.amountToSUF(valueToExchange)
      : valueToExchange;
    return (!isReverse
      ? apis.fio.convertFioToUsdc(valueToExchange, roe)
      : apis.fio.convertUsdcToFio(valueToExchange, roe)
    ).toString();
  };

  const { value, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const [isPrimaryExchange, setIsPrimaryExchange] = useState(true);
  const [clearInput, toggleClearInput] = useState(value !== '');
  const [exchangedValue, exchangeValue] = useState('');
  const [isMaxValue, setIsMaxValue] = useState(false);
  const [
    fieldElemActive,
    setFieldElemActive,
    setFieldElemInactive,
  ] = useFieldElemActiveState();

  useEffect(() => {
    if (isPrimaryExchange) exchangeValue(relationFormula(value));
    if (nativeAmountFieldName) {
      change(
        nativeAmountFieldName,
        apis.fio.amountToSUF(Number(value)).toString(),
      );
    }
  }, [value]);

  useEffect(() => {
    if (!isPrimaryExchange) onChange(relationFormula(exchangedValue, true));
  }, [exchangedValue]);

  useEffect(() => {
    toggleClearInput(value !== '');
    setIsMaxValue(new MathOp(value || 0).gte(maxValue));
  }, [value, maxValue]);

  useEffect(() => {
    if (inputRef != null && inputRef.current != null && initRef.current) {
      inputRef.current.focus();
    }

    if (!initRef.current) initRef.current = true;
  }, [isPrimaryExchange, inputRef]);

  const setMaxAmount = () => {
    if (isPrimaryExchange) {
      onChange(maxValue);
    } else {
      exchangeValue(relationFormula(maxValue));
      // workaround for exchange formula inaccuracy by changing value directly after useEffect
      requestAnimationFrame(() => onChange(maxValue));
    }
  };

  const hasError =
    !hideError &&
    !data?.hideError &&
    (((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active &&
      !fieldElemActive) ||
      (submitError && !modifiedSinceLastSubmit));

  return (
    <div className={classes.regInputWrapper}>
      <Label label={label} uiType={uiType} />
      <InfoBadge
        className={classes.badge}
        type={BADGE_TYPES.INFO}
        show={
          isMaxValue &&
          new MathOp(maxValue).gt(0) &&
          new MathOp(maxValue).lt(availableValue)
        }
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
            isLowHeight && classes.lowHeight,
          )}
        >
          <PrefixLabel
            label={
              isPrimaryExchange
                ? amountCurrencyCode
                : exchangeAmountCurrencyCode
            }
            uiType={uiType}
          />
          <DebounceInput
            className={classes.amountInput}
            inputRef={inputRef}
            debounceTimeout={debounceTimeout}
            {...input}
            {...rest}
            onChange={e => {
              const currentValue = e.target.value;
              if (isPrimaryExchange) {
                onChange(currentValue);
              } else exchangeValue(currentValue);
            }}
            value={isPrimaryExchange ? value : exchangedValue}
            type="number"
            onWheel={(event: WheelEvent<HTMLInputElement>) =>
              event.currentTarget.blur()
            }
            data-clear={clearInput}
            step="any"
          />
        </div>

        <div className={classnames(classes.exchangeValue)}>
          {isPrimaryExchange && (
            <FontAwesomeIcon
              icon="dollar-sign"
              className={classnames(
                isBW && classes.bw,
                disabled && classes.disabled,
                uiType && classes[uiType],
                uiType && classes.exchangeIconItem,
              )}
            />
          )}
          <div className={classes.exchangeTextItem}>
            <Amount
              value={
                (isPrimaryExchange ? exchangedValue : value) || EMPTY_VALUE
              }
            />
          </div>
          <div className={classes.exchangeTextItem}>
            {!isPrimaryExchange
              ? amountCurrencyCode
              : exchangeAmountCurrencyCode}
          </div>
          <img
            className={classnames(
              classes.switchIcon,
              isBW && classes.bw,
              disabled && classes.disabled,
              uiType && classes[uiType],
            )}
            onClick={() => {
              if (disabled) return;
              setIsPrimaryExchange(!isPrimaryExchange);
            }}
            onMouseDown={setFieldElemActive}
            onMouseUp={setFieldElemInactive}
            src={exchangeIcon}
            alt=""
          />

          {new MathOp(maxValue || 0).gt(0) && (
            <div
              className={classes.maxButtonContainer}
              onMouseDown={setFieldElemActive}
              onMouseUp={setFieldElemInactive}
            >
              <Button onClick={setMaxAmount}>Max</Button>
            </div>
          )}
        </div>

        <LoadingIcon isVisible={loading} uiType={uiType} />
      </div>
      <ErrorBadge
        error={error}
        data={data}
        hasError={hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />
      {new MathOp(availableValue || 0).gt(0) && (
        <div className={classes.additionalSubInfo}>
          <span>{availableTitle + ': '}</span>
          <b>{availableValue} FIO</b>
        </div>
      )}
    </div>
  );
};

export default AmountInput;
