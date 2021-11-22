import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { validate } from './validation';

import { ImportWalletFormProps } from '../../types';

import classes from '../../ImportWalletPage.module.scss';

const ImportWalletForm: React.FC<ImportWalletFormProps> = props => {
  const { loading, onSubmit } = props;
  return (
    <Form onSubmit={onSubmit} validate={validate}>
      {(props: FormRenderProps) => (
        <form onSubmit={props.handleSubmit} className={classes.form}>
          <Field
            name="privateSeed"
            type="text"
            placeholder="Enter or Paste Private Key or Mnemonic Seed"
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            component={Input}
            disabled={loading}
            showCopyButton={true}
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

          <Button
            type="submit"
            disabled={!props.valid || props.submitting || loading}
            className={classes.button}
          >
            Import Wallet{' '}
            {loading && (
              <FontAwesomeIcon icon="spinner" spin className={classes.loader} />
            )}
          </Button>
        </form>
      )}
    </Form>
  );
};

export default ImportWalletForm;
