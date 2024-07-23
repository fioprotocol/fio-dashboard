import React, { useCallback } from 'react';
import { Form, Field, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import isEmpty from 'lodash/isEmpty';

import CancelButton from '../../../common/CancelButton/CancelButton';
import SubmitButton from '../../../common/SubmitButton/SubmitButton';
import InfoBadge from '../../../InfoBadge/InfoBadge';

import TextInput from '../../../Input/TextInput';

import { formValidation } from './validation';

import { INVALID_PASSWORD } from '../../../../constants/regExps';
import { BADGE_TYPES } from '../../../Badge/Badge';

import classes from './PasswordForm.module.scss';

type Props = {
  error?: string | (Error & { wait?: number }) | null;
  loading: boolean;
  onClose: () => void;
  onReset: () => void;
  onSubmit: (values: FormValuesProps) => void;
};

type FormValuesProps = {
  password: string;
};

export const PasswordForm: React.FC<Props> = props => {
  const { error, loading, onClose, onSubmit, onReset } = props;

  let submitError: string | null = null;

  if (error && !isEmpty(error) && typeof error === 'object') {
    if (INVALID_PASSWORD.test(error.message)) {
      submitError = 'Invalid Password - Try Again';
    }
    submitError = error.message;
  }

  const submitErrorResetHandle = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <Form onSubmit={onSubmit} validate={formValidation.validateForm}>
      {(formProps: FormRenderProps) => {
        const { valid, values, validating } = formProps;

        return (
          <form onSubmit={formProps.handleSubmit}>
            <Field
              name="password"
              type="password"
              component={TextInput}
              placeholder="Enter Password"
              showErrorBorder={!!submitError}
            />
            <div className={classes.infoBadge}>
              <InfoBadge
                type={BADGE_TYPES.ERROR}
                title="Try Again!"
                show={!!submitError}
                message={submitError}
              />
            </div>
            <SubmitButton
              text="Next"
              withBottomMargin
              disabled={
                !valid ||
                !values.password ||
                validating ||
                !!submitError ||
                loading
              }
              loading={loading}
            />
            <CancelButton onClick={onClose} isThin withBottomMargin />
            <OnChange name="password">{submitErrorResetHandle}</OnChange>
          </form>
        );
      }}
    </Form>
  );
};
