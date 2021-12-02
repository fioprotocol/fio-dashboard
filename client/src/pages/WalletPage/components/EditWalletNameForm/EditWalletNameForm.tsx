import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { validate } from './validation';

import { EditWalletNameProps } from '../../types';

import classes from '../../../WalletsPage/styles/CreateWalletForm.module.scss';

const EditWalletNameForm: React.FC<EditWalletNameProps> = props => {
  const { loading, onSubmit, initialValues } = props;
  return (
    <Form onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
      {(props: FormRenderProps) => (
        <form onSubmit={props.handleSubmit} className={classes.form}>
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
            disabled={!props.valid || props.submitting || loading}
            loading={loading}
            withBottomMargin={true}
          />
        </form>
      )}
    </Form>
  );
};

export default EditWalletNameForm;
