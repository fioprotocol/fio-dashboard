import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { CreateWalletProps } from '../../types';

import classes from '../../styles/CreateWalletForm.module.scss';

const CreateWalletForm: React.FC<CreateWalletProps> = props => {
  const { loading, initialValues } = props;
  return (
    <Form
      onSubmit={props.onSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => (
        <form onSubmit={formRenderProps.handleSubmit} className={classes.form}>
          <Field
            name="name"
            type="text"
            placeholder="Enter Wallet Name"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
          />
          <div className={classes.checkboxContainer}>
            <Field
              name="ledger"
              type="checkbox"
              component={Input}
              label="Use Ledger Hardware Wallet"
            />
            <div className={classes.checkboxContent}>
              <p className={classes.checkboxText}>
                Private keys for this wallet will be stored on your Ledger
                Device. The device has to be already configured and backed up,
                e.g you are using it with Ledger Live.
              </p>
            </div>
          </div>

          <SubmitButton
            text="Create Wallet"
            disabled={
              !formRenderProps.valid || formRenderProps.submitting || loading
            }
            loading={loading}
            withTopMargin={true}
            withBottomMargin={true}
          />
        </form>
      )}
    </Form>
  );
};

export default CreateWalletForm;
