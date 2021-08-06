import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import Input from '../Input/Input';

import { useCheckIfDesktop } from '../../screenType';
import { PIN_LENGTH } from '../../constants/form';

import { setDataMutator } from '../../utils';
import classes from './PinForm.module.scss';

type Props = {
  onSubmit: (pin: string) => void;
  onReset: () => void;
  loading: boolean;
  error: {
    message?: string;
  };
};

type FormValues = {
  pin: string;
};

const PinForm = (props: Props) => {
  const { onSubmit, onReset, loading, error } = props;
  const isDesktop = useCheckIfDesktop();

  let currentForm: any = {}; // todo: FormApi is not exported
  useEffect(() => {
    if (!isEmpty(currentForm)) {
      const { mutators } = currentForm;

      if (!isEmpty(error)) {
        const pinErrorMessage = error.message;

        const retErrorMessage = /invalid password/gi.test(pinErrorMessage);

        mutators.setDataMutator('pin', {
          error: retErrorMessage ? 'Invalid PIN - Try Again' : error.message,
        });
      } else {
        mutators.setDataMutator('pin', {
          error: false,
        });
      }
    }
  }, [error]);

  const handleSubmit = (values: FormValues) => {
    if (loading) return;
    const { pin } = values;
    if (pin && pin.length !== PIN_LENGTH) return;
    onSubmit(pin);
  };

  const resetForm = () => {
    if (!isEmpty(currentForm)) {
      const { mutators, reset } = currentForm;
      reset();
      mutators.setDataMutator('pin', {
        error: false,
      });
      onReset();
      const currentInput = document.getElementById('pin');
      currentInput && currentInput.focus();
    }
  };

  const renderForm = (formProps: FormRenderProps) => {
    const { handleSubmit: handleFormSubmit, form } = formProps;
    currentForm = form;
    const { values, errors, active } = currentForm.getState();

    const isAndroid = /Android/i.test(window.navigator.appVersion);

    const fieldError = error || (errors && errors.pin);
    return (
      <form onSubmit={handleFormSubmit} className={classes.form}>
        <Field
          name="pin"
          component={Input}
          disabled={loading}
          autoFocus
          autoComplete="off"
        />
        {!isDesktop && active && (
          <div
            className={
              isAndroid ? classes.androidKeyboard : classes.keyboardPlug
            }
          />
        )}
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
