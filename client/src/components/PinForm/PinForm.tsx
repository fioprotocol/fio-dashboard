import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import { isEmpty } from 'lodash';

import PinInput from '../Input/PinInput/PinInput';
import Counter from '../Counter/Counter';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import { setDataMutator } from '../../utils';
import { PIN_LENGTH } from '../../constants/form';
import { INVALID_PASSWORD } from '../../constants/regExps';

import { IosKeyBoardPlugProp } from '../Input/PinInput/types';

import classes from './PinForm.module.scss';

const FIELD_NAME = 'pin';

type Props = {
  onSubmit: (pin: string) => void;
  onReset: () => void;
  loading: boolean;
  error?: string | (Error & { wait?: number });
  iosKeyboardPlugType?: IosKeyBoardPlugProp;
  blockedTime?: number;
};

type FormValues = {
  pin: string;
};

const PinForm: React.FC<Props> = props => {
  const {
    onSubmit,
    onReset,
    loading,
    error,
    iosKeyboardPlugType,
    blockedTime,
  } = props;

  let currentForm: FormApi | null = null;
  const [isDisabled, toggleDisabled] = useState(false);

  useEffect(() => {
    if (currentForm) {
      const { mutators } = currentForm;

      if (!isEmpty(error) && typeof error === 'object') {
        const errorMessage = (errMessage: string) => {
          if (INVALID_PASSWORD.test(errMessage)) {
            if (!blockedTime) return 'Invalid PIN - Try Again';
            return 'Pin confirm has been blocked';
          }
          return errMessage;
        };

        mutators.setDataMutator(FIELD_NAME, {
          error: errorMessage(error.message),
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
    if (!pin || error || (pin && pin.length !== PIN_LENGTH)) return;
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
          component={PinInput}
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
            <SubmitButton
              onClick={resetForm}
              disabled={isDisabled}
              withBottomMargin={true}
              text={
                <>
                  <div className={classes.mainText}>
                    Try Again&nbsp;
                    <Counter
                      initialTime={blockedTime}
                      prefix="in"
                      toggleDisabled={toggleDisabled}
                    />
                  </div>
                </>
              }
            />
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
