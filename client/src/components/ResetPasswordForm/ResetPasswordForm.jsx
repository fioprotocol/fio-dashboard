import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row } from 'antd';
import { TextField } from 'redux-form-antd';
import { Field } from 'redux-form';

import styles from './ResetPasswordForm.module.scss';

export default class ResetPasswordForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { handleSubmit, onSubmit } = this.props;
    return (
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Form.Item className={styles.input}>
          <Field
            name="password"
            type="password"
            label="New password"
            placeholder="new password"
            component={TextField}
          />
        </Form.Item>
        <Form.Item className={styles.input}>
          <Field
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="confirm password"
            component={TextField}
          />
        </Form.Item>
        <Row className="auth-controls">
          <Button htmlType="submit" className="submit">
            Set new password
          </Button>
        </Row>
      </Form>
    );
  }
}
