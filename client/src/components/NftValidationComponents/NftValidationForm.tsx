import React from 'react';
import { Form, FormProps, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';

import classes from './NftValidationForm.module.scss';

type Props = {
  activeOption: { id?: string; name?: string; field?: React.ReactNode };
};

const NftValidationForm: React.FC<Props & FormProps> = props => {
  const { onSubmit, activeOption } = props;

  const renderForm = ({ handleSubmit }: FormRenderProps) => {
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        {activeOption && activeOption.field}
        <Button type="submit" className={classes.submitButton}>
          Validate NFT Signature
        </Button>
      </form>
    );
  };

  return <Form onSubmit={onSubmit}>{renderForm}</Form>;
};

export default NftValidationForm;
