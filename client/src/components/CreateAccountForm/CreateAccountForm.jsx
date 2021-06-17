import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Wizard from './CreateAccountFormWizard';
import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import { isEmpty } from '../../helpers/verifying';
import { ROUTES } from '../../constants/routes';
import { PIN_LENGTH } from '../../constants/form';

import classes from './CreateAccountForm.module.scss';
import {
  usernameAvailable,
  createAccount,
  checkUsernameAndPassword,
} from './middleware';
import { emailToUsername, setDataMutator } from '../../utils';
import Pin from './Pin';
import EmailPassword, {
  validate as validateEmailPassword,
} from './EmailPassword';
import Confirmation from './Confirmation';
import Success from './Success';

const STEPS = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  PIN: 'PIN',
  PIN_CONFIRM: 'PIN_CONFIRM',
  CONFIRMATION: 'CONFIRMATION',
  SUCCESS: 'SUCCESS',
};

const STEPS_ORDER = {
  [STEPS.EMAIL_PASSWORD]: 0,
  [STEPS.PIN]: 1,
  [STEPS.PIN_CONFIRM]: 2,
  [STEPS.CONFIRMATION]: 3,
  [STEPS.SUCCESS]: 4,
};

export default class CreateAccountForm extends Component {
  static propTypes = {
    resetSuccessState: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    serverSignUpLoading: PropTypes.bool,
  };

  constructor(props) {
    super();
    this.state = {
      passwordValidation: {
        length: { isChecked: false },
        lower: { isChecked: false },
        upper: { isChecked: false },
        number: { isChecked: false },
      },
      usernameAvailableLoading: false,
      usernameIsAvailable: false,
      step: STEPS.EMAIL_PASSWORD,
      account: null,
    };
  }

  componentDidMount() {
    const { location, replace } = this.props.history;
    if (!isEmpty(location.query) && location.query.email) {
      this.props.initialize({
        email: location.query.email,
      });
      replace(ROUTES.CREATE_ACCOUNT);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.signupSuccess && this.props.signupSuccess) {
      this.setState({ step: STEPS.SUCCESS });
    }
  }

  componentWillUnmount() {
    this.form.reset();
    this.form = null;
    this.props.resetSuccessState();
  }

  redirectToPrev = () => {
    const {
      values: { email },
    } = this.form.getState();

    this.props.setAccount(this.state.account);
    this.props.login({ email, password: this.state.account.id });
    this.props.history.push(
      (this.props.lastLocation && this.props.lastLocation.pathname) ||
        ROUTES.HOME,
    );
  };

  isEmailExists = async e => {
    const emailField = this.form.getFieldState('email');
    if (!emailField.valid) return emailField.blur();
    const email = e.target.value;
    this.setState({
      usernameAvailableLoading: true,
      usernameIsAvailable: false,
    });
    const { error } = await usernameAvailable(emailToUsername(email));
    this.setState({
      usernameAvailableLoading: false,
      usernameIsAvailable: !error,
    });

    this.form &&
      this.form.mutators &&
      this.form.mutators.setDataMutator('email', {
        error: !!error && (
          <span>
            This Email Address is already registered,{' '}
            <Link to="#" onClick={this.props.showLoginModal}>
              Sign-in
            </Link>{' '}
            instead
          </span>
        ),
      });

    return emailField.blur();
  };

  validate = values => {
    const { step } = this.state;
    if (step === STEPS.EMAIL_PASSWORD) {
      return this.validateUser(values);
    }
    if (step === STEPS.PIN_CONFIRM) {
      return this.validateConfirmPin(values);
    }
    return {};
  };

  validateUser = values => {
    const { passwordValidation } = this.state;
    const passValid = {};

    if (!values.password) {
      Object.keys(passwordValidation).forEach(
        item => (passValid[item] = false),
      );
    }

    const errors = validateEmailPassword(values, passValid);

    this.passwordValidation(passValid);

    return errors;
  };

  validateConfirmPin = values => {
    const errors = {};
    if (
      values.confirmPin &&
      values.confirmPin.length === PIN_LENGTH &&
      values.pin !== values.confirmPin
    ) {
      errors.confirmPin = 'Invalid PIN Entry - Try again or start over';
    }
    return errors;
  };

  passwordValidation = passValid => {
    const { passwordValidation } = this.state;

    const retObj = {};

    Object.keys(passwordValidation).forEach(key => {
      retObj[key] = {};
      retObj[key].isChecked = passValid[key];
    });

    if (JSON.stringify(retObj) === JSON.stringify(passwordValidation)) return;

    this.setState({
      passwordValidation: {
        ...retObj,
      },
    });
  };

