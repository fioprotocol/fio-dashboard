import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { compose } from '../../../../utils';

import InputRedux, { INPUT_UI_STYLES } from '../../../Input/InputRedux';
import {
  ErrorBadge,
  COLOR_TYPE,
  ERROR_UI_TYPE,
} from '../../../Input/ErrorBadge';
import validate from './validation';

import classes from './ChangePassword.module.scss';

const formConnect = reduxForm({
  form: 'changePassword',
  getFormState: state => state.reduxForm,
  validate,
});

type Props = {
  loading: boolean;
  changePasswordError?: { type?: string; message?: string; name?: string };
};

const ChangePasswordForm = (props: Props & InjectedFormProps) => {
  const { handleSubmit, loading, valid, changePasswordError } = props;

  const isCurrentPasswordError =
    changePasswordError && changePasswordError.type === 'PasswordError';
  const error = isCurrentPasswordError
    ? 'Invalid Password'
    : changePasswordError.message || changePasswordError.name;

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Field
        type="password"
        name="password"
        component={InputRedux}
        showClearInput={true}
        placeholder="Enter Current Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
        showErrorBorder={isCurrentPasswordError}
        hideError={isCurrentPasswordError}
      />
      <Field
        type="password"
        name="newPassword"
        component={InputRedux}
        showClearInput={true}
        placeholder="Enter New Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
      />
      <Field
        type="password"
        name="confirmNewPassword"
        component={InputRedux}
        showClearInput={true}
        placeholder="Re-enter New Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
      />
      {error && (
        <div className={classes.errorContainer}>
          <ErrorBadge
            type={ERROR_UI_TYPE.BADGE}
            hasError={error}
            error={error}
          />
        </div>
      )}
      <Button type="submit" disabled={loading || !valid}>
        {loading ? (
          <>
            <span>Saving</span> <FontAwesomeIcon icon="spinner" spin />
          </>
        ) : error ? (
          'Try Again'
        ) : (
          'Save'
        )}
      </Button>
    </form>
  );
};

export default compose(formConnect)(ChangePasswordForm);
