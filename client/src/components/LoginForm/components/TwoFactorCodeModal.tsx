import React, { useEffect } from 'react';
import { Field, FormRenderProps, Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import Input, { INPUT_UI_STYLES } from '../../Input/Input';
import { COLOR_TYPE } from '../../Input/ErrorBadge';
import SubmitButton from '../../common/SubmitButton/SubmitButton';

import CancelButton from '../../common/CancelButton/CancelButton';

import Modal from '../../Modal/Modal';

import { twoFactorCodeModalValidation } from './validation';

import { setDataMutator } from '../../../utils';

import classes from '../styles/TwoFactorCodeModal.module.scss';

export type BackupFormValues = {
  backupCode: string;
};

type Props = {
  show: boolean;
  onClose: () => void;
  onSubmit: (values: BackupFormValues) => void;
  loading: boolean;
  otpError?: string;
};

const RenderForm = (props: FormRenderProps<BackupFormValues> & Props) => {
  const {
    handleSubmit,
    valid,
    values,
    submitting,
    submitFailed,
    submitSucceeded,
    form: { mutators },
    otpError,
    loading,
    onClose,
  } = props;

  useEffect(() => {
    if (otpError && (submitFailed || submitSucceeded)) {
      mutators.setDataMutator('backupCode', {
        error: otpError,
      });
    }
  }, [otpError, submitSucceeded, submitFailed]);

  const handleError = () => {
    mutators.setDataMutator('backupCode', {
      error: null,
    });
  };

  const isDisabled = loading || !valid || !values.backupCode;

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <OnChange name="backupCode">{handleError}</OnChange>
      <Field
        name="backupCode"
        placeholder="Enter Backup Code"
        lowerCased={false}
        component={Input}
        type="text"
        showClearInput={true}
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorColor={COLOR_TYPE.WARN}
        loading={loading}
      />
      <SubmitButton
        text="Submit"
        disabled={isDisabled}
        loading={loading || submitting}
        withBottomMargin={true}
      />
      <div className={classes.cancelButton}>
        <CancelButton
          onClick={onClose}
          isBlack={true}
          isThin={true}
          disabled={loading}
        />
      </div>
    </form>
  );
};

const TwoFactorCodeModal: React.FC<Props> = props => {
  const { show, onClose, onSubmit, loading } = props;

  const handleClose = () => {
    !loading && onClose();
  };

  return (
    <Modal
      onClose={handleClose}
      closeButton={true}
      show={show}
      isSimple={true}
      isMiddleWidth={true}
      hasDefaultCloseColor={true}
    >
      <div className={classes.codeModalContainer}>
        <h3 className={classes.title}>Enter Backup Code</h3>
        <p className={classes.subtitle}>
          Sign into your account using the device you setup 2FA.
        </p>
        <p className={classes.message}>
          Go to Settings &gt; 2 Factor Authentication to find the code if you do
          not already have it recorded.
        </p>
        <Form
          onSubmit={onSubmit}
          validate={twoFactorCodeModalValidation.validateForm}
          mutators={{ setDataMutator }}
        >
          {formProps => <RenderForm {...formProps} {...props} />}
        </Form>
      </div>
    </Modal>
  );
};

export default TwoFactorCodeModal;
