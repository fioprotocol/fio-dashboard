import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Wizard from './CreateAccountFormWizard';
import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import { isEmpty } from '../../helpers/verifying';
import { ROUTES } from '../../constants/routes';

import classes from './CreateAccountForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emailToUsername } from "../../utils";
import Pin from "./Pin";
import EmailPassword, { validate as validateEmailPassword } from "./EmailPassword";
import Confirmation from "./Confirmation";

const STEPS = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  PIN: 'PIN',
  PIN_CONFIRM: 'PIN_CONFIRM',
  CONFIRMATION: 'CONFIRMATION'
}

const STEPS_ORDER = {
  [STEPS.EMAIL_PASSWORD]: 0,
  [STEPS.PIN]: 1,
  [STEPS.PIN_CONFIRM]: 2,
  [STEPS.CONFIRMATION]: 3,
}

const setDataMutator = (args, state) => {
  const [name, data] = args
  let field = state.fields[name]

  if (field) {
    field.data = { ...field.data, ...data }
  }
}

export default class CreateAccountForm extends Component {
  constructor(props) {
    super();
    this.state = {
      passwordValidation: {
        length: { isChecked: false },
        lower: { isChecked: false },
        upper: { isChecked: false },
        number: { isChecked: false }
      },
      usernameAvailableLoading: props.usernameAvailableLoading,
      usernameError: null,
      step: STEPS.EMAIL_PASSWORD
    }
  }

  static propTypes = {
    resetSuccessState: PropTypes.func.isRequired,
    usernameIsAvailable: PropTypes.bool,
    usernameAvailableLoading: PropTypes.bool,
    usernameAvailable: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.usernameAvailableLoading !== state.usernameAvailableLoading) {
      return { usernameAvailableLoading: props.usernameAvailableLoading }
    }

    return null
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
    if (prevState.usernameAvailableLoading && !this.state.usernameAvailableLoading) {
      this.setState({ usernameError: !this.props.usernameIsAvailable }, () => {
        console.log(this.props.usernameIsAvailable);
        this.form && this.form.mutators && this.form.mutators.setDataMutator('email', {
          error: !this.props.usernameIsAvailable && (
            <span>
               This Email Address is already registered,{' '}
              <Link to=''>Sign-in</Link> instead
             </span>
          )
        })
      })
    }
  }

  componentWillUnmount() {
    this.props.resetSuccessState();
  }

  onUsersPageSubmit = (values, cb) => {
    if (this.props.usernameIsAvailable) {
      cb()
    }
    // todo: validate on click 'next'?
    const { email } = values
    this.props.usernameAvailable(emailToUsername(email));
  }

  isEmailExists = (e) => {
    const email = e.target.value
    this.props.usernameAvailable(emailToUsername(email));
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

  validateUser = (values) => {
    const { usernameIsAvailable } = this.props;
    const { passwordValidation, usernameError, step } = this.state;
    const passValid = {}

    // if (!usernameIsAvailable) {
    //   errors.email = usernameError ? (
    //     <span>
    //           This Email Address is already registered,{' '}
    //       <Link to=''>Sign-in</Link> instead
    //         </span>
    //   ) : '';
    // }

    if (!values.password) {
      Object.keys(passwordValidation).forEach(item => passValid[item] = false);
    }

    const errors = validateEmailPassword(values, passValid)

    this.passwordValidation(passValid);

    return errors;
  }

  validateConfirmPin = (values) => {
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

  // todo:
  handleSubmit = (values, form, cb) => {
    const { onSubmit } = this.props;
    const { step } = this.state;
    const isLastStep = step === STEPS.CONFIRMATION;
    const isFirstStep = step === STEPS.EMAIL_PASSWORD;
    if (isLastStep) {
      return onSubmit(values);
    } else if (isFirstStep) {
      this.onUsersPageSubmit(values, cb);
    } else {
      this.next(values);
    }
  };

  onNextStep = nextStep => {
    switch (nextStep) {
      case STEPS_ORDER[STEPS.PIN]: {
        this.setState({ step: STEPS.PIN })
        break
      }
      case STEPS_ORDER[STEPS.PIN_CONFIRM]: {
        this.setState({ step: STEPS.PIN_CONFIRM })
        break
      }
      case STEPS_ORDER[STEPS.CONFIRMATION]: {
        this.setState({ step: STEPS.CONFIRMATION })
        break
      }
      default:
        this.setState({ step: STEPS.EMAIL_PASSWORD })
    }
  }

  onPrevStep = prevStep => {
    switch (prevStep) {
      case STEPS_ORDER[STEPS.PIN]: {
        this.setState({ step: STEPS.PIN })
        break
      }
      case STEPS_ORDER[STEPS.PIN_CONFIRM]: {
        this.setState({ step: STEPS.PIN_CONFIRM })
        break
      }
      case STEPS_ORDER[STEPS.CONFIRMATION]: {
        this.setState({ step: STEPS.CONFIRMATION })
        break
      }
      default:
        this.setState({ step: STEPS.EMAIL_PASSWORD })
    }
  }

  renderForm = (formProps) => {
    const { handleSubmit, submitting, valid, pristine, form } = formProps;
    const { loading, usernameAvailableLoading } = this.props;
    const { step, passwordValidation } = this.state;

    this.form = form

    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <Wizard
          activePage={STEPS_ORDER[step]}
          actionDisabled={!valid || !pristine}
          loading={loading || submitting}
          onNext={this.onNextStep}
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
          <Wizard.Page onBack hideNext>
            <Pin isConfirm/>
          </Wizard.Page>
          <Wizard.Page hideBack>
            <Confirmation/>
          </Wizard.Page>
        </Wizard>
      </form>
    )
  }

  render() {
    const { signupSuccess, onSubmit } = this.props;
    const { isOpen, usernameError } = this.state;

    const formStyleName = signupSuccess ? 'form success' : 'form';
    return (
      <FormModalWrapper>
        <Form
          mutators={{ setDataMutator }}
          // initialValues={values}
          validate={this.validate}
          onSubmit={onSubmit}
        >
          {this.renderForm}
        </Form>
      </FormModalWrapper>
    );
  }
}
