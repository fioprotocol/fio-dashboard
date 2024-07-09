import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { FIO_API_URLS_TYPES } from '../../../../constants/fio';

import { FormValuesProps } from '../../types';
import { FioApiUrl } from '../../../../types';

import { formValidation } from './validation';

type Props = {
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  initialValues?: Partial<FioApiUrl>;
};

const ApiUrlForm: React.FC<Props> = props => {
  const { onSubmit, loading, initialValues } = props;

  const renderForm = (formRenderProps: FormRenderProps<FormValuesProps>) => {
    const {
      handleSubmit,
      validating,
      hasValidationErrors,
      submitting,
      pristine,
      values,
    } = formRenderProps;

    return (
      <>
        <form onSubmit={handleSubmit}>
          <Field
            type="text"
            name="url"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter Url"
            loading={validating}
            disabled={submitting || loading}
          />
          <Field name="rank" component={Input} type="hidden" />
          <Field
            type="dropdown"
            name="type"
            component={Input}
            options={Object.keys(FIO_API_URLS_TYPES).map(
              fioApiUrlsTypeItem => ({
                id: fioApiUrlsTypeItem,
                name: fioApiUrlsTypeItem,
              }),
            )}
            errorColor={COLOR_TYPE.WARN}
            uiType={INPUT_UI_STYLES.BLACK_VIOLET}
            placeholder="Set API URL Type"
            disabled={submitting || loading}
          />
          <SubmitButton
            text={
              loading
                ? initialValues && initialValues?.id
                  ? 'Updating'
                  : 'Creating'
                : initialValues && initialValues?.id
                ? 'Update'
                : 'Create'
            }
            disabled={
              loading ||
              hasValidationErrors ||
              validating ||
              submitting ||
              !values?.type ||
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

export default ApiUrlForm;
