import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FieldRenderProps } from 'react-final-form';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { ErrorBadge } from './ErrorBadge';
import { CheckedIcon, PasteButton } from './InputActionButtons';
import CustomDropdown from '../CustomDropdown';
import Loader from '../Loader/Loader';
import { getValueFromPaste, log } from '../../util/general';

import classes from './Input.module.scss';

export const INPUT_COLOR_SCHEMA = {
  BLACK_AND_WHITE: 'black_and_white',
};

export const INPUT_UI_STYLES = {
  BLACK_LIGHT: 'blackLight',
  BLACK_WHITE: 'blackWhite',
  BLACK_VIOLET: 'blackViolet',
  BLACK_WHITE_WITH_BORDER: 'blackWhiteBorder',
};

type Props = {
  colorSchema?: string;
  onClose?: (isOpen: boolean) => void;
  hideError?: boolean;
  showPasteButton?: boolean;
  showCheckIcon?: boolean;
  loading?: boolean;
  uiType?: string;
  errorType?: string;
  errorColor?: string;
  prefix?: string;
  prefixLabel?: string;
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
  hasErrorForced?: boolean;
  hasSmallText?: boolean;
  hasThinText?: boolean;
  showPreview?: boolean;
  showTitle?: boolean;
  wrapperClasses?: string;
};

const Input: React.FC<Props & FieldRenderProps<Props>> = props => {
  const {
    input,
    meta,
    colorSchema,
    onClose,
    hideError,
    showPasteButton = false,
    showCheckIcon,
    loading,
    uiType,
    errorType = '',
    errorColor = '',
    prefix = '',
    prefixLabel = '',
    upperCased = false,
    lowerCased = false,
    disabled,
    showErrorBorder,
    isLowHeight,
    customChange,
    label,
    options,
    isHigh,
    isSimple,
    hasErrorForced,
    hasSmallText,
    hasThinText,
    showPreview = true,
    showTitle = false,
    wrapperClasses = '',
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
  const { type, value, name, onChange } = input;
  const isBW = colorSchema === INPUT_COLOR_SCHEMA.BLACK_AND_WHITE;

  const [showPass, toggleShowPass] = useState(false);
  const [clearInput, toggleClearInput] = useState(value !== '');
  const [previewUrl, setPreviewUrl] = useState('');

  const hasError =
    hasErrorForced ||
    ((error || data?.error) &&
      (touched || modified || submitSucceeded || !!value) &&
      !active) || // todo: remove !active to show red border on focused field. make debounce on create account user field
    (submitError && !modifiedSinceLastSubmit);
  useEffect(() => {
    toggleClearInput(value !== '');
  }, [value]);

  const clearInputFn = () => {
    onChange('');
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
      <label className={classnames(classes.label, uiType && classes[uiType])}>
        {label}
      </label>
    );
  const regularInput = (
    <div className={classes.regInputWrapper}>
      {renderLabel()}
      <div className={classes.inputGroup}>
        {prefix && (
          <div
            className={classnames(classes.prefix, hasError && classes.error)}
          >
            {prefix}
          </div>
        )}
        <div
          className={classnames(
            classes.regInput,
            (hasError || showErrorBorder) && classes.error,
            uiType && classes[uiType],
            isBW && classes.bw,
            prefix && classes.prefixSpace,
            showPasteButton && classes.hasPasteButton,
            (type === 'password' || showCheckIcon) && classes.doubleIconInput,
            isLowHeight && classes.lowHeight,
          )}
        >
          {renderPrefixLabel()}
          <input
            title={showTitle ? value : null}
            disabled={disabled}
            {...input}
            {...rest}
            onChange={e => {
              const currentValue = e.target.value;
              if (lowerCased) return onChange(currentValue.toLowerCase());
              if (upperCased) return onChange(currentValue.toUpperCase());
              onChange(currentValue);
            }}
            type={showPass ? 'text' : type}
            data-clear={clearInput}
          />
        </div>
        {(clearInput || onClose) && !disabled && !loading && (
          <CancelIcon
            className={classnames(
              classes.inputIcon,
              (type === 'password' || showCheckIcon) && classes.doubleIcon,
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
        {clearInput &&
          type === 'password' &&
          (showPass ? (
            <VisibilityOffIcon
              className={classnames(
                classes.inputIcon,
                disabled && classes.disabled,
                uiType && classes[uiType],
              )}
              onClick={() => !disabled && toggleShowPass(!showPass)}
            />
          ) : (
            <VisibilityIcon
              className={classnames(
                classes.inputIcon,
                disabled && classes.disabled,
                uiType && classes[uiType],
              )}
              onClick={() => !disabled && toggleShowPass(!showPass)}
            />
          ))}
        <CheckedIcon isVisible={showCheckIcon && !loading} />
        <PasteButton
          isVisible={showPasteButton && !value}
          onClick={async () => {
            try {
              onChange(await getValueFromPaste());
            } catch (e) {
              log.error('Paste error: ', e);
            }
          }}
          uiType={uiType}
        />
        {loading && (
          <Loader
            hasSmallSize
            className={classnames(
              classes.inputIcon,
              classes.inputSpinnerIcon,
              uiType && classes[uiType],
            )}
          />
        )}
      </div>
      {!hideError && !data?.hideError && (
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

  if (type === 'text') {
    return regularInput;
  }

  if (type === 'number') {
    return regularInput;
  }

  if (type === 'password' && name !== 'pin') {
    return regularInput;
  }

  if (type === 'file') {
    return (
      <div className={classes.fileContainer}>
        <input
          {...input}
          {...rest}
          onChange={e => {
            const currentValue = e.target.value;
            onChange(currentValue);

            const file = e.target.files?.length && e.target.files[0];

            if (file) {
              const fileUrl = window.URL.createObjectURL(file);
              setPreviewUrl(fileUrl);
              customChange && customChange(file, fileUrl);
            }
          }}
          type={type}
          className={classes.fileInput}
        />
        {showPreview && value && previewUrl ? (
          <img className={classes.image} src={previewUrl} alt="preview" />
        ) : (
          <>
            <ImageIcon className={classes.icon} />
            <p className={classes.text}>Drop Image Here</p>
          </>
        )}
      </div>
    );
  }

  if (type === 'hidden') return null;

  if (type === 'dropdown') {
    return (
      <>
        {renderLabel()}
        <CustomDropdown
          options={options}
          {...input}
          {...rest}
          disabled={disabled}
          value={value}
          isHigh={isHigh}
          isSimple={isSimple}
        />
      </>
    );
  }

  if (type === 'checkbox')
    return (
      <label className={classnames(classes.checkboxContainer, wrapperClasses)}>
        <input disabled={disabled} {...rest} {...input} />
        <CheckBoxIcon
          className={classnames(
            classes.checked,
            uiType && classes[uiType],
            hasSmallText && classes.smallText,
          )}
        />
        <CheckBoxOutlineBlankIcon
          className={classnames(
            classes.unchecked,
            uiType && classes[uiType],
            hasSmallText && classes.smallText,
          )}
        />
        <p
          className={classnames(
            classes.label,
            uiType && classes[uiType],
            hasSmallText && classes.smallText,
            hasThinText && classes.hasThinText,
          )}
        >
          {label}
        </p>
      </label>
    );

  return <input {...input} {...props} />;
};

export default Input;
