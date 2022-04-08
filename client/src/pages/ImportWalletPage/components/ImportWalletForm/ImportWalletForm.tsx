import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { ImportWalletFormProps } from '../../types';

import classes from '../../ImportWalletPage.module.scss';

const ImportWalletForm: React.FC<ImportWalletFormProps> = props => {
  const { loading, onSubmit } = props;
  return (
    <Form onSubmit={onSubmit} validate={formValidation.validateForm}>
      {(formRenewProps: FormRenderProps) => (
        <form onSubmit={formRenewProps.handleSubmit} className={classes.form}>
          <Field
            name="privateSeed"
            type="text"
            placeholder="Enter or Paste Private Key or Mnemonic Seed"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
            showPasteButton={true}
          />
          <Field
            name="name"
            type="text"
            placeholder="Enter Wallet Name"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
            label="FIO Wallet Name"
          />

          <SubmitButton
            text="Import Wallet"
            disabled={
              formRenewProps.hasValidationErrors ||
              formRenewProps.submitting ||
              loading
            }
            loading={loading}
            withBottomMargin={true}
          />
        </form>
      )}
    </Form>
  );
};

export default ImportWalletForm;
