import React, { useEffect } from 'react';
import { Form, FormProps, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './NftValidationForm.module.scss';

type Props = {
  activeOption: { id?: string; name?: string; field?: React.ReactNode };
  loading: boolean;
};

const RenderForm: React.FC<Props & FormRenderProps> = props => {
  const { handleSubmit, form, activeOption, loading } = props;
  const { name, field } = activeOption || {};
  useEffect(() => {
    name && form.reset();
  }, [name]);

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {field}
      <Button type="submit" className={classes.submitButton} disabled={loading}>
        Validate NFT Signature{' '}
        {loading && (
          <FontAwesomeIcon spin icon="spinner" className={classes.loader} />
        )}
      </Button>
    </form>
  );
};

const NftValidationForm: React.FC<Props & FormProps> = props => {
  const { onSubmit } = props;

  return (
    <Form
      onSubmit={onSubmit}
      render={formProps => <RenderForm {...props} {...formProps} />}
    ></Form>
  );
};

export default NftValidationForm;
