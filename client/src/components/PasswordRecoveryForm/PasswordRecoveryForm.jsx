import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row } from 'antd';
import { TextField } from 'redux-form-antd';
import { Field } from 'redux-form';

import styles from './PasswordRecoveryForm.module.scss';

export default class PasswordRecoveryForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit} className={styles.form}>
        <Form.Item className={styles.input}>
          <Field
            name="email"
            type="text"
            label="Email"
            placeholder="email"
            component={TextField}
          />
        </Form.Item>
        <Row className="auth-controls">
          <Button htmlType="submit" className="submit">
            Reset password
          </Button>
        </Row>
      </Form>
    );
  }
}
