import React, { useCallback, useEffect, useRef } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { FormApi } from 'final-form';

import SubmitButton from '../../../../../../components/common/SubmitButton/SubmitButton';
import Input, {
  INPUT_UI_STYLES,
} from '../../../../../../components/Input/Input';

import {
  COLOR_TYPE,
  ERROR_UI_TYPE,
  ErrorBadge,
} from '../../../../../../components/Input/ErrorBadge';

import { formValidation } from '../../validation';

import { ERROR_MESSAGES_BY_CODE } from '../../../../../../constants/errors';

import { FormValuesProps } from '../../types';

import classes from './ChangeEmailForm.module.scss';

type Props = {
  hasNoEmail: boolean;
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  error?: (Error & { code?: string }) | null;
  setError: (error: Error | null) => void;
};

const ChangeEmailForm: React.FC<Props> = props => {
  const { hasNoEmail, onSubmit, loading, error, setError } = props;
  const formRef = useRef<FormApi<FormValuesProps>>(null);

  const onFieldChange = useCallback(() => {
    setError(null);
  }, [setError]);

  const errorMessage = error
    ? ERROR_MESSAGES_BY_CODE[
        error?.code as keyof typeof ERROR_MESSAGES_BY_CODE
      ] || ERROR_MESSAGES_BY_CODE.GENERAL
    : null;

  // Reset form when there's an error or loading state changes
  useEffect(() => {
    if (formRef.current) {
      if (error?.message || !loading) {
        formRef.current.reset();
      }
    }
  }, [error?.message, loading]);

  const renderForm = (formRenderProps: FormRenderProps<FormValuesProps>) => {
    const {
      handleSubmit,
      validating,
      hasValidationErrors,
      submitting,
      form,
    } = formRenderProps;

    formRef.current = form;

    return (
      <>
        <form onSubmit={handleSubmit}>
          <Field
            type="text"
            name="newEmail"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter New Email Address"
            loading={validating}
            disabled={submitting || loading}
            hasErrorForced={error}
            hideError={true}
          />
          {error && (
            <div className={classes.error}>
              <ErrorBadge
                error={errorMessage}
                hasError={!!error}
                type={ERROR_UI_TYPE.TEXT}
                color={COLOR_TYPE.WARN}
              />
            </div>
          )}
          <OnChange name="newEmail">{onFieldChange}</OnChange>
          <SubmitButton
            text={
              loading
                ? hasNoEmail
                  ? 'Setting up'
                  : 'Updating'
                : error
                ? 'Try Again'
                : hasNoEmail
                ? 'Setup'
                : 'Update'
            }
            disabled={
              loading || hasValidationErrors || validating || submitting
            }
            loading={loading || submitting}
          />
        </form>
      </>
    );
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={renderForm}
      validate={formValidation.validateForm}
      keepDirtyOnReinitialize={true}
    />
  );
};

export default ChangeEmailForm;
