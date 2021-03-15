import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Form, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import validator from 'email-validator';

import ModalComponent from '../Modal/Modal';
import Input from '../Input/Input'; 
import FormHeader from '../FormHeader/FormHeader';

import classes from './LoginForm.module.scss';
import { ROUTES } from '../../constants/routes';

export default class LoginForm extends Component {
  static propTypes = {
    // handleSubmit: PropTypes.func.isRequired
  };
  render() {
    return (
      <ModalComponent show={true} backdrop='static'>
        <Form
          // initialValues={}
          onSubmit={(values) => {
            // send values to the cloud
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
                component={Input}
              />
              <Field
                name='password'
                type='password'
                placeholder='Enter Your Password'
                component={Input}
              />
              <Button htmltype='submit' variant='primary' className='w-100'>
                Sign In
              </Button>
              <Link to={ROUTES.PASSWORD_RECOVERY} className='regular-text'>
                Forgot your password?
              </Link>
              <p className='regular-text'>
                Don’t have an account?{' '}
                <Link to={ROUTES.CREATE_ACCOUNT}>Create Account</Link>
              </p>
            </form>
          )}
        </Form>
      </ModalComponent>
    );
  }
}
