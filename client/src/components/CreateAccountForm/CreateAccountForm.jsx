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

export default class CreateAccountForm extends Component {
  constructor(props) {
    super();
    this.state = {
      isOpen: true,
      passwordValidation: {
        length: {
          title: 'Must have at least 10 characters',
          isChecked: false,
        },
        lower: {
          title: 'Must have at least 1 lower case letter',
          isChecked: false,
        },
        upper: {
          title: 'Must have at least 1 upper case letter',
          isChecked: false,
        },
        number: {
          title: 'Must have at least 1 number',
          isChecked: false,
        }
      },
    }
  }
  static propTypes = {
    resetSuccessState: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  };

  componentDidMount() {
    const { location, replace } = this.props.history;
    if (!isEmpty(location.query) && location.query.email) {
      this.props.initialize({
        email: location.query.email,
      });
      replace(ROUTES.CREATE_ACCOUNT);
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
      retObj[key].title = passwordValidation[key].title;
      retObj[key].isChecked = passValid[key];
    });

    if (JSON.stringify(retObj) === JSON.stringify(passwordValidation)) return;

    this.setState({
      passwordValidation: {
        ...retObj
      },
    });
  }

  isEmailExists = email => {
    //TO DO add logic to check email
  }

  renderPassValidBadge = () => {
    const { passwordValidation } = this.state;

    return (
      <div className={classnames(classes.badge)}>
        {Object.values(passwordValidation).map((values) => (
          <div key={values.title} className={classes.validationWrapper}>
            <FontAwesomeIcon
              icon='check-circle'
              className={classnames(
                classes.icon,
                classes.checkedIcon,
                values.isChecked && classes.checked
              )}
            />
            <p className={classes.textWrapper}>{values.title}</p>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { signupSuccess, loading, onSubmit } = this.props;
    const { isOpen, passwordValidation } = this.state;

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
          // initialValues={{ employed: true, stooge: 'larry' }}
          onSubmit={onSubmit}
        >
          <Wizard.Page
            bottomText={
              <p>
                Already have an account? <Link to=''>Sign In</Link>
              </p>
            }
            validate={(values) => {
              const errors = {};
              const passValid = {};
              if (!values.email || !validator.validate(values.email)) {
                errors.email = 'Invalid Email Address';
              }

              if (this.isEmailExists(values.email)) {
                errors.email = (
                  <span>
                    This Email Address is already registered,{' '}
                    <Link to=''>Sign-in</Link> instead
                  </span>
                );
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
            }}
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
            />
            {this.renderPassValidBadge()}
            <Field
              name='password'
              component={Input}
              type='password'
              placeholder='Choose a Password'
            />
            <Field
              name='confirmPassword'
              component={Input}
              type='password'
              placeholder='Confirm Password'
            />
          </Wizard.Page>
          <Wizard.Page
            hideNext
            validate={(values) => {
              console.log(values)
              const errors = {};
              //TODO pin validation logic
              return errors;
            }}
          >
            <FormHeader
              title='Enter PIN'
              isDoubleColor
              header='Set 2 of 2'
              subtitle='Enter a 6 digit PIN to use for sign in and transaction approvals'
            />
            <Field name='pin' component={Input} />
          </Wizard.Page>
          <Wizard.Page
          // hideNext
          // validate={(values) => {
          //   const errors = {};
          //   if (!values.toppings) {
          //     errors.toppings = 'Required';
          //   } else if (values.toppings.length < 2) {
          //     errors.toppings = 'Choose more';
          //   }
          //   return errors;
          // }}
          >
            <FormHeader
              title='Confirm PIN'
              isDoubleColor
              header='Set 2 of 2'
              subtitle='Enter a 6 digit PIN to use for sign in and transaction approvals'
            />
            <Field name='pin' component={Input} type='password' />
          </Wizard.Page>
          <Wizard.Page
            hideBack
            // validate={(values) => {
            //   const errors = {};
            //   if (!values.notes) {
            //     errors.notes = 'Required';
            //   }
            //   return errors;
            // }}
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
