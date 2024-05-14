import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { PasswordFormValues } from '../../types';

import classes from '../../../WalletsPage/styles/CreateWalletForm.module.scss';

const PasswordForm: React.FC<{
  loading: boolean;
  username: string;
  onSubmit: (values: PasswordFormValues) => Promise<void>;
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
          <div className={classes.field}>
            <Field name="username" type="hidden" component={Input} />
          </div>

          <div className={classes.field}>
            <Field
              label="Enter your password and click show private key to display"
              name="password"
              type="password"
              placeholder="Enter Your Password"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={Input}
              disabled={loading}
            />
          </div>

          <SubmitButton
            className={classes.submitButton}
            disabled={
              formRenderProps.hasValidationErrors ||
              formRenderProps.submitting ||
              loading
            }
            loading={loading}
            text="Show Private Key"
            hasLowHeight
            hasAutoWidth
            withoutMargin
          />
        </form>
      )}
    </Form>
  );
};

export default PasswordForm;
