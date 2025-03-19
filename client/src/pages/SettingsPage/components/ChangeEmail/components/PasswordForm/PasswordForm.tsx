import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import TextInput from '../../../../../../components/Input/TextInput';
import SubmitButton from '../../../../../../components/common/SubmitButton/SubmitButton';

import { INPUT_UI_STYLES } from '../../../../../../components/Input/Input';
import {
  COLOR_TYPE,
  // ERROR_UI_TYPE,
  ErrorBadge,
} from '../../../../../../components/Input/ErrorBadge';

import { ERROR_MESSAGES_BY_CODE } from '../../../../../../constants/errors';

import classes from './PasswordForm.module.scss';

type Props = {
  loading: boolean;
  error?: Error & { code?: string };
  onChange: () => void;
  onSubmit: (values: { password: string }) => Promise<void>;
};

export const PasswordForm: React.FC<Props> = props => {
  const { error, loading, onChange, onSubmit } = props;

  const errorMessage = error
    ? ERROR_MESSAGES_BY_CODE[
        error?.code as keyof typeof ERROR_MESSAGES_BY_CODE
      ] || ERROR_MESSAGES_BY_CODE.SERVER_ERROR
    : null;

  return (
    <Form onSubmit={onSubmit}>
      {(formRenderProps: FormRenderProps) => {
        return (
          <form onSubmit={formRenderProps.handleSubmit}>
            <div className={classes.field}>
              <Field
                name="password"
                type="password"
                placeholder="Enter Your Password"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={TextInput}
                disabled={loading}
                showErrorBorder={!!error && formRenderProps.values?.password}
                hideError
                additionalOnchangeAction={onChange}
              />
            </div>
            {!!error && formRenderProps.values?.password && (
              <div className={classes.error}>
                <ErrorBadge
                  hasError={!!error}
                  error={errorMessage}
                  title="An error occurred"
                />
              </div>
            )}

            <SubmitButton
              disabled={
                formRenderProps.hasValidationErrors ||
                formRenderProps.submitting ||
                !formRenderProps.values?.password ||
                loading ||
                !!error
              }
              text="Confirm"
              loading={loading}
              withBottomMargin
            />
          </form>
        );
      }}
    </Form>
  );
};
