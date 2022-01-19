import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import classes from './Input.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ErrorBadge } from './ErrorBadge';
import Modal from '../Modal/Modal';
import { CopyButton } from './InputActionButtons';
import { INPUT_COLOR_SCHEMA } from './TextInput';

type Props = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showCopyButton?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  prefixLabel?: string;
  modalPlaceholder?: string;
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
  modalTitle?: string;
  modalSubTitle?: string;
};

type ModalProps = {
  show?: boolean;
  hasError?: boolean;
  subTitle?: string;
  title?: string;
  optionsList?: string[];
  handleClose?: () => void;
  clearInputFn?: () => void;
  clearInput?: boolean;
  isBW?: boolean;
  inputRef: MutableRefObject<HTMLInputElement>;
};

const SelectModal: React.FC<Props &
  FieldRenderProps<Props> &
  ModalProps> = props => {
  const {
    input,
    meta,
    modalPlaceholder,
    onClose,
    showCopyButton,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    title = 'Choose FIO Crypto Handle or Public Key',
    subTitle = 'Enter or select a FIO Crypto Handle or Public Key to send FIO tokens to',
    footerTitle = 'Post FIO Crypto Handle or Public Keys',
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
    optionsList = [],
    show,
    hasError,
    handleClose,
    clearInputFn,
    clearInput,
    isBW,
    inputRef,
    ...rest
  } = props;

  const { type, value, onChange } = input;
  const { error, data, submitError } = meta;

  return (
    <Modal
      show={show}
      closeButton={true}
      onClose={handleClose}
      isSimple={true}
      isWide={true}
    >
      <div className={classes.optionsContainer}>
        <h3 className={classes.title}>{title}</h3>
        <div className={classes.subtitle}>{subTitle}</div>
        <div className="mt-3">
          <div className={classnames(classes.regInputWrapper, 'mb-0')}>
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
                <DebounceInput
                  inputRef={inputRef}
                  debounceTimeout={0}
                  {...input}
                  {...rest}
                  onChange={e => {
                    const currentValue = e.target.value;
                    if (lowerCased) return onChange(currentValue.toLowerCase());
                    if (upperCased) return onChange(currentValue.toUpperCase());
                    onChange(currentValue);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      inputRef.current.blur();
                      if (!error) handleClose();
                    }
                  }}
                  type="text"
                  placeholder={modalPlaceholder || rest.placeholder}
                  data-clear={clearInput}
                />
              </div>
              {(clearInput || onClose) && !disabled && !loading && (
                <FontAwesomeIcon
                  icon="times-circle"
                  className={classnames(
                    classes.inputIcon,
                    type === 'password' && classes.doubleIcon,
                    isBW && classes.bw,
                    disabled && classes.disabled,
                    uiType && classes[uiType],
                  )}
                  onClick={() => {
                    if (disabled) return;
                    clearInputFn();
                    if (onClose) {
                      onClose(false);
                    }
                  }}
                />
              )}
              {showCopyButton && !value && (
                <CopyButton
                  onClick={async () => {
                    try {
                      const clipboardStr = await navigator.clipboard.readText();
                      onChange(clipboardStr);
                      inputRef.current.focus();
                    } catch (e) {
                      console.error('Paste error: ', e);
                    }
                  }}
                  uiType={uiType}
                  disabled={!navigator.clipboard.readText}
                />
              )}
            </div>
            <ErrorBadge
              useVisibility
              error={error}
              data={data}
              hasError={hasError}
              type={errorType}
              color={errorColor}
              submitError={submitError}
            />
          </div>

          <div className="mt-0 mb-3">
            <b>{footerTitle}</b>
          </div>
          {optionsList?.length ? (
            <div className={classes.optionsList}>
              {optionsList.map((name: string) => (
                <div
                  className={classes.option}
                  key={input.name + name}
                  onClick={input.onChange.bind(null, name)}
                >
                  <div className={classes.logo}>{name[0].toUpperCase()}</div>
                  <div>{name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={classes.notFound}>Not found</div>
          )}
        </div>
      </div>
    </Modal>
  );
};
const SelectModalInput: React.FC<Props & FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    colorSchema,
    hideError,
    showCopyButton,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    prefixLabel = '',
    showErrorBorder,
    isLowHeight,
    label,
    options = [],
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

  const { type, value, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const modalInputRef = useRef<HTMLInputElement>(null);

  const [showModal, toggleShowModal] = useState(false);
  const [optionsList, setOptionsList] = useState(options);
  const [clearInput, toggleClearInput] = useState(value !== '');

  useEffect(() => {
    if (showModal) modalInputRef.current.focus();
  }, [showModal]);

  useEffect(() => {
    if (!value) {
      setOptionsList(options);
    } else
      setOptionsList(
        options.filter((o: string) => {
          return o.includes(value);
        }),
      );
  }, [value, options]);
  const handleCloseModal = () => {
    toggleShowModal(false);
  };

  const handleOpenModal = () => {
    toggleShowModal(true);
  };

  const hasError =
    !hideError &&
    !data.hideError &&
    (((error || data.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
      (submitError && !modifiedSinceLastSubmit));
  useEffect(() => {
    toggleClearInput(value !== '');
  });

  const clearInputFn = () => {
    onChange('');
    modalInputRef.current.focus();
  };

  const renderPrefixLabel = () => {
    if (!prefixLabel) return null;
    if (active || !value) return null;

    return (
      <div
        className={classnames(
          classes.prefixLabel,
          classes[`prefixLabel${uiType}`],
        )}
      >
        {prefixLabel}
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
      <div className={classes.inputGroup} onClick={handleOpenModal}>
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && !showModal && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            showCopyButton && classes.hasCopyButton,
            type === 'password' && classes.doubleIconInput,
            isLowHeight && classes.lowHeight,
          )}
        >
          {renderPrefixLabel()}
          <input disabled={true} {...rest} value={input.value} type="text" />
        </div>
        {!loading && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className={classnames(
              classes.inputIcon,
              uiType && classes[uiType],
              classes.medium,
            )}
          />
        )}
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
      <ErrorBadge
        error={error}
        data={data}
        hasError={!showModal && hasError}
        type={errorType}
        color={errorColor}
        submitError={submitError}
      />

      <SelectModal
        {...props}
        show={showModal}
        optionsList={optionsList}
        inputRef={modalInputRef}
        handleClose={handleCloseModal}
        clearInputFn={clearInputFn}
        clearInput={clearInput}
        isBW={isBW}
        hasError={hasError}
      />
    </div>
  );
};

export default SelectModalInput;
