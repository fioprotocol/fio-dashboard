import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../components/Input/Input';

import { COLOR_TYPE } from '../../../components/Input/ErrorBadge';

import { FormValuesProps } from '../types';

import { formValidation } from './validation';

type Props = {
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
};

const InviteForm: React.FC<Props> = props => {
  const { onSubmit, loading } = props;

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
            name="inviteEmail"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter Invite Email Address"
            loading={validating}
            disabled={submitting || loading}
          />
          <SubmitButton
            text={loading ? 'Inviting' : 'Invite'}
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
    />
  );
};

export default InviteForm;
