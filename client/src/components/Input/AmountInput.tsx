import React, { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import classes from './Input.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faDollarSign,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ErrorBadge } from './ErrorBadge';
import apis from '../../api';

export const INPUT_COLOR_SCHEMA = {
  BLACK_AND_WHITE: 'black_and_white',
};

type Props = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showCopyButton?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  upperCased?: boolean;
  lowerCased?: boolean;
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
};

const AmountInput: React.FC<Props & FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    debounceTimeout = 0,
    roe,
    colorSchema,
    onClose,
    hideError,
    showCopyButton,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
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

  const relationFormula = (val: any) => {
    let resultValue = Number(val);
    if (!resultValue) return 0;
    resultValue = isPrimaryExchange
      ? apis.fio.amountToSUF(resultValue)
      : apis.fio.sufToAmount(resultValue);
    return apis.fio.convert(resultValue, roe, isPrimaryExchange);
  };

  const firstExchangeLabel = 'FIO';
  const secondExchangeLabel = 'USDC';

  const { type, value, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const [isPrimaryExchange, setIsPrimaryExchange] = useState(true);
  const [clearInput, toggleClearInput] = useState(value !== '');
  const [secondValue, setSecondValue] = useState(0);

  useEffect(() => {
    setSecondValue(relationFormula(value));
  }, [value]);

  useEffect(() => {
    onChange(secondValue);
  }, [isPrimaryExchange]);

  const hasError =
    ((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
    (submitError && !modifiedSinceLastSubmit);
  useEffect(() => {
    toggleClearInput(value !== '');
  });

  const renderPrefixLabel = () => {
    return (
      <div
        className={classnames(
          classes.prefixLabel,
          classes[`prefixLabel${uiType}`],
        )}
      >
        {isPrimaryExchange ? firstExchangeLabel : secondExchangeLabel}
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
              if (lowerCased) return onChange(currentValue.toLowerCase());
              if (upperCased) return onChange(currentValue.toUpperCase());
              onChange(currentValue);
            }}
            type="number"
            data-clear={clearInput}
          />
        </div>

        <div className={classnames(classes.secondValue)}>
          {isPrimaryExchange && (
            <FontAwesomeIcon
              icon={faDollarSign}
              className={classnames(
                isBW && classes.bw,
                disabled && classes.disabled,
                uiType && classes[uiType],
              )}
            />
          )}
          <div className="px-1">{secondValue}</div>
          <div className="px-1">
            {!isPrimaryExchange ? firstExchangeLabel : secondExchangeLabel}
          </div>
          <FontAwesomeIcon
            icon={faExchangeAlt}
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
