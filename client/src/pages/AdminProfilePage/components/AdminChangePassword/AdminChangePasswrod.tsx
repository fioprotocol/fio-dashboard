import React from 'react';

import { Field, Form } from 'react-final-form';
import { OnChange, OnFocus } from 'react-final-form-listeners';

import SuccessModal from '../../../../components/Modal/SuccessModal';
import Modal from '../../../../components/Modal/Modal';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { Label } from '../../../../components/Input/StaticInputParts';
import {
  COLOR_TYPE,
  ERROR_UI_TYPE,
  ErrorBadge,
} from '../../../../components/Input/ErrorBadge';

import { AUTHENTICATION_FAILED } from '../../../../constants/errors';

import { useContext } from './AdminChangePasswordContext';

import classes from './AdminChangePassword.module.scss';

export const AdminChangePasswrod: React.FC = () => {
  const {
    error,
    loading,
    showChangePasswordModal,
    showSuccessModal,
    changePassword,
    closeChangePasswordModal,
    closeSuccessModal,
    openChangePasswordModal,
    resetError,
  } = useContext();
  return (
    <>
      <div className={classes.container}>
        <h5>Change Password</h5>
        <SubmitButton
          text="Change password"
          onClick={openChangePasswordModal}
          hasLowHeight
        />
      </div>
      <Modal
        show={showChangePasswordModal}
        closeButton
        onClose={closeChangePasswordModal}
        isMiddleWidth
        isSimple
        hasDefaultCloseColor
      >
        <Form onSubmit={changePassword}>
          {formProps => {
            const { handleSubmit, submitting, values } = formProps;

            const { newPassword, oldPassword } = values;

            const hasValues = newPassword && oldPassword;

            const isValidationError = error === AUTHENTICATION_FAILED;

            return (
              <>
                <form onSubmit={handleSubmit} className={classes.form}>
                  <h3 className={classes.title}>Change Password</h3>
                  <Label
                    label="New Password"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  />
                  <Field
                    type="password"
                    name="newPassword"
                    component={TextInput}
                    placeholder="Set new password"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    hasErrorForced={isValidationError}
                    hideError
                  />
                  <Label
                    label="Current Password"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  />
                  <Field
                    type="password"
                    name="oldPassword"
                    component={TextInput}
                    placeholder="Current password"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    hasErrorForced={isValidationError}
                    hideError
                  />
                  {isValidationError && (
                    <div className={classes.errorBadge}>
                      <ErrorBadge
                        error="Invalid Password"
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
                <OnFocus name="newPassword">{() => resetError()}</OnFocus>
                <OnFocus name="oldPassword">{() => resetError()}</OnFocus>
                <OnChange name="newPassword">{() => resetError()}</OnChange>
                <OnChange name="oldPassword">{() => resetError()}</OnChange>
              </>
            );
          }}
        </Form>
      </Modal>
      <SuccessModal
        showModal={showSuccessModal}
        onClose={closeSuccessModal}
        title="Password Change"
        subtitle="Password has been successfully updated."
      />
    </>
  );
};
