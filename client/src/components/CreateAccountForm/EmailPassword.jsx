import React, { Component } from 'react';
import { Field } from 'react-final-form';
import classnames from 'classnames';
import validator from 'email-validator';
import { OnFocus } from 'react-final-form-listeners';

import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';

import classes from './CreateAccountForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const VALIDATION_TITLES = {
  length: 'Must have at least 10 characters',
  lower: 'Must have at least 1 lower case letter',
  upper: 'Must have at least 1 upper case letter',
  number: 'Must have at least 1 number',
};

export const validate = (values, passValid) => {
  const errors = {};
  if (!values.email || !validator.validate(values.email)) {
    errors.email = 'Invalid Email Address';
  }

  if (!values.password) {
    errors.password = 'Password Field Should Be Filled';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Password Field Should Be Filled';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  //special password validate rules
  if (values && values.password && values.password.length >= 10) {
    passValid.length = true;
  } else {
    passValid.length = false;
    errors.password = VALIDATION_TITLES.length;
  }

  if (
    values &&
    values.password &&
    values.password.search(/^(?=.*[a-z])/) >= 0
  ) {
    passValid.lower = true;
  } else {
    passValid.lower = false;
    errors.password = VALIDATION_TITLES.lower;
  }

  if (
    values &&
    values.password &&
    values.password.search(/^(?=.*[A-Z])/) >= 0
  ) {
    passValid.upper = true;
  } else {
    passValid.upper = false;
    errors.password = VALIDATION_TITLES.upper;
  }

  if (values && values.password && values.password.search(/^(?=.*\d)/) >= 0) {
    passValid.number = true;
  } else {
    passValid.number = false;
    errors.password = VALIDATION_TITLES.number;
  }

  return errors;
};

export default class EmailPassword extends Component {
  constructor(props) {
    super();
    this.state = {
      passwordValidation: {
        length: { isChecked: false },
        lower: { isChecked: false },
        upper: { isChecked: false },
        number: { isChecked: false },
      },
      usernameAvailableLoading: props.usernameAvailableLoading,
      usernameError: null,
      showValidationRules: false,
    };
  }

  handleFocus = () => {
    this.setState({ showValidationRules: true });
  };

  renderPassValidBadge = () => {
    const { passwordValidation } = this.props;
    const { showValidationRules } = this.state;
    return (
      <div
        className={classnames(
          classes.badge,
          showValidationRules && classes.open,
        )}
      >
        {Object.keys(passwordValidation).map(key => (
          <div
            key={VALIDATION_TITLES[key]}
            className={classes.validationWrapper}
          >
            <FontAwesomeIcon
              icon="check-circle"
              className={classnames(
                classes.icon,
                classes.checkedIcon,
                passwordValidation[key].isChecked && classes.checked,
              )}
            />
            <p className={classes.textWrapper}>{VALIDATION_TITLES[key]}</p>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { onEmailBlur, loading, usernameAvailableLoading } = this.props;

    return (
      <>
        <FormHeader
          title="Create Your FIO Account"
          isDoubleColor
          header="Set 1 of 2"
          subtitle="Simply choose a username and password. We will use these to encrypt your account."
        />
        <Field
          name="email"
          component={Input}
          type="text"
          placeholder="Enter Your Email Address"
          disabled={loading || usernameAvailableLoading}
          loading={usernameAvailableLoading}
          onBlur={onEmailBlur}
        />
        {this.renderPassValidBadge()}
        <Field
          name="password"
          component={Input}
          type="password"
          placeholder="Choose a Password"
          disabled={loading}
        />
        <OnFocus name="password">{this.handleFocus}</OnFocus>
        <Field
          name="confirmPassword"
          component={Input}
          type="password"
          placeholder="Confirm Password"
          disabled={loading}
        />
      </>
    );
  }
}
