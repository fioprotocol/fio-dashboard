import React, { useEffect } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import ActionContainer from '../../../components/LinkTokenList/ActionContainer';

import { ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION } from '../../../constants/fio';
import { CONTAINER_NAMES } from '../../../components/LinkTokenList/constants';

import AddTokenInput from './AddTokenInput';

import { FormValues, AddTokenFormProps } from '../types';

import classes from '../styles/AddToken.module.scss';

const AddTokenForm: React.FC<AddTokenFormProps> = props => {
  const {
    formProps: {
      handleSubmit,
      form: {
        mutators: { push },
      },
      touched,
      values,
      valid,
    },
    changeBundleCost,
  } = props;

  const tokens: FormValues['tokens'] =
    values != null && values.tokens != null ? values.tokens : [];

  const addTokenRow = () => push('tokens');

  useEffect(
    () =>
      changeBundleCost(
        Math.ceil(tokens.length / ELEMENTS_LIMIT_PER_BUNDLE_TRANSACTION),
      ),
    [JSON.stringify(tokens)],
  );
  useEffect(() => addTokenRow(), []);

  return (
    <form onSubmit={handleSubmit}>
      <ActionContainer
        onActionButtonClick={handleSubmit}
        isDisabled={!valid}
        containerName={CONTAINER_NAMES.ADD}
        {...props}
      >
        <div className={classes.actionContainer}>
          <h5 className={classes.subtitle}>
            FIO Crypto Handle Linking Information
          </h5>
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
        <FieldArray
          name="tokens"
          render={renderProps => (
            <AddTokenInput {...renderProps} touched={touched} />
          )} // workaround with passing custom props
        />
      </ActionContainer>
    </form>
  );
};

export default AddTokenForm;
