import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';

import Wizard from './CreateAccountFormWizard';
import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import { isEmpty } from '../../helpers/verifying';
import { ROUTES } from '../../constants/routes';

import classes from './CreateAccountForm.module.scss';
import { usernameAvailable, createAccount, checkUsernameAndPassword } from './middleware';
import { emailToUsername } from "../../utils";
import Pin from "./Pin";
import EmailPassword, { validate as validateEmailPassword } from "./EmailPassword";
import Confirmation from "./Confirmation";
import Success from "./Success";

const STEPS = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  PIN: 'PIN',
  PIN_CONFIRM: 'PIN_CONFIRM',
  CONFIRMATION: 'CONFIRMATION',
  SUCCESS: 'SUCCESS'
}

const STEPS_ORDER = {
  [STEPS.EMAIL_PASSWORD]: 0,
  [STEPS.PIN]: 1,
  [STEPS.PIN_CONFIRM]: 2,
  [STEPS.CONFIRMATION]: 3,
  [STEPS.SUCCESS]: 4,
}

const setDataMutator = (args, state) => {
  const [name, data] = args
  let field = state.fields[name]

  if (field) {
    field.data = { ...field.data, ...data }
  }
}

export default class CreateAccountForm extends Component {

  static propTypes = {
    resetSuccessState: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super();
    this.state = {
      passwordValidation: {
        length: { isChecked: false },
        lower: { isChecked: false },
        upper: { isChecked: false },
        number: { isChecked: false }
      },
      usernameAvailableLoading: false,
      usernameIsAvailable: false,
      step: STEPS.EMAIL_PASSWORD
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.usernameAvailableLoading !== state.usernameAvailableLoading) {
  //     return { usernameAvailableLoading: props.usernameAvailableLoading }
  //   }
  //
  //   return null
  // }

  componentDidMount() {
    const { location, replace } = this.props.history;
    if (!isEmpty(location.query) && location.query.email) {
      this.props.initialize({
        email: location.query.email,
      });
      replace(ROUTES.CREATE_ACCOUNT);
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.usernameAvailableLoading && !this.state.usernameAvailableLoading) {
  //     this.setState({ usernameError: !this.props.usernameIsAvailable }, () => {
  //     })
  //   }
  // }

  componentWillUnmount() {
    this.props.resetSuccessState();
  }

  isEmailExists = async e => {
    const emailField = this.form.getFieldState('email')
    if (!emailField.valid) return
    const email = e.target.value
    this.setState({ usernameAvailableLoading: true, usernameIsAvailable: false })
    const { error } = await usernameAvailable(emailToUsername(email));
    this.setState({ usernameAvailableLoading: false, usernameIsAvailable: !error })

    this.form && this.form.mutators && this.form.mutators.setDataMutator('email', {
      error: !!error && (
        <span>
               This Email Address is already registered,{' '}
          <Link to=''>Sign-in</Link> instead
             </span>
      )
    })
  }

  validate = values => {
    const { step } = this.state
    if (step === STEPS.EMAIL_PASSWORD) {
      return this.validateUser(values)
    }
    if (step === STEPS.PIN_CONFIRM) {
      return this.validateConfirmPin(values)
    }
    return {}
  }

  validateUser = values => {
    const { passwordValidation } = this.state;
    const passValid = {}

    if (!values.password) {
      Object.keys(passwordValidation).forEach(item => passValid[item] = false);
    }

    const errors = validateEmailPassword(values, passValid)

    this.passwordValidation(passValid);

    return errors;
  }

  validateConfirmPin = values => {
    const errors = {};
    if (values.confirmPin && values.confirmPin.length === 6 &&
      values.pin !== values.confirmPin
    ) {
      errors.confirmPin = 'Invalid PIN Entry - Try again or start over';
    }
    return errors;
  }

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
        ...retObj
      },
    });
  }

  handleSubmit = async values => {
    const { onSubmit } = this.props;
    const { step } = this.state;

    switch (step) {
      case STEPS.EMAIL_PASSWORD: {
        const { email, password, confirmPassword } = values
        this.setState({ loading: true })
        const { errors } = await checkUsernameAndPassword(emailToUsername(email), password, confirmPassword);
        this.setState({ loading: false })
        if (!Object.values(errors).length)
          return this.setState({ step: STEPS.PIN })
        return errors
      }
      case STEPS.PIN: {
        this.setState({ step: STEPS.PIN_CONFIRM })
        break
      }
      case STEPS.PIN_CONFIRM: {
        this.setState({ step: STEPS.CONFIRMATION })
        break
      }
      case STEPS.CONFIRMATION: {
        const { email, password, pin } = values
        this.setState({ loading: true })
        const { errors } = await createAccount(emailToUsername(email), password, pin);
        // onSubmit(values); // todo: create account on server
        this.setState({ loading: false })
        if (!Object.values(errors).length)
          return this.setState({ step: STEPS.SUCCESS }) // todo: show success page
        return errors
      }
      default:
        return {}
    }
  };

  onPrevStep = () => {
    const { step } = this.state
    switch (step) {
      case STEPS.PIN: {
        this.setState({ step: STEPS.EMAIL_PASSWORD })
        break
      }
      case STEPS.PIN_CONFIRM:
      case STEPS.CONFIRMATION: {
        this.setState({ step: STEPS.PIN })
        break
      }
      default:
        this.setState({ step: STEPS.EMAIL_PASSWORD })
    }
  }

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
      form } = formProps;
    const { loading } = this.props;
    const { step, passwordValidation, usernameAvailableLoading } = this.state;

    this.form = form

    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <Wizard
          activePage={STEPS_ORDER[step]}
          actionDisabled={(hasSubmitErrors && !modifiedSinceLastSubmit) || hasValidationErrors || pristine}
          loading={loading || submitting}
          onPrev={this.onPrevStep}
        >
          <Wizard.Page
            bottomText={
              <p>
                Already have an account? <Link to=''>Sign In</Link>
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
            <Pin/>
          </Wizard.Page>
          <Wizard.Page hideNext>
            <Pin isConfirm error={errors.confirmPin} startOver={this.onPrevStep} />
          </Wizard.Page>
          <Wizard.Page hideBack hideNext>
            <Confirmation data={values} errors={errors} loading={loading} />
          </Wizard.Page>
          <Wizard.Page hideBack hideNext>
            <Success />
          </Wizard.Page>
        </Wizard>
      </form>
    )
  }

  render() {
    const { signupSuccess } = this.props;

    const formStyleName = signupSuccess ? 'form success' : 'form';
    return (
      <FormModalWrapper>
        <Form
          mutators={{ setDataMutator }}
          // initialValues={values}
          validate={this.validate}
          onSubmit={this.handleSubmit}
        >
          {this.renderForm}
        </Form>
      </FormModalWrapper>
    );
  }
}
