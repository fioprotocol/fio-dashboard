import React, { useEffect, useRef, useState, WheelEvent } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps, useForm } from 'react-final-form';
import classnames from 'classnames';
import classes from './Input.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorBadge } from './ErrorBadge';
import apis from '../../api';
import { INPUT_COLOR_SCHEMA } from './TextInput';
import { Label, LoadingIcon, PrefixLabel } from './StaticInputParts';
import exchangeIcon from '../../assets/images/exchange.svg';

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
  roe: number;
  amountCurrencyCode?: string;
  exchangeAmountCurrencyCode?: string;
  nativeAmountFieldName?: string;
};

const AmountInput: React.FC<Props & FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    debounceTimeout = 0,
    roe,
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
  }, [value]);

  useEffect(() => {
    if (inputRef != null && inputRef.current != null && initRef.current) {
      inputRef.current.focus();
    }

    if (!initRef.current) initRef.current = true;
  }, [isPrimaryExchange, inputRef]);

  const hasError =
    !hideError &&
    !data.hideError &&
    (((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
      (submitError && !modifiedSinceLastSubmit));

  return (
    <div className={classes.regInputWrapper}>
      <Label label={label} uiType={uiType} />
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
            {(isPrimaryExchange ? exchangedValue : value) || EMPTY_VALUE}
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
            src={exchangeIcon}
          />
        </div>

        <LoadingIcon isVisible={loading} uiType={uiType} />
      </div>
      <ErrorBadge
        error={error}
        data={data}
        hasError={!hideError && !data.hideError && hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />
    </div>
  );
};

export default AmountInput;
