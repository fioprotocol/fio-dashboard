import React from 'react';
import { Form, FormProps, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './NftValidationForm.module.scss';

type Props = {
  activeOption: { id?: string; name?: string; field?: React.ReactNode };
  loading: boolean;
};

const NftValidationForm: React.FC<Props & FormProps> = props => {
  const { onSubmit, activeOption, loading } = props;

  const renderForm = ({ handleSubmit }: FormRenderProps) => {
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        {activeOption && activeOption.field}
        <Button
          type="submit"
          className={classes.submitButton}
          disabled={loading}
        >
          Validate NFT Signature{' '}
          {loading && (
            <FontAwesomeIcon spin icon="spinner" className={classes.loader} />
          )}
        </Button>
      </form>
    );
  };

  return <Form onSubmit={onSubmit}>{renderForm}</Form>;
};

export default NftValidationForm;
