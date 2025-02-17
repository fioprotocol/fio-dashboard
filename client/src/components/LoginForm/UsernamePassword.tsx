import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { FormApi } from 'final-form';
import isEmpty from 'lodash/isEmpty';
import { OnChange } from 'react-final-form-listeners';
import classnames from 'classnames';
import BlockIcon from '@mui/icons-material/Block';

import Link from '../Link/Link';
import Loader from '../Loader/Loader';
import Input from '../Input/Input';
import FormHeader from '../FormHeader/FormHeader';
import PageTitle from '../PageTitle/PageTitle';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import { MetamaskLogin } from './components/MetamaskLogin';

import { useMetaMaskProvider } from '../../hooks/useMetaMaskProvider';

import { ROUTES } from '../../constants/routes';
import { LINKS } from '../../constants/labels';

import { usernamePasswordValidation } from './components/validation';
import { isEdgeAuthenticationError, isEdgeNetworkError } from '../../util/edge';
import { isOpera } from '../../util/ethereum';
import { setDataMutator } from '../../utils';

import { LoginFailure } from '../../types';

import classes from './LoginForm.module.scss';

type FormValues = {
  email: string;
  password: string;
};

type Props = {
  isForgotPass: boolean;
  onSubmit: (params: { email: string; password: string }) => void;
  edgeAuthLoading: boolean;
  onClose: () => void;
  toggleForgotPass: (open: boolean) => void;
  loginFailure: LoginFailure;
  edgeLoginFailure: {
    name?: string;
    type?: string;
    challengeId?: string;
    challengeUri?: string;
  };
  title: string;
  initialValues: { email?: string; password?: string };
  resetLoginFailure: () => void;
  setAlternativeLoginErrorToParentsComponent: (error: string | null) => void;
};

