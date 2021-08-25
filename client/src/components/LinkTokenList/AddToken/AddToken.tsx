import React, { useState, useEffect } from 'react';
import { FieldArray, arrayPush, InjectedFormProps } from 'redux-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import ActionContainer, {
  CONTAINER_NAMES,
} from '../containers/ActionContainer';
import ConfirmContainer from '../containers/ConfirmContainer';
import AddTokenInput from './AddTokenInput';

import { FioNameItemProps, PublicAddressDoublet } from '../../../types';
import classes from './AddToken.module.scss';

// todo: set types for results and dispatch
type Props = {
  currentFioAddress: FioNameItemProps;
  results: any;
  addTokenValues: PublicAddressDoublet[];
  dispatch: any;
  onSubmit: (params: any) => void;
} & InjectedFormProps;

const AddToken: React.FC<Props> = props => {
  const { currentFioAddress, results, addTokenValues = [], dispatch } = props;
  const [resultsData, setResultsData] = useState<any | null>(null);

  const hasEmtptyFields = !addTokenValues.every(
    item => item.chainCode && item.tokenCode && item.publicAddress,
  );
  const { name, remaining = 0 } = currentFioAddress;

  const [bundleCost, changeBundleCost] = useState(0);

  const addField = () => dispatch(arrayPush('addToken', 'token', {}));

  useEffect(() => addField(), []);
  useEffect(() => changeBundleCost(Math.ceil(addTokenValues.length / 5)), [
    addTokenValues.length,
  ]);

  const handleSubmit = () => {
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
      <div className={classes.container}>
        <div className={classes.actionContainer}>
          <h5 className={classes.subtitle}>Address Linking Information</h5>
          <Button className={classes.button} onClick={addField}>
            <FontAwesomeIcon icon="plus-circle" className={classes.icon} />
            Add Token
          </Button>
        </div>
        <h5 className={classnames(classes.subtitle, classes.infoSubtitle)}>
          <span className="boldText">Hint:</span> Type an{' '}
          <span className={classes.asterisk}>*</span> to map all tokens on a
          chain
        </h5>
        <form onSubmit={handleSubmit}>
          <FieldArray name="token" component={AddTokenInput} key={0} />
        </form>
      </div>
    </ActionContainer>
  );
};

export default AddToken;
