import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import DangerModal from '../../../../components/Modal/DangerModal';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { FIO_ACCOUNT_TYPES_OPTIONS } from '../../../../constants/fio';

import { FormValuesProps } from '../../types';
import { FioAccountProfile } from '../../../../types';

import { formValidation } from './validation';

type Props = {
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  initialValues?: FioAccountProfile;
  showWarningModal: boolean;
  dangerModaActionClick: (vaues: FormValuesProps) => void;
  toggleShowWarningModal: (showModal: boolean) => void;
};

const AccountProfileForm: React.FC<Props> = props => {
  const {
    onSubmit,
    loading,
    initialValues,
    showWarningModal,
    dangerModaActionClick,
    toggleShowWarningModal,
  } = props;

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
          <Field
            type="dropdown"
            name="accountType"
            component={Input}
            options={FIO_ACCOUNT_TYPES_OPTIONS}
            errorColor={COLOR_TYPE.WARN}
            uiType={INPUT_UI_STYLES.BLACK_VIOLET}
            placeholder="Set Account Type"
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
          <DangerModal
            show={showWarningModal}
            title="Account type warnings"
            subtitle={`You already have ${values?.accountType} account. Would you like to replace it with this one?`}
            onClose={() => toggleShowWarningModal(false)}
            buttonText="Yes"
            cancelButtonText="No"
            showCancel
            onActionButtonClick={() => dangerModaActionClick(values)}
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
