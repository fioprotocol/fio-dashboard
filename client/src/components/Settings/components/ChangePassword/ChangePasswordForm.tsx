import React, { FormEvent, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INPUT_UI_STYLES } from '../../../Input/InputRedux';
import { Field, FieldValue } from '../../../Input/Field';
import {
  ErrorBadge,
  COLOR_TYPE,
  ERROR_UI_TYPE,
} from '../../../Input/ErrorBadge';
import validate from './validation';

import classes from './ChangePassword.module.scss';
import { FormValuesTypes } from './types';

type Props = {
  loading: boolean;
  changePasswordError?: { type?: string; message?: string; name?: string };
  onUnmount: () => void;
  onSubmit: (values: FormValuesTypes) => void;
};

const ChangePasswordForm = (props: Props) => {
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
    const errors = validate(values);
    setErrors(errors);
    if (Object.keys(errors).length) return setValid(false);
    setValid(true);
  }, [values]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const onChange = (value: FieldValue, name: string) => {
    const newValues: FormValuesTypes = { ...values, [name]: `${value}` };
    setValues(newValues);
  };

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
        value={values.password}
        error={errors.password}
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
        error={errors.newPassword}
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
        error={errors.confirmNewPassword}
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

export default ChangePasswordForm;