const UsernamePassword: React.FC<Props> = props => {
  const {
    isForgotPass,
    onSubmit,
    edgeAuthLoading,
    onClose,
    loginFailure,
    edgeLoginFailure,
    toggleForgotPass,
    title,
    initialValues,
    resetLoginFailure,
    setAlternativeLoginErrorToParentsComponent,
  } = props;

  let currentForm: FormApi | null = null;

  const [showiframeLoader, toggleShowiframeLoader] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const metaMaskProvider = useMetaMaskProvider();
  const isMetaMask = !!metaMaskProvider;

  const { challengeId, challengeUri } = edgeLoginFailure || {};

  const resetFormErrors = useCallback(() => {
    if (!currentForm) return;
    const { mutators } = currentForm;

    mutators.setDataMutator('password', {
      error: null,
    });
    mutators.setDataMutator('email', {
      error: null,
      hideError: false,
    });
  }, [currentForm]);

  const onBackClick = useCallback(() => {
    resetFormErrors();
    resetLoginFailure();
    toggleShowiframeLoader(true);
  }, [resetFormErrors, resetLoginFailure]);

  const onIframeLoad = useCallback(() => {
    toggleShowiframeLoader(false);
  }, []);

  useEffect(() => {
    if (currentForm && !isEmpty(edgeLoginFailure)) {
      const { mutators } = currentForm;

      mutators.setDataMutator('password', {
        error: isEdgeAuthenticationError(edgeLoginFailure)
          ? 'Invalid email or password. Try again or click Forgot Password?'
          : isEdgeNetworkError(edgeLoginFailure)
          ? 'Unable to connect to authentication server, please try again later'
          : 'Server Error', // todo: set proper message text
      });
      mutators.setDataMutator('email', {
        error: true,
        hideError: true,
      });
    }
  }, [currentForm, edgeLoginFailure]);

  useEffect(() => {
    if (currentForm && !isEmpty(loginFailure)) {
      const { mutators } = currentForm;

      if (loginFailure.fields != null) {
        for (const field of Object.keys(loginFailure.fields)) {
          mutators.setDataMutator(field, {
            error: true,
            hideError: true,
          });
        }
      }
      mutators.setDataMutator('password', {
        error:
          loginFailure.code === 'AUTHENTICATION_FAILED'
            ? 'Authentication failed'
            : 'Server error',
      });
    }
  }, [currentForm, loginFailure]);

  useEffect(() => {
    if (!isEmpty(initialValues)) {
      resetFormErrors();
    }
  }, [initialValues, resetFormErrors]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { data } = event || {};

      const { captchaResult } = data || {};

      if (data && captchaResult) {
        if (captchaResult.toLowerCase() === 'success') {
          currentForm.submit();
          resetFormErrors();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [
    challengeId,
    challengeUri,
    currentForm,
    resetFormErrors,
    resetLoginFailure,
  ]);

  const handleSubmit = (values: FormValues) => {
    const { email, password } = values;
    onSubmit({
      email,
      password,
    });
  };

  const handleChange = () => {
    if (!isEmpty(loginFailure) || !isEmpty(edgeLoginFailure)) {
      resetFormErrors();
    }
  };

  const onForgotPassHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleForgotPass(true);
  };

  const onForgotPassClose = () => {
    toggleForgotPass(false);
  };

  const renderCreateAccount = () => {
    return (
      <p className={classes.createAccountContainer}>
        Don’t have an account?{' '}
        <Link
          classname={classes.createAccountLink}
          to={ROUTES.CREATE_ACCOUNT}
          onClick={onClose}
          isDisabled={edgeAuthLoading}
        >
          Create Account
        </Link>
      </p>
    );
  };

  const renderForgotPass = () => (
    <div className={classes.forgotPass}>
      {isForgotPass && <PageTitle link={LINKS.RESET_PASSWORD} isVirtualPage />}
      <BlockIcon className={classes.icon} />
      <FormHeader
        title="Forgot Password?"
        subtitle={
          <>
            <p className={classes.subtitle}>
              To recover your password, you must have setup password recovery
              prior.
            </p>
            <p className={classes.subtitle}>
              Please find the recovery email you sent yourself and click on the
              link from this device.
            </p>
          </>
        }
      />
      <Button className={classes.button} onClick={onForgotPassClose}>
        Ok
      </Button>
    </div>
  );

  const renderFormItems = (formRenderProps: FormRenderProps) => {
    const { handleSubmit: login, form } = formRenderProps;
    currentForm = form;

    const isAlternativeEthereumWalletSetup = isMetaMask || isOpera();

    return (
      <form onSubmit={login}>
        <FormHeader title={title} />
        {isAlternativeEthereumWalletSetup && (
          <>
            <p className={classes.text}>
              For the most seamless Web3 experience simply sign in with
              MetaMask.
            </p>
            {isMetaMask && (
              <MetamaskLogin
                setAlternativeLoginErrorToParentsComponent={
                  setAlternativeLoginErrorToParentsComponent
                }
              />
            )}
            <div className={classes.linesContainer}>
              <hr />
              <p className={classes.linesText}>OR</p>
              <hr />
            </div>
            <p className={classes.text}>
              If you've created an account using email and password, sign in
              below.
            </p>
          </>
        )}
        <div
          className={classnames(
            classes.formFields,
            challengeId && challengeUri && classes.hideForm,
          )}
        >
          <Field
            name="email"
            type="text"
            placeholder="Enter Your Email Address"
            disabled={edgeAuthLoading}
            component={Input}
          />
          <OnChange name="email">{handleChange}</OnChange>
          <Field
            name="password"
            type="password"
            placeholder="Enter Your Password"
            component={Input}
            disabled={edgeAuthLoading}
          />
          <OnChange name="password">{handleChange}</OnChange>
          <Link
            classname={classes.forgotPasswordLink}
            to=""
            onClick={onForgotPassHandler}
            isDisabled={edgeAuthLoading}
          >
            Forgot password?
          </Link>
          <SubmitButton
            onClick={login}
            disabled={edgeAuthLoading}
            text="Sign In"
            loading={edgeAuthLoading}
            withBottomMargin
            isTransparent
            isWhiteBordered
          />
          {renderCreateAccount()}
        </div>
        {challengeId && challengeUri && (
          <div className={classes.captchaContainer}>
            {showiframeLoader && <Loader className={classes.loader} />}
            <div
              className={classnames(
                classes.frame,
                !showiframeLoader && classes.show,
              )}
            >
              <iframe
                ref={iframeRef}
                id="edge-captcha"
                src={challengeUri}
                frameBorder="0"
                title="captcha"
                onLoad={onIframeLoad}
              ></iframe>
            </div>
            <SubmitButton
              onClick={onBackClick}
              withBottomMargin
              text="Back to login"
            />
          </div>
        )}
      </form>
    );
  };

  const renderForm = () => (
    <div className={classes.formBox}>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        <Form
          onSubmit={handleSubmit}
          mutators={{ setDataMutator }}
          initialValues={initialValues}
          validate={usernamePasswordValidation.validateForm}
        >
          {renderFormItems}
        </Form>
      </div>
      <div className={classnames(classes.box, isForgotPass && classes.show)}>
        {renderForgotPass()}
      </div>
    </div>
  );

  return renderForm();
};

export default UsernamePassword;
