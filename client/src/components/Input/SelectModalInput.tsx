import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { FieldRenderProps } from 'react-final-form';
import classnames from 'classnames';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { ErrorBadge } from './ErrorBadge';
import Modal from '../Modal/Modal';
import { ClearButton, PasteButton } from './InputActionButtons';
import { Label, LoadingIcon, PrefixLabel } from './StaticInputParts';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import { INPUT_COLOR_SCHEMA } from './TextInput';

import { getValueFromPaste, log } from '../../util/general';

import classes from './Input.module.scss';

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
  footerTitle?: string;
  notFoundText?: string;
  options?: { name: string; id: string }[];
  handleClose?: () => void;
  isBW?: boolean;
  isStringOptions?: boolean;
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
    isStringOptions,
    uiType,
    errorType = '',
    errorColor = '',
    title = 'Choose FIO Handle or Public Key',
    subTitle = 'Enter or select a FIO Handle or Public Key to send FIO tokens to',
    footerTitle = 'Past FIO Handles',
    notFoundText = 'Not found',
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
    options,
    show = false,
    onHide,
    isBW,
    inputRef,
    placeholder,
    ...rest
  } = props;

  const { type, value = '', onChange } = input;
  const { data } = meta;

  const [optionsList, setOptionsList] = useState(options);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isDirtyInputState, setIsDirtyInputState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!value) {
      setOptionsList(options);
    } else {
      const filteredOptions = options?.filter(
        (o: { name: string; id: string }) => {
          return (
            o.id.includes(value.toLowerCase()) ||
            o.name.includes(value.toLowerCase())
          );
        },
      );

      setOptionsList(filteredOptions);
    }
  }, [value, options]);

  const handleClose = () => {
    if (isLoading) return;

    onHide && onHide();
    setConfirmError(null);
    setIsDirtyInputState(false);
  };

  const handleConfirm = async () => {
    if (handleConfirmValidate) {
      setIsLoading(true);
      const validationResult = await handleConfirmValidate(value);
      if (validationResult.succeeded) {
        onChange(value);
        handleClose();
      } else {
        setConfirmError(validationResult.message);
      }
      setIsLoading(false);
    } else {
      onChange(value);
      handleClose();
    }
  };

  const isInputHasValue = value.length > 0;
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
                  value={value}
                  onChange={e => {
                    const currentValue = e.target.value || '';
                    if (onChangeFormat) {
                      return onChange(onChangeFormat(currentValue));
                    }
                    if (lowerCased) return onChange(currentValue.toLowerCase());
                    if (upperCased) return onChange(currentValue.toUpperCase());
                    onChange(currentValue);
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
                  onChange('');
                  setConfirmError(null);
                }}
                inputType={type}
                isBW={isBW}
                disabled={disabled}
                uiType={uiType}
              />
              <PasteButton
                isVisible={showPasteButton && !value}
                onClick={async () => {
                  try {
                    onChange((await getValueFromPaste()) || '');
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
              disabled={value === '' || !!confirmError || isLoading}
            />
          </div>

          <div className="mt-0 mb-3">
            <b>{footerTitle}</b>
          </div>
          {optionsList?.length ? (
            <div className={classes.optionsList}>
              {optionsList.map((option: { name: string; id: string }) => (
                <div
                  className={classes.option}
                  key={option.id + input.name}
                  onClick={() => {
                    input.onChange(option.id);
                    handleClose();
                  }}
                >
                  <div className={classnames(classes.logo, 'd-flex')}>
                    {option.name[0].toUpperCase()}
                  </div>
                  <div className="d-flex">
                    {typeof option === 'string' ? option : option.name}
                  </div>
                  <div className="d-flex ml-auto">
                    {typeof option === 'string' ? null : option.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={classes.notFound}>
              {optionsList ? notFoundText : 'loading...'}
            </div>
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
    options,
    placeholder,
    type,
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
  const [isStringOptions, setIsStringOptions] = useState(false);
  const [optionsList, setOptionsList] = useState([]);

  useEffect(() => {
    if (options?.length && typeof options[0] === 'string') {
      setIsStringOptions(true);
      setOptionsList(options.map((o: string) => ({ name: o, id: o })));
    } else setOptionsList(options);
  }, [options]);

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
            type={type || 'text'}
            placeholder={placeholder}
          />
        </div>
        {!loading && (
          <ChevronRightIcon
            className={classnames(classes.inputIcon, uiType && classes[uiType])}
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
        options={optionsList}
        isStringOptions={isStringOptions}
        inputRef={modalInputRef}
        onHide={handleCloseModal}
        handleConfirmValidate={handleConfirmValidate}
        isBW={isBW}
      />
    </div>
  );
};

export default SelectModalInput;
