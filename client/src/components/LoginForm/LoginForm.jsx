import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import { Button } from 'react-bootstrap';
import { Form, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import Input from '../Input/Input'; 

import styles from './LoginForm.module.scss';
import { ROUTES } from '../../constants/routes';

export default class LoginForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  };
  render() {
    return (
      <Form
        initialValues={{
          firstName: 'Dan',
        }}
        onSubmit={(values) => {
          // send values to the cloud
        }}
        validate={(values) => {
          // do validation here, and return errors object
        }}
        className={styles.form}
      >
        {({ handleSubmit, pristine, form, submitting }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <Field
                name='username'
                type='text'
                label='Username'
                placeholder='username'
                component={Input}
              />
            </div>
            <div>
              <Field
                name='password'
                type='password'
                label='Password'
                placeholder='password'
                component={Input}
              />
            </div>
            <Row className='auth-controls'>
              <Link to={ROUTES.PASSWORD_RECOVERY}>Forgot your password?</Link>
            </Row>
            <Row>
              <Button htmlType='submit' variant='primary'>
                Login
              </Button>
            </Row>
          </form>
        )}
      </Form>
    );
  }
}
