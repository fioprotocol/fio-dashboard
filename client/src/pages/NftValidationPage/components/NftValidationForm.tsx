import React, { useEffect } from 'react';
import { Form, FormProps, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import apis from '../../../api';
import { NftValidationFormValues, ValidationOption } from './types';
import { OPTIONS } from '../constant';

import classes from './NftValidationForm.module.scss';

type Props = {
  activeOption: ValidationOption;
  loading: boolean;
};

const validate = (
  values: NftValidationFormValues,
  activeOption: ValidationOption,
) => {
  const errors: NftValidationFormValues = {};
  if (activeOption.id === OPTIONS.contractAddress.id) {
    if (!values.chainCode) errors.chainCode = 'Required';
    if (!values.contractAddress) errors.contractAddress = 'Required';
  }
  if (activeOption.id === OPTIONS.fioAddress.id) {
    if (!values.fioAddress) {
      errors.fioAddress = 'Required';
    } else {
      try {
        apis.fio.isFioAddressValid(values.fioAddress);
      } catch (e) {
        errors.fioAddress = 'FIO Address is not valid';
      }
    }
  }
  if (activeOption.id === OPTIONS.hash.id) {
    if (!values.hash) errors.hash = 'Required';
  }

  if (activeOption.id === OPTIONS.image.id) {
    if (!values.image) errors.image = 'Required';
  }

  return errors;
};

const RenderForm: React.FC<Props & FormRenderProps> = props => {
  const { handleSubmit, form, activeOption, loading, valid } = props;
  const { name, field } = activeOption || {};
  useEffect(() => {
    name && form.reset();
  }, [name]);

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {field}
      <Button
        type="submit"
        className={classes.submitButton}
        disabled={loading || !valid}
      >
        Validate NFT Signature{' '}
        {loading && (
          <FontAwesomeIcon spin icon="spinner" className={classes.loader} />
        )}
      </Button>
    </form>
  );
};

const NftValidationForm: React.FC<Props & FormProps> = props => {
  const { onSubmit, activeOption } = props;

  return (
    <Form
      onSubmit={onSubmit}
      validate={values => validate(values, activeOption)}
      render={formProps => <RenderForm {...props} {...formProps} />}
    ></Form>
  );
};

export default NftValidationForm;
