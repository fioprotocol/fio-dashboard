import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Form, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import validator from 'email-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import ModalComponent from '../Modal/Modal';
import Input from '../Input/Input';
import FormHeader from '../FormHeader/FormHeader';

import classes from './LoginForm.module.scss';
import { ROUTES } from '../../constants/routes';

const LoginForm = props => {
  const { show, onSubmit, loading, onClose, getCachedUsers, cachedUsers } = props;
  const [isForgotPass, toggleForgotPass] = useState(false);

  useEffect(getCachedUsers, [])

  const onForgotPassHandler = e => {
    e.preventDefault();
    toggleForgotPass(true);
  };

  const onForgotPassClose = () => {
    toggleForgotPass(false);
  }

  const renderForgotPass = () => (
    <div className={classes.forgotPass}>
      <FontAwesomeIcon icon='ban' className={classes.icon} />
      <FormHeader
        title='Forgot Password?'
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
      <Button variant='primary' className={classes.button} onClick={onForgotPassClose}>
        Ok
      </Button>
    </div>
  );

  const renderPinForm = () => (
    <div className={classes.formBox}>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        Pin Form
      </div>
    </div>
  )

  const renderForm = () => (
    <div className={classes.formBox}>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        <Form
          onSubmit={({ email, password }) => {
            onSubmit({
              username: `${email.split('@')[0]}`,
              password
            })
          }}
          validate={(values) => {
            const errors = {};

            if (!values.email || !validator.validate(values.email)) {
              errors.email = 'Invalid Email Address';
            }

            if (!values.password) {
              errors.password = 'Password Field Should Be Filled';
            }

            return errors;
          }}
        >
          {({ handleSubmit, pristine, form, submitting }) => (
            <form onSubmit={handleSubmit}>
              <FormHeader title='Sign In' />
              <Field
                name='email'
                type='text'
                placeholder='Enter Your Email Address'
                disabled={loading}
                component={Input}
              />
              <Field
                name='password'
                type='password'
                placeholder='Enter Your Password'
                component={Input}
                disabled={loading}
              />
              <Button htmltype='submit' variant='primary' className='w-100' onClick={handleSubmit} disabled={loading}>
                {loading ? <FontAwesomeIcon icon='spinner' spin /> : 'Sign In'}
              </Button>
              <Link
                className='regular-text'
                to=''
                onClick={onForgotPassHandler}
              >
                Forgot your password?
              </Link>
              <p className='regular-text'>
                Don’t have an account?{' '}
                <Link to={ROUTES.CREATE_ACCOUNT} onClick={onClose}>Create Account</Link>
              </p>
            </form>
          )}
        </Form>
      </div>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        {renderForgotPass()}
      </div>
    </div>
  );

  return (
    <ModalComponent
      show={show}
      backdrop='static'
      onClose={isForgotPass ? onForgotPassClose : onClose}
      closeButton
    >
      {/*{!cachedUsers.length ? renderForm() : renderPinForm()}*/}
      {renderForm()}
    </ModalComponent>
  );
};

export default LoginForm;
