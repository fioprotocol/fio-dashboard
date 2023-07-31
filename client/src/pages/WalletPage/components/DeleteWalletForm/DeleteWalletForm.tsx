import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { DeleteWalletFormValues } from '../../types';

import classes from '../../../WalletsPage/styles/CreateWalletForm.module.scss';

const DeleteWalletForm: React.FC<{
  loading: boolean;
  username: string;
  onSubmit: (values: DeleteWalletFormValues) => Promise<void>;
}> = props => {
  const { loading, username, onSubmit } = props;
  return (
    <Form
      onSubmit={onSubmit}
      validate={formValidation.validateForm}
      initialValues={{ username }}
    >
      {(formRenderProps: FormRenderProps) => (
        <form onSubmit={formRenderProps.handleSubmit} className={classes.form}>
          <Field name="username" type="hidden" component={Input} />
          <Field
            label="Permanently delete this wallet"
            name="password"
            type="password"
            placeholder="Enter Your Password"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
          />

          <SubmitButton
            disabled={
              formRenderProps.hasValidationErrors ||
              formRenderProps.submitting ||
              loading
            }
            loading={loading}
            withBottomMargin={true}
            text="Delete Wallet"
          />
        </form>
      )}
    </Form>
  );
};

export default DeleteWalletForm;
