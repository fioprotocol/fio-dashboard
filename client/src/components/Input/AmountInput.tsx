import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps, useForm } from 'react-final-form';
import classnames from 'classnames';
import classes from './Input.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { ErrorBadge } from './ErrorBadge';
import apis from '../../api';
import { INPUT_COLOR_SCHEMA } from './TextInput';
import exchangeIcon from '../../assets/images/exchange.svg';

type Props = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showCopyButton?: boolean;
  loading?: boolean;
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
    showCopyButton,
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

  const relationFormula = (val: string, isReverse: boolean = false) => {
    let valueToExchange = Number(val);
    if (!valueToExchange) return '0.00';
    valueToExchange = !isReverse
      ? apis.fio.amountToSUF(valueToExchange)
      : valueToExchange;
    return (!isReverse
      ? apis.fio.convertFioToUsdc(valueToExchange, roe)
      : apis.fio.convertUsdcToFio(valueToExchange, roe)
    ).toString();
  };

  const { type, value, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const [isPrimaryExchange, setIsPrimaryExchange] = useState(true);
  const [clearInput, toggleClearInput] = useState(value !== '');
  const [exchangedValue, exchangeValue] = useState('0.00');

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
  });

  const hasError =
    !hideError &&
    !data.hideError &&
    (((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
      (submitError && !modifiedSinceLastSubmit));

  const renderPrefixLabel = () => {
    return (
      <div
        className={classnames(
          classes.prefixLabel,
          classes[`prefixLabel${uiType}`],
        )}
      >
        {isPrimaryExchange ? amountCurrencyCode : exchangeAmountCurrencyCode}
      </div>
    );
  };

  const renderLabel = () =>
    label && (
      <div className={classnames(classes.label, uiType && classes[uiType])}>
        {label}
      </div>
    );

  return (
    <div className={classes.regInputWrapper}>
      {renderLabel()}
      <div className={classes.inputGroup}>
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            showCopyButton && classes.hasCopyButton,
            type === 'password' && classes.doubleIconInput,
            isLowHeight && classes.lowHeight,
          )}
        >
          {renderPrefixLabel()}
          <DebounceInput
            className={classes.amountInput}
            inputRef={rest.ref}
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
            data-clear={clearInput}
          />
        </div>

        <div className={classnames(classes.exchangeValue)}>
          {isPrimaryExchange && (
            <FontAwesomeIcon
              icon={faDollarSign}
              className={classnames(
                isBW && classes.bw,
                disabled && classes.disabled,
                uiType && classes[uiType],
                uiType && classes.exchangeIconItem,
              )}
            />
          )}
          <div className={classes.exchangeTextItem}>
            {isPrimaryExchange ? exchangedValue : value}
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

        {loading && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={classnames(
              classes.inputIcon,
              classes.inputSpinnerIcon,
              uiType && classes[uiType],
            )}
          />
        )}
      </div>
      {!hideError && !data.hideError && (
        <ErrorBadge
          error={error}
          data={data}
          hasError={hasError}
          type={errorType}
          color={errorColor}
          submitError={submitError}
        />
      )}
    </div>
  );
};

export default AmountInput;
