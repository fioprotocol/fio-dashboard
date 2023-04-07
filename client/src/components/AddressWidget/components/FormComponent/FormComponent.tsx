import React from 'react';
import { Field, Form, useForm } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';

import SubmitButton from '../../../common/SubmitButton/SubmitButton';
import { ExclamationIcon } from '../../../ExclamationIcon';
import TextInput, { INPUT_COLOR_SCHEMA } from '../../../Input/TextInput';
import NotificationBadge from '../../../NotificationBadge';

import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';
import { ROUTES } from '../../../../constants/routes';

import { TwitterNotification } from '../../../../types';

import classes from './FormComponent.module.scss';

type Props = {
  buttonText?: string;
  links?: {
    getCryptoHandle: React.ReactNode;
  };
  isReverseColors?: boolean;
  isDarkWhite?: boolean;
  formAction?: boolean;
  suffix?: boolean;
  prefixText?: string;
  convert?: (value: string) => string;
  formatOnFocusOut?: boolean;
  notification?: TwitterNotification;
  customHandleSubmit?: ({ address }: { address: string }) => Promise<void>;
  showSubmitButton?: boolean;
};

type ActionButtonProps = {
  buttonText?: string;
  isWhiteBordered?: boolean;
  links?: {
    getCryptoHandle: React.ReactNode;
  };
};

const ActionButton: React.FC<ActionButtonProps> = props => {
  const { buttonText = 'GET IT', isWhiteBordered, links } = props;
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
          isButtonType={true}
          hasLowHeight={true}
          text={buttonText}
          hasSmallText={true}
          isWhiteBordered={isWhiteBordered}
        />
      </a>
    );
  }

  return (
    <div className={classes.button}>
      <SubmitButton
        withoutMargin={true}
        hasLowHeight={true}
        text={buttonText}
        hasSmallText={true}
        isWhiteBordered={isWhiteBordered}
      />
    </div>
  );
};

export const FormComponent: React.FC<Props> = props => {
  const {
    buttonText,
    isReverseColors,
    isDarkWhite,
    links,
    formAction,
    suffix,
    prefixText,
    convert,
    formatOnFocusOut,
    notification,
    customHandleSubmit,
    showSubmitButton = true,
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

          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.field}>
              <Field
                name="address"
                type="text"
                placeholder="Enter a Username"
                colorSchema={INPUT_COLOR_SCHEMA.INDIGO_AND_WHITE}
                component={TextInput}
                hideError="true"
                lowerCased
                prefix={prefixText}
                suffix={suffix}
                formatOnBlur={formatOnFocusOut}
                format={convert}
                defaultValue=""
              />
            </div>
            {showSubmitButton && (
              <ActionButton
                isWhiteBordered={isReverseColors}
                links={links}
                buttonText={buttonText}
              />
            )}
          </form>
          {formAction && (
            <div className={classes.actionTextContainer}>
              <ExclamationIcon
                isBlackWhite={!isReverseColors && !isDarkWhite}
                isWhiteIndigo={isReverseColors && !isDarkWhite}
                isWhiteBlack={isDarkWhite && !isReverseColors}
              />

              <span
                className={classnames(
                  classes.actionText,
                  isReverseColors && classes.isReverseColors,
                  isDarkWhite && classes.isDarkWhite,
                )}
              >
                You can pay with a credit card OR crypto!
              </span>
            </div>
          )}
        </div>
      )}
    </Form>
  );
};
