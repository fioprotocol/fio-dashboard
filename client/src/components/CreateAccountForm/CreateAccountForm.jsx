import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import validator from 'email-validator';

import Wizard from './CreateAccountFormWizard';
import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import FormHeader from '../FormHeader/FormHeader';
import Input from '../Input/Input';
import { isEmpty } from '../../helpers/verifying';
import { ROUTES } from '../../constants/routes';

import classes from './CreateAccountForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VALIDATION_TITLES = {
  length: 'Must have at least 10 characters',
  lower: 'Must have at least 1 lower case letter',
  upper: 'Must have at least 1 upper case letter',
  number: 'Must have at least 1 number',
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
      isOpen: true,
      passwordValidation: {
        length: { isChecked: false },
        lower: { isChecked: false },
        upper: { isChecked: false },
        number: { isChecked: false }
      },
      usernameAvailableLoading: props.usernameAvailableLoading,
      usernameError: null,
      goToPin: null
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

        console.log(this.userForm);
        this.userForm && this.userForm.mutators && this.userForm.mutators.setDataMutator('email', { error: !this.props.usernameIsAvailable })
      }
      )
    }
  }

  componentWillUnmount() {
    this.props.resetSuccessState();
  }

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
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

  onUsersPageSubmit = (values, next, cb) => {
    if (this.props.usernameIsAvailable) {
      cb()
      return next(values)
    }
    // todo: validate on click 'next'?
    const { email } = values
    if (email && email.indexOf('@') > 0) this.props.usernameAvailable(email.split('@')[0]);
  }

  isEmailExists = (e) => {
    const email = e.target.value
    if (email && email.indexOf('@') > 0) this.props.usernameAvailable(email.split('@')[0]);
  }

  renderPassValidBadge = () => {
    const { passwordValidation } = this.state;

    return (
      <div className={classnames(classes.badge)}>
        {Object.keys(passwordValidation).map((key) => (
          <div
            key={VALIDATION_TITLES[key]}
            className={classes.validationWrapper}
          >
            <FontAwesomeIcon
              icon='check-circle'
              className={classnames(
                classes.icon,
                classes.checkedIcon,
                passwordValidation[key].isChecked && classes.checked
              )}
            />
            <p className={classes.textWrapper}>{VALIDATION_TITLES[key]}</p>
          </div>
        ))}
      </div>
    );
  }

  validateUsersPage = (values) => {
    const { usernameIsAvailable } = this.props;
    const { passwordValidation, usernameError } = this.state;
    const errors = {};
    const passValid = {};
    if (!values.email || !validator.validate(values.email)) {
      errors.email = 'Invalid Email Address';
    }

    if (!usernameIsAvailable) {
      errors.email = usernameError ? (
        <span>
              This Email Address is already registered,{' '}
          <Link to=''>Sign-in</Link> instead
            </span>
      ) : '';
    }

    if (!values.password) {
      errors.password = 'Password Field Should Be Filled';
      Object.keys(passwordValidation).forEach(item => passValid[item] = false);
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
    }

    if (
      values &&
      values.password &&
      values.password.search(/^(?=.*[a-z])/) >= 0
    ) {
      passValid.lower = true;
    } else {
      passValid.lower = false;
    }

    if (
      values &&
      values.password &&
      values.password.search(/^(?=.*[A-Z])/) >= 0
    ) {
      passValid.upper = true;
    } else {
      passValid.upper = false;
    }

    if (
      values &&
      values.password &&
      values.password.search(/^(?=.*\d)/) >= 0
    ) {
      passValid.number = true;
    } else {
      passValid.number = false;
    }

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

  render() {
    const { signupSuccess, loading, usernameAvailableLoading, onSubmit } = this.props;
    const { isOpen, usernameError } = this.state;

    /* MOCKED DATA REMOVE ON LOGIC END */
    const data = {
      email: 'georgeworrell@decenthx.com',
      password: 'FIORocks!',
      pin: '123456',
    };

    const formStyleName = signupSuccess ? 'form success' : 'form';
    return (
      <FormModalWrapper>
        <Wizard
          onSubmit={onSubmit}
          onUserSubmit={this.onUsersPageSubmit}
        >
          <Wizard.Page
            setDataMutator={setDataMutator}
            setForm={form => this.userForm = form}
            bottomText={
              <p>
                Already have an account? <Link to=''>Sign In</Link>
              </p>
            }
            validate={this.validateUsersPage}
            loading={loading}
          >
            <FormHeader
              title='Create Your FIO Account'
              isDoubleColor
              header='Set 1 of 2'
              subtitle='Simply choose a username and password. We will use these to encrypt your account.'
            />
            <Field
              name='email'
              component={Input}
              type='text'
              placeholder='Enter Your Email Address'
              disabled={loading || usernameAvailableLoading}
              loading={usernameAvailableLoading}
              onBlur={this.isEmailExists}
            />
            {this.renderPassValidBadge()}
            <Field
              name='password'
              component={Input}
              type='password'
              placeholder='Choose a Password'
              disabled={loading}
            />
            <Field
              name='confirmPassword'
              component={Input}
              type='password'
              placeholder='Confirm Password'
              disabled={loading}
            />
          </Wizard.Page>
          <Wizard.Page
            hideNext
          >
            <FormHeader
              title='Enter PIN'
              isDoubleColor
              header='Set 2 of 2'
              subtitle='Enter a 6 digit PIN to use for sign in and transaction approvals'
            />
            <Field name='pin' component={Input} disabled={loading} />
          </Wizard.Page>
          <Wizard.Page
            hideNext
            onBack
            validate={this.validateConfirmPin}
          >
            <FormHeader
              title='Confirm PIN'
              isDoubleColor
              header='Set 2 of 2'
              subtitle='Enter a 6 digit PIN to use for sign in and transaction approvals'
            />
            <Field name='confirmPin' component={Input} disabled={loading} />
          </Wizard.Page>
          <Wizard.Page
            hideBack
          >
            <FormHeader
              header='Almost Done!'
              title='Write It Down!'
              subtitle='Please write down your account information now'
              isSubNarrow
            />
            <div className={classes.infoBadge}>
              <FontAwesomeIcon icon='info-circle' className={classes.icon} />
              <div className={classes.textWrapper}>
                <p className='mb-0 mt-3'>
                  If you lose your account information, you’ll lose access to
                  your account permanently.
                </p>
                <p className='mb-0 mt-3'>Write down and store it securely.</p>
              </div>
            </div>
            <div className={classes.accountInfo}>
              <div className={classes.header} onClick={this.toggleOpen}>
                <div className={classes.text}>Show Account Information</div>
                <FontAwesomeIcon
                  icon={isOpen ? 'chevron-up' : 'chevron-down'}
                  className={classes.icon}
                />
              </div>
              <div
                className={classnames(
                  classes.badge,
                  isOpen && classes.open,
                  classes.roll
                )}
              >
                <Row className='mx-3 pt-3'>
                  <Col xs={1}>
                    <FontAwesomeIcon
                      icon='user-circle'
                      className={classes.icon}
                    />
                  </Col>
                  <Col xs={3}>Email</Col>
                  <Col xs={6}>{data.email}</Col>
                </Row>
                <Row className='mx-3 py-2'>
                  <Col xs={1}>
                    <FontAwesomeIcon icon='ban' className={classes.icon} />
                  </Col>
                  <Col xs={3}>Password</Col>
                  <Col xs={6}>{data.password}</Col>
                </Row>
                <Row className='mx-3 pb-2'>
                  <Col xs={1}>
                    <FontAwesomeIcon icon='keyboard' className={classes.icon} />
                  </Col>
                  <Col xs={3}>PIN</Col>
                  <Col xs={6}>{data.pin}</Col>
                </Row>
              </div>
            </div>
          </Wizard.Page>
        </Wizard>
      </FormModalWrapper>
    );
  }
}
