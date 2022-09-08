import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { formValidation } from './validation';
import { FormProps } from '../../types';

import classes from '../../AdminPasswordResetPage.module.scss';

const AdminPasswordResetForm: React.FC<FormProps> = props => {
  const { onSubmit, loading, initialValues } = props;

  return (
    <Form
      onSubmit={onSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const { handleSubmit, valid } = formRenderProps;

        return (
          <div className={classes.container}>
            <div className={classes.formContainer}>
              <h2 className={classes.title}>Admin Account Reset Password</h2>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Field
                  component={Input}
                  type="password"
                  name="password"
                  placeholder="Enter New Password"
                  label="Password"
                />
                <Field
                  component={Input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  label="Password"
                />

                <SubmitButton
                  disabled={!valid}
                  text="Set Password"
                  loading={loading}
                />
              </form>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

export default AdminPasswordResetForm;
