import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row } from 'antd';
import { TextField } from 'redux-form-antd';
import { Field } from 'redux-form';
import { isEmpty } from '../../helpers/verifying';

import styles from './SignupForm.module.scss';

export default class SignupForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    resetSuccessState: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  componentDidMount() {
    const { location, replace } = this.props.history;
    if (!isEmpty(location.query) && location.query.email) {
      this.props.initialize({
        email: location.query.email,
      });
      replace('/signup');
    }
  }

  componentWillUnmount() {
    this.props.resetSuccessState();
  }

  render() {
    const { signupSuccess, loading, handleSubmit } = this.props;
    const formStyleName = signupSuccess ? 'form success' : 'form';
    return (
      <Form onSubmit={handleSubmit} className={formStyleName}>
        <div className="register-success">
          <i className="checkmark" />
          <h3>You successfully registered</h3>
          <p>Check email address!</p>
        </div>
        <Form.Item className={styles.input}>
          <Field
            name="username"
            type="text"
            label="Username"
            component={TextField}
          />
        </Form.Item>
        <Form.Item className={styles.input}>
          <Field name="email" type="text" label="Email" component={TextField} />
        </Form.Item>
        <Form.Item className={`${styles.input} ${styles.passwords}`}>
          <Field
            name="password"
            type="password"
            label="Password"
            component={TextField}
          />
          <Field
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            component={TextField}
          />
        </Form.Item>
        <Row className="auth-controls">
          <Button htmlType="submit" className="submit" loading={loading}>
            Sign up
          </Button>
        </Row>
      </Form>
    );
  }
}
