import React, { useCallback, useEffect, useState } from 'react';
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

import classes from './PinForm.module.scss';

export const FIELD_NAME = 'pin';

type Props = {
  onSubmit: (pin: string) => void;
  onReset: () => void;
  loading: boolean;
  error?: string | (Error & { wait?: number }) | null;
  blockedTime?: number;
};

type FormValues = {
  pin: string;
};

const PinForm: React.FC<Props> = props => {
  const { onSubmit, onReset, loading, error, blockedTime = 0 } = props;

  let currentForm: FormApi | null = null;
  const [isDisabled, toggleDisabled] = useState(false);

  const resetForm = useCallback(() => {
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
  }, [currentForm, onReset]);

  useEffect(() => {
    if (currentForm) {
      const { mutators } = currentForm;

      if (error && !isEmpty(error) && typeof error === 'object') {
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
  }, [blockedTime, currentForm, error]);

  useEffect(
    () => () => {
      resetForm();
    },
    [resetForm],
  );

  const handleSubmit = (values: FormValues) => {
    if (loading) return;
    const { pin } = values;
    if (!pin || error || (pin && pin.length !== PIN_LENGTH)) return;
    onSubmit(pin);
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
