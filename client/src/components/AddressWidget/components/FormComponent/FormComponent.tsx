import React from 'react';
import { Field, Form, useForm } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';

import SubmitButton from '../../../common/SubmitButton/SubmitButton';
import TextInput, {
  INPUT_COLOR_SCHEMA,
  INPUT_UI_STYLES,
} from '../../../Input/TextInput';
import NotificationBadge from '../../../NotificationBadge';

import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';
import { ROUTES } from '../../../../constants/routes';

import { AddressWidgetNotification } from '../../../../types';

import classes from './FormComponent.module.scss';

type Props = {
  buttonText?: string;
  classNameForm?: string;
  disabled?: boolean;
  disabledInput?: boolean;
  disabledInputGray?: boolean;
  links?: {
    getCryptoHandle: React.ReactNode;
  };
  isReverseColors?: boolean;
  isTransparent?: boolean;
  suffixText?: string;
  lowerCased?: boolean;
  convert?: (value: string) => string;
  formatOnFocusOut?: boolean;
  loading?: boolean;
  notification?: AddressWidgetNotification;
  customHandleSubmit?: ({
    address,
  }: {
    address: string;
  }) => Promise<void> | void;
  showSubmitButton?: boolean;
  placeHolderText?: string;
  onInputChanged?: (value: string) => string;
};

type ActionButtonProps = {
  buttonText?: string;
  disabled?: boolean;
  isTransparent?: boolean;
  isWhiteBordered?: boolean;
  links?: {
    getCryptoHandle: React.ReactNode;
  };
  loading?: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = props => {
  const {
    buttonText = 'GET IT',
    disabled,
    isTransparent,
    isWhiteBordered,
    links,
    loading,
  } = props;
  const form = useForm();

  if (links && links.getCryptoHandle) {
    const registeredField = form.getRegisteredFields();
    const fieldValue: string = registeredField[0]
      ? form.getFieldState(registeredField[0]).value
      : '';

    const link =
      links.getCryptoHandle.toString() + `?${registeredField[0]}=${fieldValue}`;

    return (
      <a
        className={`${classes.button} d-flex justify-content-center`}
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        <SubmitButton
          disabled={disabled}
          isButtonType={true}
          hasLowHeight={true}
          text={buttonText}
          hasSmallText={true}
          isWhiteBordered={isWhiteBordered}
          isTransparent={isTransparent}
          loading={loading}
        />
      </a>
    );
  }

  return (
    <div className={classes.button}>
      <SubmitButton
        disabled={disabled}
        withoutMargin={true}
        hasLowHeight={true}
        text={buttonText}
        hasSmallText={true}
        isWhiteBordered={isWhiteBordered}
        isTransparent={isTransparent}
        loading={loading}
      />
    </div>
  );
};

export const FormComponent: React.FC<Props> = props => {
  const {
    buttonText,
    classNameForm,
    disabled,
    disabledInput,
    disabledInputGray,
    isReverseColors,
    isTransparent,
    links,
    loading,
    lowerCased = true,
    suffixText,
    convert,
    formatOnFocusOut,
    notification,
    customHandleSubmit,
    showSubmitButton = true,
    placeHolderText = 'Enter a Username',
    onInputChanged,
  } = props;

  const history = useHistory();

  const onSubmit = ({ address }: { address: string }) => {
    if (links && links.getCryptoHandle) return;

    const params: {
      pathname: string;
      search?: string;
    } = { pathname: ROUTES.FIO_ADDRESSES_SELECTION };

    if (address) {
      params.search = `${QUERY_PARAMS_NAMES.ADDRESS}=${address}`;
    }

    history.push(params);
  };

  return (
    <Form onSubmit={customHandleSubmit ? customHandleSubmit : onSubmit}>
      {({ handleSubmit }) => (
        <div className={classes.formContainer}>
          {notification && notification.hasNotification && (
            <NotificationBadge
              type={notification.type}
              show={notification.hasNotification}
              message={notification.message}
              title={notification.title}
              hasNewDesign={true}
              marginBottomXs
              marginTopZero
            />
          )}

          <form
            onSubmit={handleSubmit}
            className={classnames(classes.form, classNameForm)}
          >
            <div className={classes.field}>
              <Field
                name="address"
                type="text"
                placeholder={placeHolderText}
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                uiType={INPUT_UI_STYLES.INDIGO_WHITE}
                component={TextInput}
                hideError="true"
                lowerCased={lowerCased}
                suffix={suffixText}
                formatOnBlur={formatOnFocusOut}
                format={convert}
                parse={onInputChanged}
                disabled={disabledInput}
                disabledInputGray={disabledInputGray}
                loading={loading}
              />
            </div>
            {showSubmitButton && (
              <ActionButton
                disabled={disabled}
                isWhiteBordered={isReverseColors}
                links={links}
                buttonText={buttonText}
                isTransparent={isTransparent}
                loading={loading}
              />
            )}
          </form>
        </div>
      )}
    </Form>
  );
};
