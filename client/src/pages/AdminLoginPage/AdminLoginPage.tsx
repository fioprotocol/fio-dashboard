import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Redirect } from 'react-router';

import SubmitButton from '../../components/common/SubmitButton/SubmitButton';
import Input from '../../components/Input/Input';

import { formValidation } from './validation';
import { ADMIN_ROUTES } from '../../constants/routes';
import { AdminAuthResponse } from '../../types';

import classes from './AdminLoginPage.module.scss';

type FormValues = {
  email: string;
  password: string;
  tfaToken: string;
};

type Props = {
  login: (values: FormValues) => Promise<AdminAuthResponse>;
  loading: boolean;
  isAdminAuthenticated: boolean;
};

const AdminLogin: React.FC<Props> = props => {
  const { login, loading, isAdminAuthenticated } = props;

  if (isAdminAuthenticated) return <Redirect to={ADMIN_ROUTES.ADMIN_HOME} />;

  const onSubmit = (values: FormValues) => {
    return login(values).then(res => {
      if (res?.error?.fields) return res.error.fields;
      return null;
    });
  };

  return (
    <div>
      <Form onSubmit={onSubmit} validate={formValidation.validateForm}>
        {(formRenderProps: FormRenderProps) => {
          const {
            handleSubmit,
            modifiedSinceLastSubmit,
            hasSubmitErrors,
            hasValidationErrors,
            pristine,
          } = formRenderProps;

          const isSubmitDisabled =
            loading ||
            (hasSubmitErrors && !modifiedSinceLastSubmit) ||
            hasValidationErrors ||
            pristine;

          return (
            <div className={classes.container}>
              <div className={classes.formContainer}>
                <h2 className={classes.title}>Login</h2>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <Field
                    component={Input}
                    type="text"
                    name="email"
                    placeholder="Enter Your Email"
                    label="Email"
                  />
                  <Field
                    component={Input}
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    label="Password"
                  />
                  <Field
                    component={Input}
                    type="number"
                    name="tfaToken"
                    placeholder="Enter 2FA code"
                    label="2FA"
                  />
                  <SubmitButton
                    text="Login"
                    loading={loading}
                    disabled={isSubmitDisabled}
                  />
                </form>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

export default AdminLogin;