  handleSubmit = async values => {
    const { onSubmit } = this.props;
    const { step } = this.state;

    switch (step) {
      case STEPS.EMAIL_PASSWORD: {
        const { email, password, confirmPassword } = values;
        this.setState({ loading: true });
        const { errors } = await checkUsernameAndPassword(
          emailToUsername(email),
          password,
          confirmPassword,
        );
        this.setState({ loading: false });
        if (!Object.values(errors).length)
          return this.setState({ step: STEPS.PIN });
        return errors;
      }
      case STEPS.PIN: {
        const { pin } = values;
        if (!pin || (pin && pin.length < PIN_LENGTH)) return;
        this.setState({ step: STEPS.PIN_CONFIRM });
        break;
      }
      case STEPS.PIN_CONFIRM: {
        const { confirmPin } = values;
        if (!confirmPin || (confirmPin && confirmPin.length < PIN_LENGTH))
          return;
        this.setState({ step: STEPS.CONFIRMATION });
        break;
      }
      case STEPS.CONFIRMATION: {
        this.setState({ step: STEPS.SUCCESS });

        const { email, password, pin, confirmPin } = values;
        this.setState({ loading: true });
        const { account, errors } = await createAccount(
          emailToUsername(email),
          password,
          pin,
        );
        this.setState({ loading: false });
        if (!Object.values(errors).length) {
          this.setState({ account });
          return onSubmit({
            username: emailToUsername(email),
            email,
            pin,
            confirmPin,
            password: account.id,
          });
        }
        return errors;
      }
      default:
        return {};
    }
  };

  onPrevStep = () => {
    const { step } = this.state;
    switch (step) {
      case STEPS.PIN: {
        this.form.change('pin', '');
        this.setState({ step: STEPS.EMAIL_PASSWORD });
        break;
      }
      case STEPS.PIN_CONFIRM:
      case STEPS.CONFIRMATION: {
        this.form.change('pin', '');
        this.form.change('confirmPin', '');
        this.setState({ step: STEPS.PIN });
        break;
      }
      default:
        this.setState({ step: STEPS.EMAIL_PASSWORD });
    }
  };

  renderForm = formProps => {
    const {
      handleSubmit,
      submitting,
      modifiedSinceLastSubmit,
      hasSubmitErrors,
      hasValidationErrors,
      pristine,
      values,
      errors,
      form,
    } = formProps;
    const { serverSignUpLoading, signupSuccess } = this.props;
    const {
      step,
      passwordValidation,
      usernameAvailableLoading,
      loading,
    } = this.state;

    this.form = form;

    return (
      <form
        onSubmit={handleSubmit}
        className={classnames(
          classes.form,
          step === STEPS.SUCCESS && classes.formSuccess,
        )}
      >
        <Wizard
          activePage={STEPS_ORDER[step]}
          actionDisabled={
            (hasSubmitErrors && !modifiedSinceLastSubmit) ||
            hasValidationErrors ||
            pristine
          }
          loading={loading || submitting || serverSignUpLoading}
          onPrev={this.onPrevStep}
        >
          <Wizard.Page
            bottomText={
              <p>
                Already have an account?{' '}
                <Link to="#" onClick={this.props.showLoginModal}>
                  Sign In
                </Link>
              </p>
            }
          >
            <EmailPassword
              onEmailBlur={this.isEmailExists}
              passwordValidation={passwordValidation}
              loading={loading}
              usernameAvailableLoading={usernameAvailableLoading}
            />
          </Wizard.Page>
          <Wizard.Page hideNext>
            <Pin />
          </Wizard.Page>
          <Wizard.Page hideNext>
            <Pin
              isConfirm
              error={errors.confirmPin}
              startOver={this.onPrevStep}
            />
          </Wizard.Page>
          <Wizard.Page hideBack hideNext>
            <Confirmation data={values} errors={errors} />
          </Wizard.Page>
          <Wizard.Page hideBack hideNext>
            <Success
              redirect={this.redirectToPrev}
              signupSuccess={signupSuccess}
            />
          </Wizard.Page>
        </Wizard>
      </form>
    );
  };

  render() {
    return (
      <FormModalWrapper>
        <Form
          mutators={{ setDataMutator }}
          validate={this.validate}
          onSubmit={this.handleSubmit}
        >
          {this.renderForm}
        </Form>
      </FormModalWrapper>
    );
  }
}
