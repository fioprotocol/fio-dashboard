import React from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import { Link } from 'react-router-dom';
import { WithLastLocationProps } from 'react-router-last-location';
import classnames from 'classnames';

import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

import Wizard from './CreateAccountFormWizard';
import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import GenericErrorModal from '../Modal/GenericErrorModal/GenericErrorModal';
import Pin from './Pin';
import Confirmation from './Confirmation';
import Success from './Success';

import { ROUTES } from '../../constants/routes';
import { PIN_LENGTH } from '../../constants/form';
import {
  DEFAULT_WALLET_OPTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';

import EmailPassword, {
  validate as validateEmailPassword,
} from './EmailPassword';
import {
  usernameAvailable,
  createAccount,
  checkUsernameAndPassword,
  checkEdgeLogin,
} from './middleware';
import { emailToUsername, getWalletKeys, setDataMutator } from '../../utils';
import { emailAvailable } from '../../api/middleware/auth';

import {
  EmailConfirmationStateData,
  FioWalletDoublet,
  RedirectLinkData,
  RefProfile,
  ContainedFlowQueryParams,
  WalletKeysObj,
} from '../../types';
import { FormValues, PasswordValidationState } from './types';

import classes from './CreateAccountForm.module.scss';

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

type Location = {
  location: {
    query?: {
      email?: string;
    };
  };
};

type State = {
  passwordValidation: PasswordValidationState;
  usernameAvailableLoading: boolean;
  usernameIsAvailable: boolean;
  step: string;
  keys: WalletKeysObj;
  loading: boolean;
  retrySignup: boolean;
};

type OwnProps = {
  resetSuccessState: () => void;
  makeNonce: (username: string, keys: WalletKeysObj) => void;
  showLoginModal: () => void;
  onSubmit: (params: {
    username: string;
    email: string;
    fioWallets: FioWalletDoublet[];
    refCode?: string;
    stateData?: EmailConfirmationStateData;
    addEmailToPromoList: boolean;
  }) => void;
  signupSuccess: boolean;
  isRefSet: boolean;
  isContainedFlow: boolean;
  refProfileInfo: RefProfile | null;
  containedFlowQueryParams: ContainedFlowQueryParams | null;
  edgeAuthLoading: boolean;
  serverSignUpLoading: boolean;
  redirectLink: RedirectLinkData;
};

type Props = OwnProps & WithLastLocationProps & Location;

export default class CreateAccountForm extends React.Component<Props, State> {
  form: FormApi<FormValues> | null;

  constructor(props: Props) {
    super(props);
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
      keys: {},
      loading: false,
      retrySignup: false,
    };

    this.form = null;
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (!prevProps.signupSuccess && this.props.signupSuccess) {
      this.setState({ step: STEPS.SUCCESS });
    }
  }

  componentWillUnmount(): void {
    this.form?.reset();
    this.form = null;
    this.props.resetSuccessState();
  }

  openLogin = () => {
    this.props.showLoginModal();
  };

  onFinish = () => {
    const {
      values: { email },
    } = this.form ? this.form.getState() : { values: { email: undefined } };

    this.props.makeNonce(emailToUsername(email), this.state.keys);
    this.props.history.push(
      (this.props.lastLocation && this.props.lastLocation.pathname) ||
        ROUTES.HOME,
    );
  };

  setEmailError = (emailError: string) => {
    this.form &&
      this.form.mutators &&
      this.form.mutators.setDataMutator(
        'email',
        {
          // @ts-ignore
          error: !!emailError && (
            <span>
              This Email Address is already registered,{' '}
              <Link to="#" onClick={this.openLogin}>
                Sign-in
              </Link>{' '}
              instead
            </span>
          ),
        },
        {},
      );
  };

  isEmailExists = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!this.form) return null;

    const emailField = this.form.getFieldState('email');
    if (!emailField?.valid && !emailField?.modifiedSinceLastSubmit)
      return emailField?.blur();
    const email = e.target.value;
    this.setState({
      usernameAvailableLoading: true,
      usernameIsAvailable: false,
      retrySignup: false,
    });
    const { error: emailError } = await emailAvailable(email);
    const { error: usernameError } = await usernameAvailable(
      emailToUsername(email),
    );

    this.setState({
      usernameAvailableLoading: false,
      usernameIsAvailable: !emailError,
      retrySignup: !emailError && !!usernameError,
    });

    this.setEmailError(emailError);

    return emailField?.blur();
  };

  validate = (values: FormValues) => {
    const { step } = this.state;
    if (step === STEPS.EMAIL_PASSWORD) {
      return this.validateUser(values);
    }
    if (step === STEPS.PIN_CONFIRM) {
      return this.validateConfirmPin(values);
    }
    return {};
  };

  validateUser = (values: FormValues) => {
    const { passwordValidation } = this.state;
    const passValid: { [rule: string]: boolean } = {};

    if (!values.password) {
      Object.keys(passwordValidation).forEach(
        (item: string) => (passValid[item] = false),
      );
    }

    const errors = validateEmailPassword(values, passValid);

    this.passwordValidation(passValid);

    return errors;
  };

  validateConfirmPin = (values: FormValues) => {
    const errors: { [field: string]: string } = {};
    if (
      values.confirmPin &&
      values.confirmPin.length === PIN_LENGTH &&
      values.pin !== values.confirmPin
    ) {
      errors.confirmPin = 'Invalid PIN Entry - Try again or start over';
    }
    return errors;
  };

  passwordValidation = (passValid: { [rule: string]: boolean }) => {
    const { passwordValidation } = this.state;

    const retObj: PasswordValidationState = {
      length: { isChecked: false },
      lower: { isChecked: false },
      upper: { isChecked: false },
      number: { isChecked: false },
    };

    Object.keys(passwordValidation).forEach(key => {
      retObj[key as keyof PasswordValidationState] = {};
      retObj[key as keyof PasswordValidationState].isChecked = passValid[key];
    });

    if (JSON.stringify(retObj) === JSON.stringify(passwordValidation)) return;

    this.setState({
      passwordValidation: {
        ...retObj,
      },
    });
  };

  confirm = async (
    account: EdgeAccount,
    fioWallet: EdgeCurrencyWallet,
    values: FormValues,
  ) => {
    const {
      onSubmit,
      isRefSet,
      refProfileInfo,
      containedFlowQueryParams,
      redirectLink,
      isContainedFlow,
    } = this.props;
    const { email, addEmailToPromoList } = values;

    const fioWallets: FioWalletDoublet[] = [
      {
        id: '',
        edgeId: fioWallet.id,
        name: DEFAULT_WALLET_OPTIONS.name,
        publicKey: fioWallet.publicWalletInfo.keys.publicKey,
        from: WALLET_CREATED_FROM.EDGE,
      },
    ];
    this.setState({ keys: getWalletKeys([fioWallet]) });
    await account.logout();

    let stateData: EmailConfirmationStateData = {
      redirectLink: redirectLink ? redirectLink.pathname : '',
    };
    if (isRefSet) {
      stateData = {
        ...stateData,
        refCode: refProfileInfo?.code,
      };
    }
    if (isContainedFlow) {
      stateData = {
        ...stateData,
        containedFlowQueryParams: containedFlowQueryParams || undefined,
      };
    }
    return onSubmit({
      username: emailToUsername(email),
      email,
      fioWallets,
      refCode: isRefSet ? refProfileInfo?.code : '',
      stateData,
      addEmailToPromoList,
    });
  };

  handleSubmit = async (values: FormValues) => {
    const { step, retrySignup } = this.state;

    switch (step) {
      case STEPS.EMAIL_PASSWORD: {
        const { email, password, confirmPassword } = values;
        this.setState({ loading: true });

        // Retry signup if there is no user on our end
        if (retrySignup) {
          const { account, fioWallet, errors } = await checkEdgeLogin(
            emailToUsername(email),
            password,
          );
          if (errors.username) {
            this.setEmailError(errors.username);
            return this.setState({
              loading: false,
              usernameIsAvailable: false,
            });
          }

          if (account) {
            this.setState({
              step: STEPS.SUCCESS,
              loading: false,
              retrySignup: false,
            });
            await this.confirm(account, fioWallet, values);
          }

          return errors;
        }

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

        const { email, password, pin } = values;
        this.setState({ loading: true });
        const { account, fioWallet, errors } = await createAccount(
          emailToUsername(email),
          password,
          pin,
        );
        this.setState({ loading: false });

        if (!Object.values(errors).length && account && fioWallet) {
          await this.confirm(account, fioWallet, values);
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
        this.form?.change('pin', '');
        this.setState({ step: STEPS.EMAIL_PASSWORD });
        break;
      }
      case STEPS.PIN_CONFIRM:
      case STEPS.CONFIRMATION: {
        this.form?.change('pin', '');
        this.form?.change('confirmPin', '');
        this.setState({ step: STEPS.PIN });
        break;
      }
      default:
        this.setState({ step: STEPS.EMAIL_PASSWORD });
    }
  };

  renderForm = (formProps: FormRenderProps<FormValues>) => {
    const {
      handleSubmit,
      submitting,
      modifiedSinceLastSubmit,
      hasSubmitErrors,
      hasValidationErrors,
      pristine,
      values,
      errors,
      submitErrors,
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

    if (hasSubmitErrors && submitErrors && step === STEPS.SUCCESS) {
      return (
        <GenericErrorModal
          showGenericError={true}
          closeGenericErrorModal={() => {
            window.location.reload();
          }}
        />
      );
    }

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
                <Link to="#" onClick={this.openLogin}>
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
              isConfirm={true}
              error={errors?.confirmPin}
              startOver={this.onPrevStep}
            />
          </Wizard.Page>
          <Wizard.Page hideBack hideNext>
            <Confirmation data={values} errors={errors} />
          </Wizard.Page>
          <Wizard.Page hideBack hideNext>
            <Success onFinish={this.onFinish} signupSuccess={signupSuccess} />
          </Wizard.Page>
        </Wizard>
      </form>
    );
  };

  render(): React.ReactElement {
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
