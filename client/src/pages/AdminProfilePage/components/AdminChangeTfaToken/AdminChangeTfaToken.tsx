import React from 'react';

import { Field, Form } from 'react-final-form';
import { OnChange, OnFocus } from 'react-final-form-listeners';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
import CopyTooltip from '../../../../components/CopyTooltip';
import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';

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
    onCopy,
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

              const hasValues = values.tfaToken;

              return (
                <>
                  <form onSubmit={handleSubmit} className={classes.form}>
                    <h3 className={classes.title}>Change 2 FA</h3>
                    {tfaSecretInstance ? (
                      <>
                        <Label
                          label="2FA Secret"
                          uiType={INPUT_UI_STYLES.BLACK_WHITE}
                        />
                        <Badge
                          show
                          type={BADGE_TYPES.WHITE}
                          className={classes.badgeContainer}
                        >
                          <p className={classes.tfaSecret}>
                            {tfaSecretInstance.base32}
                          </p>
                          <CopyTooltip>
                            <div
                              className={classes.iconContainer}
                              onClick={onCopy}
                            >
                              <ContentCopyIcon className={classes.icon} />
                            </div>
                          </CopyTooltip>
                        </Badge>
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
                  <OnFocus name="tfaToken">{() => resetError()}</OnFocus>
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
