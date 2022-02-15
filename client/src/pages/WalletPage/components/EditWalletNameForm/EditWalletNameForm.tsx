import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { EditWalletNameProps } from '../../types';

import classes from '../../../WalletsPage/styles/CreateWalletForm.module.scss';

const EditWalletNameForm: React.FC<EditWalletNameProps> = props => {
  const { loading, onSubmit, initialValues } = props;
  return (
    <Form
      onSubmit={onSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => (
        <form onSubmit={formRenderProps.handleSubmit} className={classes.form}>
          <Field
            name="name"
            type="text"
            placeholder="Enter Wallet Name"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
          />

          <SubmitButton
            text="Update"
            disabled={
              !formRenderProps.valid || formRenderProps.submitting || loading
            }
            loading={loading}
            withBottomMargin={true}
          />
        </form>
      )}
    </Form>
  );
};

export default EditWalletNameForm;
