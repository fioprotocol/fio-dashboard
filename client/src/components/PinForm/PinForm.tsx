import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import Input from '../Input/Input';

import { PIN_LENGTH } from '../../constants/form';

import { setDataMutator } from '../../utils';

import classes from './PinForm.module.scss';

import { IosKeyBoardPlugProp } from '../Input/PinInput/types';

const FIELD_NAME = 'pin';

type Props = {
  onSubmit: (pin: string) => void;
  onReset: () => void;
  loading: boolean;
  error?: Error | string;
  iosKeyboardPlugType?: IosKeyBoardPlugProp;
};

type FormValues = {
  pin: string;
};

const PinForm: React.FC<Props> = props => {
  const { onSubmit, onReset, loading, error, iosKeyboardPlugType } = props;

  let currentForm: FormApi | null = null;

  useEffect(() => {
    if (currentForm) {
      const { mutators } = currentForm;

      if (!isEmpty(error) && typeof error === 'object') {
        const pinErrorMessage = error.message;

        const retErrorMessage = /invalid password/gi.test(pinErrorMessage);

        mutators.setDataMutator(FIELD_NAME, {
          error: retErrorMessage ? 'Invalid PIN - Try Again' : error.message,
        });
      } else {
        mutators.setDataMutator(FIELD_NAME, {
          error: false,
        });
      }
    }
  }, [error]);

  useEffect(
    () => () => {
      resetForm();
    },
    [],
  );

  const handleSubmit = (values: FormValues) => {
    if (loading) return;
    const { pin } = values;
    if (pin && pin.length !== PIN_LENGTH) return;
    onSubmit(pin);
  };

  const resetForm = () => {
    if (currentForm) {
      const { mutators, reset } = currentForm;
      reset();
      mutators.setDataMutator(FIELD_NAME, {
        error: false,
      });
      onReset();
      const currentInput = document.getElementById(FIELD_NAME);
      currentInput && currentInput.focus();
    }
  };

  const renderForm = (formProps: FormRenderProps) => {
    const { handleSubmit: handleFormSubmit, form } = formProps;
    currentForm = form;
    const { values, errors } = currentForm.getState();

    const fieldError = error || (errors && errors.pin);
    return (
      <form onSubmit={handleFormSubmit}>
        <Field
          name={FIELD_NAME}
          component={Input}
          disabled={loading}
          autoFocus
          autoComplete="off"
          onReset={onReset}
          iosKeyboardPlugType={iosKeyboardPlugType}
        />
        {loading && (
          <FontAwesomeIcon icon="spinner" spin className={classes.icon} />
        )}
        {!isEmpty(fieldError) &&
          values.pin &&
          values.pin.length === PIN_LENGTH && (
            <Button className="w-100" onClick={resetForm}>
              Try Again
            </Button>
          )}
      </form>
    );
  };

  return (
    <Form onSubmit={handleSubmit} mutators={{ setDataMutator }}>
      {renderForm}
    </Form>
  );
};

export default PinForm;
