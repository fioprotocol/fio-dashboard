import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { FormValuesProps } from '../../types';
import { FioAccountProfile } from '../../../../types';

import { formValidation } from './validation';

type Props = {
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  initialValues?: FioAccountProfile;
};

const AccountProfileForm: React.FC<Props> = props => {
  const { onSubmit, loading, initialValues } = props;

  const renderForm = (formRenderProps: FormRenderProps<FormValuesProps>) => {
    const {
      handleSubmit,
      validating,
      hasValidationErrors,
      submitting,
      pristine,
    } = formRenderProps;

    return (
      <>
        <form onSubmit={handleSubmit}>
          <Field
            type="text"
            name="name"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter Account Profile name"
            loading={validating}
            disabled={submitting || loading}
          />
          <Field
            type="text"
            name="actor"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter actor"
            loading={validating}
            disabled={submitting || loading}
          />
          <Field
            type="text"
            name="permission"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter permission"
            loading={validating}
            disabled={submitting || loading}
          />
          <SubmitButton
            text={
              loading
                ? initialValues
                  ? 'Updating'
                  : 'Creating'
                : initialValues
                ? 'Update'
                : 'Create'
            }
            disabled={
              loading ||
              hasValidationErrors ||
              validating ||
              submitting ||
              pristine
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
      initialValues={initialValues}
      render={renderForm}
      validate={formValidation.validateForm}
    />
  );
};

export default AccountProfileForm;
