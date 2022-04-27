import React, { Component } from 'react';
import { Field } from 'react-final-form';
import validator from 'email-validator';
import { OnFocus } from 'react-final-form-listeners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import FormHeader from '../FormHeader/FormHeader';
import Input, { INPUT_UI_STYLES } from '../Input/Input';

import {
  FormValues,
  PasswordValidation,
  PasswordValidationState,
  ValidationErrors,
} from './types';

import classes from './CreateAccountForm.module.scss';

export const VALIDATION_TITLES = {
  length: 'Must have at least 10 characters',
  lower: 'Must have at least 1 lower case letter',
  upper: 'Must have at least 1 upper case letter',
  number: 'Must have at least 1 number',
};

export const validate = (
  values: FormValues,
  passValid: PasswordValidation,
): ValidationErrors => {
  const errors: ValidationErrors = {};
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

type Props = {
  usernameAvailableLoading: boolean;
  loading: boolean;
  passwordValidation: PasswordValidationState;
  onEmailBlur: (e: React.FocusEvent<HTMLInputElement>) => Promise<void | null>;
};

type LocalState = {
  passwordValidation: PasswordValidationState;
  usernameAvailableLoading: boolean;
  showValidationRules: boolean;
};

export default class EmailPassword extends Component<Props, LocalState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      passwordValidation: {
        length: { isChecked: false },
        lower: { isChecked: false },
        upper: { isChecked: false },
        number: { isChecked: false },
      },
      usernameAvailableLoading: props.usernameAvailableLoading,
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
            key={VALIDATION_TITLES[key as keyof PasswordValidationState]}
            className={classes.validationWrapper}
          >
            <FontAwesomeIcon
              icon="check-circle"
              className={classnames(
                classes.icon,
                classes.checkedIcon,
                passwordValidation[key as keyof PasswordValidationState]
                  .isChecked && classes.checked,
              )}
            />
            <p className={classes.textWrapper}>
              {VALIDATION_TITLES[key as keyof PasswordValidationState]}
            </p>
          </div>
        ))}
      </div>
    );
  };

  render(): React.ReactElement {
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
        <Field
          name="addEmailToPromoList"
          // @ts-ignore // todo: fix type issue:  SupportedInputs | React.ComponentType<FieldRenderProps<boolean, HTMLElement>>
          component={Input}
          type="checkbox"
          label="Receive periodic updates and promotional emails from FIO"
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
          hasSmallText={true}
          defaultValue={true}
          hasThinText={true}
        />
      </>
    );
  }
}
