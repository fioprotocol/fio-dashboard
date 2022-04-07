import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ErrorBadge } from './ErrorBadge';
import Modal from '../Modal/Modal';
import { PasteButton } from './InputActionButtons';
import { Label, LoadingIcon, PrefixLabel } from './StaticInputParts';
import { ClearButton } from './InputActionButtons';

import { INPUT_COLOR_SCHEMA } from './TextInput';

import { getValueFromPaste, log } from '../../util/general';

import classes from './Input.module.scss';
import SubmitButton from '../common/SubmitButton/SubmitButton';

type Props = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showPasteButton?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  prefixLabel?: string;
  modalPlaceholder?: string;
  placeholder?: string;
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
  onChangeFormat?: (val: string) => string;
  handleConfirmValidate?: (
    val: string,
  ) => Promise<{
    succeeded: boolean;
    message: string;
  }>;
};

type ModalProps = {
  show?: boolean;
  subTitle?: string;
  title?: string;
  options?: string[];
  handleClose?: () => void;
  isBW?: boolean;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onHide?: () => void;
};

const SelectModal: React.FC<Props &
  FieldRenderProps<Props> &
  ModalProps> = props => {
  const {
    input,
    meta,
    modalPlaceholder,
    onChangeFormat,
    handleConfirmValidate,
    showPasteButton = false,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    title = 'Choose FIO Crypto Handle or Public Key',
    subTitle = 'Enter or select a FIO Crypto Handle or Public Key to send FIO tokens to',
    footerTitle = 'Past FIO Crypto Handles',
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
    options = [],
    show = false,
    onHide,
    isBW,
    inputRef,
    placeholder,
    ...rest
  } = props;

  const { type, value = '', onChange } = input;
  const { data } = meta;

  const [inputValue, setInputValue] = useState(value);
  const [optionsList, setOptionsList] = useState(options);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isDirtyInputState, setIsDirtyInputState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!inputValue) {
      setOptionsList(options);
    } else
      setOptionsList(
        options.filter((o: string) => {
          return o.includes(inputValue.toLowerCase());
        }),
      );
  }, [inputValue, options]);

  useEffect(() => {
    if (inputValue !== value) setInputValue(value);
  }, [value, show]);

  const handleClose = () => {
    if (isLoading) return;

    onHide && onHide();
    setConfirmError(null);
    setIsDirtyInputState(false);
  };

  const handleConfirm = async () => {
    if (handleConfirmValidate) {
      setIsLoading(true);
      const validationResult = await handleConfirmValidate(inputValue);
      if (validationResult.succeeded) {
        onChange(inputValue);
        handleClose();
      } else {
        setConfirmError(validationResult.message);
      }
      setIsLoading(false);
    } else {
      onChange(inputValue);
      handleClose();
    }
  };

  const isInputHasValue = inputValue.length > 0;
  const hasError = !!(confirmError && isDirtyInputState);

  return (
    <Modal
      show={show}
      closeButton={true}
      onClose={handleClose}
      isSimple={true}
      isWide={true}
      hasDefaultCloseColor={true}
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
                  showPasteButton && classes.hasPasteButton,
                  isLowHeight && classes.lowHeight,
                )}
              >
                <DebounceInput
                  inputRef={inputRef}
                  debounceTimeout={0}
                  {...input}
                  {...rest}
                  value={inputValue}
                  onChange={e => {
                    const currentValue = e.target.value || '';
                    if (onChangeFormat) {
                      return setInputValue(onChangeFormat(currentValue));
                    }
                    if (lowerCased)
                      return setInputValue(currentValue.toLowerCase());
                    if (upperCased)
                      return setInputValue(currentValue.toUpperCase());
                    setInputValue(currentValue);
                  }}
                  onKeyDown={e => {
                    setConfirmError(null);
                    setIsDirtyInputState(true);
                    if (e.key === 'Enter') {
                      inputRef.current?.blur();
                      handleConfirm();
                    }
                  }}
                  type="text"
                  placeholder={modalPlaceholder || placeholder}
                  data-clear={isInputHasValue}
                />
              </div>
              <ClearButton
                isVisible={
                  isInputHasValue && !disabled && !isLoading && !loading
                }
                onClear={() => {
                  setInputValue('');
                  setConfirmError(null);
                }}
                inputType={type}
                isBW={isBW}
                disabled={disabled}
                uiType={uiType}
              />
              <PasteButton
                isVisible={showPasteButton && !inputValue}
                onClick={async () => {
                  try {
                    setInputValue((await getValueFromPaste()) || '');
                    inputRef.current?.focus();
                  } catch (e) {
                    log.error('Paste error: ', e);
                  }
                }}
                uiType={uiType}
              />
              <LoadingIcon isVisible={isLoading} uiType={uiType} />
            </div>
            <ErrorBadge
              useVisibility
              error={confirmError}
              data={data}
              hasError={hasError}
              type={errorType}
              color={errorColor}
            />
          </div>

          <div className="d-flex justify-content-center align-items-center mt-0 mb-4">
            <SubmitButton
              text="Done"
              onClick={handleConfirm}
              disabled={inputValue === '' || !!confirmError || isLoading}
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
                  onClick={() => {
                    input.onChange(name);
                    handleClose();
                  }}
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
    showPasteButton,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    prefixLabel = '',
    showErrorBorder,
    isLowHeight,
    label,
    options = [],
    placeholder,
    handleConfirmValidate,
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

  const { value } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const modalInputRef = useRef<HTMLInputElement>(null);

  const [showModal, toggleShowModal] = useState(false);

  useEffect(() => {
    if (showModal) modalInputRef.current?.focus();
  }, [showModal]);

  const handleCloseModal = () => {
    toggleShowModal(false);
  };

  const handleOpenModal = () => {
    toggleShowModal(true);
  };

  const hasError =
    !hideError &&
    !data?.hideError &&
    (((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) ||
      (submitError && !modifiedSinceLastSubmit));

  return (
    <div className={classes.regInputWrapper}>
      <Label label={label} uiType={uiType} />
      <div
        className={classnames(classes.inputGroup, classes.cursorPointer)}
        onClick={handleOpenModal}
      >
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && !showModal && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            showPasteButton && classes.hasPasteButton,
            isLowHeight && classes.lowHeight,
          )}
        >
          <PrefixLabel
            label={prefixLabel}
            isVisible={!(active || !value)}
            uiType={uiType}
          />
          <input
            className={classes.selectModalInput}
            disabled={true}
            value={input.value}
            readOnly
            type="text"
            placeholder={placeholder}
          />
        </div>
        {!loading && (
          <FontAwesomeIcon
            icon="chevron-right"
            className={classnames(
              classes.inputIcon,
              uiType && classes[uiType],
              classes.medium,
            )}
          />
        )}
        <LoadingIcon isVisible={loading} uiType={uiType} />
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
        options={options}
        inputRef={modalInputRef}
        onHide={handleCloseModal}
        handleConfirmValidate={handleConfirmValidate}
        isBW={isBW}
      />
    </div>
  );
};

export default SelectModalInput;
