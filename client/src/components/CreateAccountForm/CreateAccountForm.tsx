import React from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';

import { EdgeAccount, EdgeCurrencyWallet } from 'edge-core-js';

import Wizard from './CreateAccountFormWizard';
import FormModalWrapper from '../FormModalWrapper/FormModalWrapper';
import GenericErrorModal from '../Modal/GenericErrorModal/GenericErrorModal';
import Success from './Success';
import PageTitle from '../PageTitle/PageTitle';

import {
  DEFAULT_WALLET_OPTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { LINKS } from '../../constants/labels';
import { ROUTES } from '../../constants/routes';

import EmailPassword, {
  validate as validateEmailPassword,
} from './EmailPassword';
import {
  usernameAvailable,
  createAccount,
  checkUsernameAndPassword,
} from './middleware';
import { emailToUsername, getWalletKeys, setDataMutator } from '../../utils';
import { log } from '../../util/general';

import {
  FioWalletDoublet,
  RedirectLinkData,
  RefProfile,
  WalletKeysObj,
} from '../../types';
import { FormValues, PasswordValidationState } from './types';

import classes from './CreateAccountForm.module.scss';
import { DEFAULT_DEBOUNCE_TIMEOUT } from '../../constants/timeout';

const NO_EDGE_ACCOUNT_ERROR = 'No Edge Account';

const STEPS = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  SUCCESS: 'SUCCESS',
};

const STEPS_ORDER = {
  [STEPS.EMAIL_PASSWORD]: 0,
  [STEPS.SUCCESS]: 1,
};

const STEPS_LINK = {
  [STEPS.EMAIL_PASSWORD]: LINKS.CREATE_ACCOUNT,
  [STEPS.SUCCESS]: LINKS.CREATE_ACCOUNT_CONFIRMATION,
};

const EMAIL_FIELD_NAME = 'email';
const CONFIRM_EMAIL_FIED_NAME = 'confirmEmail';

type State = {
  passwordValidation: PasswordValidationState;
  usernameAvailableLoading: boolean;
  usernameIsAvailable: boolean;
  step: string;
  keys: WalletKeysObj;
  loading: boolean;
  emailWasBlurred: boolean;
};

