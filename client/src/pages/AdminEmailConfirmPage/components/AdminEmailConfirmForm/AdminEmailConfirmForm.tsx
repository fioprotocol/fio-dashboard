import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import QRCode from 'qrcode.react';

import Input from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { formValidation } from './validation';
import { FormProps } from '../../types';

import classes from '../../AdminEmailConfirmPage.module.scss';

const AdminEmailConfirmForm: React.FC<FormProps> = props => {
  const {
    onSubmit,
    loading,
    initialValues,
    downloadRecovery2FaSecret,
    tfaSecretInstance,
  } = props;

  return (
    <Form
      onSubmit={onSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const { handleSubmit, valid } = formRenderProps;

        return (
          <div className={classes.container}>
            <div className={classes.formContainer}>
              <h2 className={classes.title}>Create Admin Account</h2>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Field
                  component={Input}
                  disabled
                  type="text"
                  name="email"
                  placeholder="Enter Your Email"
                  label="Email"
                />
                <Field
                  component={Input}
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  label="Password"
                />
                <Field
                  component={Input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Your Password"
                  label="Password"
                />

                {tfaSecretInstance ? (
                  <>
                    <div>
                      <div>
                        Two-Factor authentication increases the security of your
                        Ledgy account.
                      </div>
                      <div>
                        All you need is compatible app on your smartphone, for
                        example:
                      </div>
                      <div>
                        <b>1.</b> Download <b>Google Authenticator</b>{' '}
                        application for{' '}
                        <a
                          href="https://apps.apple.com/us/app/google-authenticator/id388497605?l=uk"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          IOS
                        </a>{' '}
                        or{' '}
                        <a
                          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Android
                        </a>
                        .
                      </div>

                      <QRCode value={tfaSecretInstance.otpauth_url} />
                      <div>
                        Scan image with your app. You will see 6-digit code on
                        your screen enter the code below to verify your phone
                        and complete the setup. (If you refresh the page you
                        will need to delete scanned secret key in your app and
                        scan image again, because we generating unique secret
                        key on every visitation of this page.)
                      </div>

                      <div>
                        <b
                          className={classes.downloadSecret2FA}
                          onClick={downloadRecovery2FaSecret}
                        >
                          <b>Download recovery Key</b>
                        </b>
                      </div>
                    </div>
                    <br />

                    <Field
                      component={Input}
                      type="number"
                      name="tfaToken"
                      placeholder="Enter 2FA token"
                    />
                  </>
                ) : null}

                <SubmitButton
                  disabled={!valid}
                  text="Create account"
                  loading={loading}
                />
              </form>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

export default AdminEmailConfirmForm;
