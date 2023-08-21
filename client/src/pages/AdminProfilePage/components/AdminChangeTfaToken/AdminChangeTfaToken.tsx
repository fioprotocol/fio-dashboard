import React from 'react';

import { Field, Form } from 'react-final-form';
import { OnChange, OnFocus } from 'react-final-form-listeners';
import QRCode from 'qrcode.react';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import SuccessModal from '../../../../components/Modal/SuccessModal';
import Modal from '../../../../components/Modal/Modal';

import { Label } from '../../../../components/Input/StaticInputParts';
import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import {
  COLOR_TYPE,
  ERROR_UI_TYPE,
  ErrorBadge,
} from '../../../../components/Input/ErrorBadge';

import {
  AUTHENTICATION_FAILED,
  TWOFA_TOKEN_IS_NOT_VALID,
} from '../../../../constants/errors';

import { useContext } from './AdminChangeTfaTokenContext';

import classes from './AdminChangeTfaToken.module.scss';

export const AdminChangeTfaToken: React.FC = () => {
  const {
    error,
    loading,
    showChange2FAModal,
    showSuccessModal,
    tfaSecretInstance,
    change2FA,
    closeChange2FAModal,
    closeSuccessModal,
    downloadRecovery2FaSecret,
    openChange2FAModal,
    resetError,
  } = useContext();

  return (
    <div className={classes.container}>
      <h5>Change 2 FA Token</h5>
      <SubmitButton
        text="Change 2 FA"
        onClick={openChange2FAModal}
        hasLowHeight
      />
      <Modal
        show={showChange2FAModal}
        closeButton
        onClose={closeChange2FAModal}
        isMiddleWidth
        isSimple
        hasDefaultCloseColor
      >
        <div>
          <Form onSubmit={change2FA}>
            {formProps => {
              const { handleSubmit, submitting, values } = formProps;

              const isValidationError =
                error === AUTHENTICATION_FAILED ||
                error === TWOFA_TOKEN_IS_NOT_VALID;

              const hasValues = values.tfaToken && values.oldTfaToken;

              return (
                <>
                  <form onSubmit={handleSubmit} className={classes.form}>
                    <h3 className={classes.title}>Change 2 FA</h3>
                    {tfaSecretInstance ? (
                      <>
                        <div className={classes.tfaContainer}>
                          <QRCode value={tfaSecretInstance.otpauth_url} />
                          <div>
                            Scan image with your app. You will see 6-digit code
                            on your screen enter the code below to verify your
                            phone and complete the setup. (If you refresh the
                            page you will need to delete scanned secret key in
                            your app and scan image again, because we generating
                            unique secret key on every visitation of this page.)
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
                        <Label
                          label="Enter new 2FA code"
                          uiType={INPUT_UI_STYLES.BLACK_WHITE}
                        />
                        <Field
                          component={TextInput}
                          type="number"
                          name="tfaToken"
                          placeholder="Enter 2FA token"
                          uiType={INPUT_UI_STYLES.BLACK_WHITE}
                          hasErrorForced={isValidationError}
                          hideError
                        />
                      </>
                    ) : null}
                    <Label
                      label="Current Enter 2FA code"
                      uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    />
                    <Field
                      type="text"
                      name="oldTfaToken"
                      component={TextInput}
                      placeholder="Current 2 FA Token"
                      uiType={INPUT_UI_STYLES.BLACK_WHITE}
                      hasErrorForced={isValidationError}
                      hideError
                    />
                    {isValidationError && (
                      <div className={classes.errorBadge}>
                        <ErrorBadge
                          error="Invalid 2 FA Token"
                          hasError={isValidationError}
                          type={ERROR_UI_TYPE.BADGE}
                          color={COLOR_TYPE.WARN}
                        />
                      </div>
                    )}
                    <SubmitButton
                      disabled={submitting || loading || !hasValues}
                      text={
                        loading ? 'Changing...' : error ? 'Try Again' : 'Change'
                      }
                      withBottomMargin
                      withTopMargin={isValidationError}
                    />
                  </form>
                  <OnFocus name="oldTfaToken">{() => resetError()}</OnFocus>
                  <OnFocus name="tfaToken">{() => resetError()}</OnFocus>
                  <OnChange name="oldTfaToken">{() => resetError()}</OnChange>
                  <OnChange name="tfaToken">{() => resetError()}</OnChange>
                </>
              );
            }}
          </Form>
        </div>
      </Modal>
      <SuccessModal
        showModal={showSuccessModal}
        onClose={closeSuccessModal}
        title="2 FA Change"
        subtitle="2 FA token has been successfully updated."
      />
    </div>
  );
};
