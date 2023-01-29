import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import classes from '../../styles/DeleteMyAccount.module.scss';

export type PasswordFormValues = {
  password?: string;
  username?: string;
};

type PasswordFormProps = {
  loading: boolean;
  username: string;
  onSubmit: (values: PasswordFormValues) => Promise<PasswordFormValues>;
};

const PasswordForm: React.FC<PasswordFormProps> = props => {
  const { loading, username, onSubmit } = props;
  return (
    <Form
      onSubmit={onSubmit}
      validate={formValidation.validateForm}
      initialValues={{ username }}
    >
      {(props: FormRenderProps) => (
        <form onSubmit={props.handleSubmit} className={classes.form}>
          <Field name="username" type="hidden" component={Input} />
          <Field
            name="password"
            type="password"
            placeholder="Enter Your Password"
            uiType={INPUT_UI_STYLES.BLACK_VIOLET}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
          />
          <SubmitButton
            disabled={props.hasValidationErrors || props.submitting || loading}
            loading={loading}
            withBottomMargin={true}
            text="Delete My Account"
          />
        </form>
      )}
    </Form>
  );
};

export default PasswordForm;
