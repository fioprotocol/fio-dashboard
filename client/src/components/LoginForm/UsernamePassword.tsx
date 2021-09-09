import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { Link } from 'react-router-dom';
import validator from 'email-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { OnChange } from 'react-final-form-listeners';

import Input from '../Input/Input';
import FormHeader from '../FormHeader/FormHeader';

import classes from './LoginForm.module.scss';
import { ROUTES } from '../../constants/routes';
import { setDataMutator } from '../../utils';

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
  loginFailure: { fields?: { [fieldName: string]: any }; code?: string };
  edgeLoginFailure: { type?: string };
};
type Props = OwnProps;

const UsernamePassword = (props: Props) => {
  const {
    isForgotPass,
    onSubmit,
    edgeAuthLoading,
    onClose,
    loginFailure,
    edgeLoginFailure,
    toggleForgotPass,
  } = props;
  let currentForm: any = {}; // todo: FormApi is not exported
  useEffect(() => {
    if (!isEmpty(currentForm) && !isEmpty(edgeLoginFailure)) {
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
    if (!isEmpty(currentForm) && !isEmpty(loginFailure)) {
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

  const handleSubmit = (values: FormValues) => {
    const { email, password } = values;
    onSubmit({
      email,
      password,
    });
  };

  const handleChange = () => {
    if (!isEmpty(currentForm) && !isEmpty(loginFailure)) {
      const { mutators } = currentForm;

      mutators.setDataMutator('password', {
        error: null,
      });
      mutators.setDataMutator('email', {
        error: null,
        hideError: false,
      });
    }
  };

  const onForgotPassHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleForgotPass(true);
  };

  const onForgotPassClose = () => {
    toggleForgotPass(false);
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
        <FormHeader title="Sign In" />
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
        <Link className="regular-text" to="" onClick={onForgotPassHandler}>
          Forgot your password?
        </Link>
        <p className="regular-text">
          Don’t have an account?{' '}
          <Link to={ROUTES.CREATE_ACCOUNT} onClick={onClose}>
            Create Account
          </Link>
        </p>
      </form>
    );
  };

  const renderForm = () => (
    <div className={classes.formBox}>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        <Form
          onSubmit={handleSubmit}
          mutators={{ setDataMutator }}
          validate={(
            values: FormValues,
          ): { email?: string; password?: string } => {
            const errors: { email?: string; password?: string } = {};

            if (!values.email || !validator.validate(values.email)) {
              errors.email = 'Invalid Email Address';
            }

            if (!values.password) {
              errors.password = 'Password Field Should Be Filled';
            }

            return errors;
          }}
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
