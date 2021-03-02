import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row } from 'antd';
import { TextField } from 'redux-form-antd';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import styles from './LoginForm.module.scss';
import { ROUTES } from '../../constants/routes';

export default class LoginForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    edgeContext: PropTypes.any
  };

  componentDidMount() {
    this.props.edgeContext.listUsernames().then(cachedUsers => {
      console.log('cachedUsers======', cachedUsers);
    })
  }

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
            name="password"
            type="password"
            label="Password"
            placeholder="password"
            component={TextField}
          />
        </Form.Item>
        <Row className="auth-controls">
          <Link to={ROUTES.PASSWORD_RECOVERY}>Forgot your password?</Link>
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
