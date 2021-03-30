import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row } from 'antd';
import { TextField } from 'redux-form-antd';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import styles from './LoginPinForm.module.scss';

export default class LoginPinForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit} className={styles.form}>
        <Form.Item className={styles.input}>
          <Field
            name="username"
            type="text"
            label="Username"
            placeholder="username"
            component={TextField}
          />
        </Form.Item>
        <Form.Item className={styles.input}>
          <Field
            name="pin"
            type="password"
            label="PIN"
            placeholder="pin"
            component={TextField}
          />
        </Form.Item>
        <Row className="auth-controls">
          <Link onClick={this.props.exitPin} to="#">
            Exit PIN
          </Link>
        </Row>
        <Row className="auth-controls">
          <Button htmlType="submit" className="submit">
            Login
          </Button>
        </Row>
      </Form>
    );
  }
}
