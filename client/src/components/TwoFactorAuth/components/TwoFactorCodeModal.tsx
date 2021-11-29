import React from 'react';
import { Field, FormRenderProps, Form } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../Input/Input';
import { COLOR_TYPE } from '../../Input/ErrorBadge';
import SubmitButton from '../../common/SubmitButton/SubmitButton';

import CancelButton from '../../common/CancelButton/CancelButton';

import Modal from '../../Modal/Modal';

import { validate } from './validation';

import classes from '../styles/TwoFactorCodeModal.module.scss';

export type FormValues = {
  backupCode: string;
};

type Props = {
  show: boolean;
  onClose: () => void;
};

const TwoFactorCodeModal: React.FC<Props> = props => {
  const { show, onClose } = props;

  const onSubmit = async (values: FormValues) => {};

  const renderForm = (props: FormRenderProps<FormValues>) => {
    const { handleSubmit, validating, valid, values } = props;
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <Field
          name="backupCode"
          placeholder="Enter Backup Code"
          lowerCased={false}
          component={Input}
          type="text"
          showClearInput={true}
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          errorColor={COLOR_TYPE.WARN}
          loading={validating}
        />
        <SubmitButton
          text="Submit"
          disabled={!valid || !values.backupCode || validating}
        />
        <div className={classes.cancelButton}>
          <CancelButton onClick={onClose} isBlack={true} isThin={true} />
        </div>
      </form>
    );
  };

  return (
    <Modal
      onClose={onClose}
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
        <Form onSubmit={onSubmit} validate={validate}>
          {renderForm}
        </Form>
      </div>
    </Modal>
  );
};

export default TwoFactorCodeModal;
