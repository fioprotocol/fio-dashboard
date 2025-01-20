import React from 'react';

import { Field, Form, FormRenderProps } from 'react-final-form';

import Modal from '../../../../components/Modal/Modal';

import { MinVersionFormValuesProps } from '../../types';
import { formValidation } from './validation';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

type Props = {
  show: boolean;
  loading: boolean;
  onSubmit: (values: MinVersionFormValuesProps) => void;
  onClose: () => void;
  initialValues?: MinVersionFormValuesProps;
};

const FioApiUrlModal: React.FC<Props> = props => {
  const { show, loading, onSubmit, onClose, initialValues } = props;

  const renderForm = (
    formRenderProps: FormRenderProps<MinVersionFormValuesProps>,
  ) => {
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
            name="minVersion"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter Version"
            loading={validating}
            disabled={submitting || loading}
          />
          <SubmitButton
            text={loading ? 'Updating' : 'Update'}
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
    <Modal
      show={show}
      closeButton
      isSimple
      isWide
      hasDefaultCloseColor
      onClose={onClose}
      enableOverflow
    >
      <div className="d-flex flex-column w-100">
        <h3 className="text-left mb-3">FIO Apis min version</h3>
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          render={renderForm}
          validate={formValidation.validateForm}
        />
      </div>
    </Modal>
  );
};

export default FioApiUrlModal;
