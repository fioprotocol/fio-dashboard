import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';

import { validate } from './validation';
import { CreateWalletProps } from '../../types';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import classes from '../../styles/CreateWalletForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CreateWalletForm: React.FC<CreateWalletProps> = props => {
  const { loading, initialValues } = props;
  return (
    <Form
      onSubmit={props.onSubmit}
      validate={validate}
      initialValues={initialValues}
    >
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

          <Button
            type="submit"
            disabled={!props.valid || props.submitting || loading}
            className={classes.button}
          >
            Create Wallet{' '}
            {loading && (
              <FontAwesomeIcon icon="spinner" spin className={classes.loader} />
            )}
          </Button>
        </form>
      )}
    </Form>
  );
};

export default CreateWalletForm;
