import React, { FormEvent, useEffect, useState } from 'react';

import { Field, FieldValue } from '../../../../components/Input/Field';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import {
  ErrorBadge,
  COLOR_TYPE,
  ERROR_UI_TYPE,
} from '../../../../components/Input/ErrorBadge';

import { INPUT_UI_STYLES } from '../../../../components/Input/InputRedux';

import validate from './validation';

import { FormValuesTypes } from './types';

import classes from '../../styles/ChangePassword.module.scss';

type Props = {
  loading: boolean;
  changePasswordError?: { type?: string; message?: string; name?: string };
  onUnmount: () => void;
  onSubmit: (values: FormValuesTypes) => void;
};

const ChangePasswordForm: React.FC<Props> = props => {
  const { onSubmit, loading, changePasswordError, onUnmount } = props;
  const [values, setValues] = useState<FormValuesTypes>({
    password: '',
    confirmNewPassword: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState<{
    password?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});
  const [valid, setValid] = useState<boolean>(false);

  useEffect(
    () => () => {
      onUnmount();
    },
    [],
  );
  useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return setValid(false);
    setValid(true);
  }, [values]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const onChange = (value: FieldValue, name?: string) => {
    if (!name) return;
    const newValues: FormValuesTypes = {
      ...values,
      [name]: `${value as string}`,
    };
    setValues(newValues);
  };

  const isCurrentPasswordError =
    changePasswordError && changePasswordError.type === 'PasswordError';
  const error = isCurrentPasswordError
    ? 'Invalid Password'
    : changePasswordError?.message || changePasswordError?.name;

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Field
        type="password"
        name="password"
        value={values.password}
        error={errors.password || null}
        onChange={onChange}
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
        value={values.newPassword}
        error={errors.newPassword || null}
        onChange={onChange}
        showClearInput={true}
        placeholder="Enter New Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
      />
      <Field
        type="password"
        name="confirmNewPassword"
        value={values.confirmNewPassword}
        error={errors.confirmNewPassword || null}
        onChange={onChange}
        showClearInput={true}
        placeholder="Re-enter New Password"
        uiType={INPUT_UI_STYLES.BLACK_WHITE}
        errorUIColor={COLOR_TYPE.WARN}
      />
      {error && (
        <div className={classes.errorContainer}>
          <ErrorBadge
            type={ERROR_UI_TYPE.BADGE}
            hasError={!!error}
            error={error}
          />
        </div>
      )}
      <SubmitButton
        text={loading ? 'Saving' : error ? 'Try Again' : 'Save'}
        disabled={loading || !valid}
        loading={loading}
        withBottomMargin={true}
      />
    </form>
  );
};

export default ChangePasswordForm;
