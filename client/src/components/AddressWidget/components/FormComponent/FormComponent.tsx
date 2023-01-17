import React from 'react';
import { Field, Form, useForm } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';

import SubmitButton from '../../../common/SubmitButton/SubmitButton';
import { ExclamationIcon } from '../../../ExclamationIcon';
import TextInput, { INPUT_COLOR_SCHEMA } from '../../../Input/TextInput';

import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';
import { ROUTES } from '../../../../constants/routes';

import classes from './FormComponent.module.scss';

type Props = {
  buttonText?: string;
  links?: {
    getCryptoHandle: React.ReactNode;
  };
  isReverseColors?: boolean;
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
  const { buttonText, isReverseColors, links } = props;

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
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <div className={classes.formContainer}>
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
              />
            </div>
            <ActionButton
              isWhiteBordered={isReverseColors}
              links={links}
              buttonText={buttonText}
            />
          </form>
          <div className={classes.actionTextContainer}>
            <ExclamationIcon
              isBlackWhite={!isReverseColors}
              isWhiteIndigo={isReverseColors}
            />
            <span
              className={classnames(
                classes.actionText,
                isReverseColors && classes.isReverseColors,
              )}
            >
              You can pay with a credit card OR crypto!
            </span>
          </div>
        </div>
      )}
    </Form>
  );
};
