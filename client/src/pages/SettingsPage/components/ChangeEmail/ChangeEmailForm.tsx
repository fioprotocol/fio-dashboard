import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { FormValuesProps } from './types';

import { formValidation } from './validation';

type Props = {
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  error?: boolean;
  initialValues: { newEmail: string } | null;
};

const ChangeEmailForm: React.FC<Props> = props => {
  const { onSubmit, loading, error, initialValues } = props;

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
          />
          <SubmitButton
            text={loading ? 'Updating' : error ? 'Try Again' : 'Update'}
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
      initialValues={initialValues || undefined}
    />
  );
};

export default ChangeEmailForm;
