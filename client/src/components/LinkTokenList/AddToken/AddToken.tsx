import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import ActionContainer, {
  CONTAINER_NAMES,
} from '../containers/ActionContainer';
import ConfirmContainer from '../containers/ConfirmContainer';
import AddTokenInput from './AddTokenInput';
import { validate } from './validation';

import { FioNameItemProps, PublicAddressDoublet } from '../../../types';
import classes from './AddToken.module.scss';

// todo: set types for results and dispatch
type Props = {
  currentFioAddress: FioNameItemProps;
  results: any;
  addTokenValues: PublicAddressDoublet[];
};

// todo: set proper types
const AddTokenForm = (props: any) => {
  const { changeBundleCost, push, values } = props;

  const tokens = values != null && values.tokens != null ? values.tokens : [];

  const addTokenRow = () => push('tokens');

  useEffect(() => changeBundleCost(Math.ceil(tokens.length / 5)), [
    tokens.length,
  ]);
  useEffect(() => addTokenRow(), []);

  return (
    <div className={classes.container}>
      <div className={classes.actionContainer}>
        <h5 className={classes.subtitle}>Address Linking Information</h5>
        <Button className={classes.button} onClick={addTokenRow}>
          <FontAwesomeIcon icon="plus-circle" className={classes.icon} />
          Add Token
        </Button>
      </div>
      <h5 className={classnames(classes.subtitle, classes.infoSubtitle)}>
        <span className="boldText">Hint:</span> Type an{' '}
        <span className={classes.asterisk}>*</span> to map all tokens on a chain
      </h5>
      <FieldArray name="tokens" component={AddTokenInput} />
    </div>
  );
};

const AddToken: React.FC<Props> = props => {
  const { currentFioAddress, results, addTokenValues = [] } = props;
  const [resultsData, setResultsData] = useState<any | null>(null);

  const hasEmtptyFields = !addTokenValues.every(
    item => item.chainCode && item.tokenCode && item.publicAddress,
  );
  const { name, remaining = 0 } = currentFioAddress;

  const [bundleCost, changeBundleCost] = useState(0);

  const onSubmit = () => {
    // todo: pin confirm
  };

  // Handle results
  useEffect(() => {
    // todo: set proper results
    setResultsData(results);
  }, [results]);

  if (resultsData) return <ConfirmContainer />;
  return (
    <ActionContainer
      bundleCost={bundleCost}
      containerName={CONTAINER_NAMES.LINK}
      name={name}
      onActionButtonClick={() => {}} // todo: set action
      remaining={remaining}
      isDisabled={hasEmtptyFields}
    >
      <Form
        onSubmit={onSubmit}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({
          handleSubmit,
          form: {
            mutators: { push },
          },
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <AddTokenForm
              values={values}
              push={push}
              changeBundleCost={changeBundleCost}
            />
          </form>
        )}
      </Form>
    </ActionContainer>
  );
};

export default AddToken;
