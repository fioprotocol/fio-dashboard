import React from 'react';
import { Button } from 'react-bootstrap';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { FormValuesProps } from './types';

import classes from '../../styles/ChangeEmail.module.scss';
import validation from './validation';

type Props = {
  onSubmit: (values: FormValuesProps) => void;
  loading: boolean;
  error?: boolean;
  initValue: string | null;
};

const ChangeEmailForm: React.FC<Props> = props => {
  const { onSubmit, loading, error, initValue } = props;

  const renderForm = (props: FormRenderProps<FormValuesProps>) => {
    const { handleSubmit, validating, valid, submitting } = props;
    return (
      <>
        <form onSubmit={handleSubmit}>
          <Field
            type="text"
            name="email"
            component={Input}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
            errorColor={COLOR_TYPE.WARN}
            placeholder="Enter New Email Address"
            loading={validating}
            disabled={submitting || loading}
          />
          <Button
            type="submit"
            disabled={loading || !valid || validating}
            className={classes.submitButton}
          >
            {loading ? (
              <>
                <span>Updating </span>
                <FontAwesomeIcon icon="spinner" spin className={classes.icon} />
              </>
            ) : error ? (
              'Try Again'
            ) : (
              'Update'
            )}
          </Button>
        </form>
      </>
    );
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={renderForm}
      validate={validation}
      keepDirtyOnReinitialize={true}
      initialValues={{ email: initValue }}
    />
  );
};

export default ChangeEmailForm;
