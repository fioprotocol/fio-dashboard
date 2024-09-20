import React, { useCallback } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import SubmitButton from '../../../../../../components/common/SubmitButton/SubmitButton';
import Input, {
  INPUT_UI_STYLES,
} from '../../../../../../components/Input/Input';

import {
  COLOR_TYPE,
  ERROR_UI_TYPE,
  ErrorBadge,
} from '../../../../../../components/Input/ErrorBadge';

import { FormValuesProps } from '../../types';

import { formValidation } from '../../validation';

import classes from './ChangeEmailForm.module.scss';

type Props = {
  hasNoEmail: boolean;
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  error?: boolean;
  setError: (error: boolean) => void;
};

const ChangeEmailForm: React.FC<Props> = props => {
  const { hasNoEmail, onSubmit, loading, error, setError } = props;

  const onFieldChange = useCallback(() => {
    setError(false);
  }, [setError]);

  const renderForm = (formRenderProps: FormRenderProps<FormValuesProps>) => {
    const {
      handleSubmit,
      validating,
      hasValidationErrors,
      submitting,
    } = formRenderProps;

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
                error="Update email failed. Please try again or set another email."
                hasError={error}
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
