import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { DeleteWalletFormValues } from '../../types';

import classes from '../../../WalletsPage/styles/CreateWalletForm.module.scss';

const DeleteWalletForm: React.FC<{
  isPrimaryUserProfileType: boolean;
  loading: boolean;
  username: string;
  onSubmit: (values: DeleteWalletFormValues) => Promise<void>;
}> = props => {
  const { isPrimaryUserProfileType, loading, username, onSubmit } = props;
  return (
    <Form
      onSubmit={onSubmit}
      validate={isPrimaryUserProfileType ? formValidation.validateForm : null}
      initialValues={{ username }}
    >
      {(formRenderProps: FormRenderProps) => (
        <form onSubmit={formRenderProps.handleSubmit} className={classes.form}>
          {isPrimaryUserProfileType && (
            <>
              <div className={classes.field}>
                <Field name="username" type="hidden" component={Input} />
              </div>

              <div className={classes.field}>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter Your Password"
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WHITE}
                  component={Input}
                  disabled={loading}
                />
              </div>
            </>
          )}

          <SubmitButton
            className={classes.submitButton}
            disabled={
              isPrimaryUserProfileType &&
              (formRenderProps.hasValidationErrors ||
                formRenderProps.submitting ||
                loading)
            }
            loading={loading}
            hasSmallPaddings
            hasSmallText
            hasLowHeight
            hasAutoWidth
            withoutMargin
            isBlack
            text="Delete Wallet"
          />
        </form>
      )}
    </Form>
  );
};

export default DeleteWalletForm;
