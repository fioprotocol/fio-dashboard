import React, { useEffect, useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import ActionContainer, {
  CONTAINER_NAMES,
} from '../../../components/LinkTokenList/ActionContainer';

import AddTokenInput from './AddTokenInput';

import { FormValues, AddTokenProps } from '../types';

import classes from '../styles/AddToken.module.scss';

type FormProps = {
  formProps: FormRenderProps<FormValues>;
} & AddTokenProps;

const AddTokenForm: React.FC<FormProps> = props => {
  const {
    formProps: {
      handleSubmit,
      form: {
        mutators: { push },
      },
      values,
      valid,
    },
    currentFioAddress,
    loading,
  } = props;

  const { name, remaining = 0 } = currentFioAddress;

  const [bundleCost, changeBundleCost] = useState(0);

  const tokens: FormValues['tokens'] =
    values != null && values.tokens != null ? values.tokens : [];

  const addTokenRow = () => push('tokens');

  useEffect(() => changeBundleCost(Math.ceil(tokens.length / 5)), [
    tokens.length,
  ]);
  useEffect(() => addTokenRow(), []);

  return (
    <form onSubmit={handleSubmit}>
      <ActionContainer
        bundleCost={bundleCost}
        containerName={CONTAINER_NAMES.ADD}
        name={name}
        onActionButtonClick={handleSubmit}
        remaining={remaining}
        isDisabled={!valid}
        loading={loading}
      >
        <div className={classes.actionContainer}>
          <h5 className={classes.subtitle}>Address Linking Information</h5>
          <Button className={classes.button} onClick={addTokenRow}>
            <FontAwesomeIcon icon="plus-circle" className={classes.icon} />
            Add Token
          </Button>
        </div>
        <h5 className={classnames(classes.subtitle, classes.infoSubtitle)}>
          <span className="boldText">Hint:</span> Type an{' '}
          <span className={classes.asterisk}>*</span> to map all tokens on a
          chain
        </h5>
        <FieldArray name="tokens" component={AddTokenInput} />
      </ActionContainer>
    </form>
  );
};

export default AddTokenForm;
