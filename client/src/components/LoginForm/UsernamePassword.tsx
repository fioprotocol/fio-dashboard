import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';
import { OnChange } from 'react-final-form-listeners';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classnames from 'classnames';

import Link from '../Link/Link';
import Input from '../Input/Input';
import FormHeader from '../FormHeader/FormHeader';

import { usernamePasswordValidation } from './components/validation';
import { setDataMutator } from '../../utils';

import { ROUTES } from '../../constants/routes';

import classes from './LoginForm.module.scss';

import { LoginFailure } from '../../types';

type FormValues = {
  email: string;
  password: string;
};

type OwnProps = {
  isForgotPass: boolean;
  onSubmit: (params: { email: string; password: string }) => void;
  edgeAuthLoading: boolean;
  onClose: () => void;
  toggleForgotPass: (open: boolean) => void;
  loginFailure: LoginFailure;
  edgeLoginFailure: { type?: string };
  title: string;
  subtitle?: string;
  headerIcon?: IconProp | null;
  hideCreateAccount?: boolean;
  initialValues: { email?: string; password?: string };
};
type Props = OwnProps;

const UsernamePassword: React.FC<Props> = props => {
  const {
    isForgotPass,
    onSubmit,
    edgeAuthLoading,
    onClose,
    loginFailure,
    edgeLoginFailure,
    toggleForgotPass,
    title,
    subtitle,
    headerIcon,
    hideCreateAccount,
    initialValues,
  } = props;

  let currentForm: FormApi | null = null;

  useEffect(() => {
    if (currentForm && !isEmpty(edgeLoginFailure)) {
      const { mutators } = currentForm;

      mutators.setDataMutator('password', {
        error:
          edgeLoginFailure.type === 'PasswordError' ||
          edgeLoginFailure.type === 'UsernameError'
            ? 'Invalid Email Address or Password'
            : 'Server Error', // todo: set proper message text
      });
      mutators.setDataMutator('email', {
        error: true,
        hideError: true,
      });
    }
  }, [edgeLoginFailure]);

  useEffect(() => {
    if (currentForm && !isEmpty(loginFailure)) {
      const { mutators } = currentForm;

      if (loginFailure.fields != null) {
        for (const field of Object.keys(loginFailure.fields)) {
          mutators.setDataMutator(field, {
            error: true,
            hideError: true,
          });
        }
      }
      mutators.setDataMutator('password', {
        error:
          loginFailure.code === 'AUTHENTICATION_FAILED'
            ? 'Authentication failed'
            : 'Server error',
      });
    }
  }, [loginFailure]);

  useEffect(() => {
    if (!isEmpty(initialValues)) {
      resetFormErrors();
    }
  }, [JSON.stringify(initialValues)]);

  const resetFormErrors = () => {
    if (!currentForm) return;
    const { mutators } = currentForm;

    mutators.setDataMutator('password', {
      error: null,
    });
    mutators.setDataMutator('email', {
      error: null,
      hideError: false,
    });
  };

  const handleSubmit = (values: FormValues) => {
    const { email, password } = values;
    onSubmit({
      email,
      password,
    });
  };

  const handleChange = () => {
    if (!isEmpty(loginFailure) || !isEmpty(edgeLoginFailure)) {
      resetFormErrors();
    }
  };

  const onForgotPassHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleForgotPass(true);
  };

  const onForgotPassClose = () => {
    toggleForgotPass(false);
  };

  const renderIcon = () => {
    if (!headerIcon) return null;

    return (
      <div className="mb-4">
        <FontAwesomeIcon icon={headerIcon} className={classes.headerIcon} />
      </div>
    );
  };

  const renderCreateAccount = () => {
    if (hideCreateAccount) return null;

    return (
      <p className="regular-text">
        Don’t have an account?{' '}
        <Link
          classname={classes.createAccountLink}
          to={ROUTES.CREATE_ACCOUNT}
          onClick={onClose}
          isDisabled={edgeAuthLoading}
        >
          Create Account
        </Link>
      </p>
    );
  };

  const renderForgotPass = () => (
    <div className={classes.forgotPass}>
      <FontAwesomeIcon icon="ban" className={classes.icon} />
      <FormHeader
        title="Forgot Password?"
        subtitle={
          <>
            <p className={classes.subtitle}>
              To recover your password, you must have setup password recovery
              prior.
            </p>
            <p className={classes.subtitle}>
              Please find the recovery email you sent yourself and click on the
              link from this device.
            </p>
          </>
        }
      />
      <Button
        variant="primary"
        className={classes.button}
        onClick={onForgotPassClose}
      >
        Ok
      </Button>
    </div>
  );

  const renderFormItems = (formRenderProps: FormRenderProps) => {
    const { handleSubmit: login, form } = formRenderProps;
    currentForm = form;
    return (
      <form onSubmit={login}>
        {renderIcon()}
        <FormHeader title={title} subtitle={subtitle} />
        <Field
          name="email"
          type="text"
          placeholder="Enter Your Email Address"
          disabled={edgeAuthLoading}
          component={Input}
        />
        <OnChange name="email">{handleChange}</OnChange>
        <Field
          name="password"
          type="password"
          placeholder="Enter Your Password"
          component={Input}
          disabled={edgeAuthLoading}
        />
        <OnChange name="password">{handleChange}</OnChange>
        <Button
          type="submit"
          variant="primary"
          className="w-100"
          onClick={login}
          disabled={edgeAuthLoading}
        >
          {edgeAuthLoading ? (
            <FontAwesomeIcon icon="spinner" spin />
          ) : (
            'Sign In'
          )}
        </Button>
        <Link
          classname={classes.forgotPasswordLink}
          to=""
          onClick={onForgotPassHandler}
          isDisabled={edgeAuthLoading}
        >
          Forgot your password?
        </Link>
        {renderCreateAccount()}
      </form>
    );
  };

  const renderForm = () => (
    <div className={classes.formBox}>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        <Form
          onSubmit={handleSubmit}
          mutators={{ setDataMutator }}
          initialValues={initialValues}
          validate={usernamePasswordValidation.validateForm}
        >
          {renderFormItems}
        </Form>
      </div>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        {renderForgotPass()}
      </div>
    </div>
  );

  return renderForm();
};

export default UsernamePassword;