type Props = {
  resetSuccessState: () => void;
  makeNonce: (data: {
    email: string;
    username: string;
    keys: WalletKeysObj;
    isPinLogin: boolean;
    isSignUp: boolean;
  }) => void;
  showLoginModal: () => void;
  setPinEnabled: (username: string) => void;
  setPinSetupPostponed: (isPinPostponed: boolean) => void;
  setRedirectPath: ({ pathname }: { pathname: string }) => void;
  toggleTwoFactorAuth: (hasTwoFactor: boolean) => void;
  onSubmit: (params: {
    username: string;
    email: string;
    fioWallets: FioWalletDoublet[];
    refCode?: string;
    redirectLink?: string;
    addEmailToPromoList: boolean;
  }) => void;
  resetError: () => void;
  signupSuccess: boolean;
  refProfileInfo: RefProfile | null;
  edgeAuthLoading: boolean;
  serverSignUpLoading: boolean;
  redirectLink: RedirectLinkData;
  error?: Error;
};

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
      emailWasBlurred: false,
    };

    this.form = null;
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (!prevProps.signupSuccess && this.props.signupSuccess) {
      this.setState({ step: STEPS.SUCCESS });
    }

    if (this.state.step === STEPS.SUCCESS && this.props.error) {
      this.setState({ step: STEPS.EMAIL_PASSWORD });
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

    this.props.makeNonce({
      email,
      username: emailToUsername(email),
      keys: this.state.keys,
      isPinLogin: false,
      isSignUp: true,
    });
  };

  setEmailError = (emailError: string) => {
    this.form &&
      this.form.mutators &&
      this.form.mutators.setDataMutator(
        EMAIL_FIELD_NAME,
        {
          error: !!emailError && (
            <span>
              This username is not available,{' '}
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

  isUsernameExists = async (email: string) => {
    this.setState({
      usernameAvailableLoading: true,
      usernameIsAvailable: false,
    });
    const { error: usernameError } = await usernameAvailable(
      emailToUsername(email),
    );

    this.setState({
      usernameAvailableLoading: false,
      usernameIsAvailable: !usernameError,
    });

    this.setEmailError(usernameError);

    return {
      usernameIsAvailable: !usernameError,
    };
  };

  validate = (values: FormValues) => this.validateUser(values);

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
      redirectLink,
      refProfileInfo,
      onSubmit,
      setPinSetupPostponed,
      setRedirectPath,
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
    const keys = await getWalletKeys({ account, fioWallets: [fioWallet] });

    this.setState({ keys });
    await account.logout();

    if (redirectLink) {
      setPinSetupPostponed(true);
    } else {
      setRedirectPath({ pathname: ROUTES.CREATE_ACCOUNT_PIN });
    }

    return onSubmit({
      username: emailToUsername(email),
      email,
      fioWallets,
      refCode: refProfileInfo?.code || '',
      addEmailToPromoList,
    });
  };

  handleEmailChange: () => void = async () => {
    this.setState({ emailWasBlurred: true });

    if (!this.form) return null;

    const { value, error } = this.form.getFieldState(EMAIL_FIELD_NAME);

    !error && (await this.isUsernameExists(value || ''));
  };

  debouncedEmailChange = debounce(
    this.handleEmailChange,
    DEFAULT_DEBOUNCE_TIMEOUT,
  );

  handleSubmit = async (values: FormValues) => {
    const { step } = this.state;
    const { setPinEnabled } = this.props;

    switch (step) {
      case STEPS.EMAIL_PASSWORD: {
        this.props.resetError();

        const { email, password, confirmPassword } = values;
        this.setState({ loading: true });

        const { errors } = await checkUsernameAndPassword({
          email,
          username: emailToUsername(email),
          password: password,
          passwordRepeat: confirmPassword,
        });

        if (!Object.values(errors).length) {
          this.setState({ step: STEPS.SUCCESS });

          const { account, fioWallet, errors } = await createAccount(
            emailToUsername(email),
            password,
          );

          if (!account) {
            const errors = { email: NO_EDGE_ACCOUNT_ERROR };
            return errors;
          }

          if (!Object.values(errors).length && account && fioWallet) {
            setPinEnabled(account?.username || emailToUsername(email));
            this.props.toggleTwoFactorAuth(!!account.otpKey);
            await this.confirm(account, fioWallet, values);
          }
        }

        this.setState({ loading: false });

        return errors;
      }
      default:
        return {};
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
      log.error('Create Account Errors', submitErrors as Error);
      return (
        <GenericErrorModal
          genericErrorData={{
            message: 'Registration failed. Try signing in with MetaMask.',
          }}
          showGenericError={true}
          closeGenericErrorModal={() => {
            window.location.reload();
          }}
        />
      );
    }

    const showInfoBadge =
      values.email &&
      values.confirmEmail &&
      values.password &&
      values.confirmPassword &&
      isEmpty(errors);

    const { data: emailFieldData } = form.getFieldState(EMAIL_FIELD_NAME) || {};
    const {
      active: confirmEmailFieldActive,
      touched: confirmEmailFieldTouched,
    } = form.getFieldState(CONFIRM_EMAIL_FIED_NAME) || {};
    const emailFieldError = emailFieldData?.error;

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
              onEmailChange={this.debouncedEmailChange}
              passwordValidation={passwordValidation}
              loading={loading}
              usernameAvailableLoading={usernameAvailableLoading}
              isEmailChecked={values.email && !errors.email && !emailFieldError}
              isConfirmEmailChecked={
                values.confirmEmail && !errors.confirmEmail
              }
              isConfirmEmailError={
                values.confirmEmail &&
                errors.confirmEmail &&
                !confirmEmailFieldActive &&
                confirmEmailFieldTouched
              }
              hasSubmitError={hasSubmitErrors && submitErrors.email}
              submitting={submitting}
              showInfoBadge={showInfoBadge}
            />
          </Wizard.Page>
          <Wizard.Page hideBack hideNext>
            <Success onFinish={this.onFinish} signupSuccess={signupSuccess} />
          </Wizard.Page>
        </Wizard>
      </form>
    );
  };

  render(): React.ReactElement {
    const { step } = this.state;
    return (
      <FormModalWrapper>
        {step !== STEPS.EMAIL_PASSWORD && (
          <PageTitle link={STEPS_LINK[step]} isVirtualPage />
        )}
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
