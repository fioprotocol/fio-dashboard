import React, { useState, useEffect } from 'react';
import { FieldArray, arrayPush } from 'redux-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import ActionContainer, {
  CONTAINER_NAMES,
} from '../containers/ActionContainer';
import ConfirmContainer from '../containers/ConfirmContainer';
import LinkTokenInput from '../Components/LinkTokenInput';

import classes from './LinkToken.module.scss';

const LinkToken: React.FC<any> = props => {
  const {
    currentFioAddress,
    results,
    handleSubmit,
    linkTokenValues = [],
    dispatch,
  } = props;

  const { name, remaining = 0 } = currentFioAddress;

  const [bundleCost, changeBundleCost] = useState(0);

  const addField = () => dispatch(arrayPush('linkToken', 'token', {}));

  useEffect(() => addField(), []);
  useEffect(() => changeBundleCost(Math.ceil(linkTokenValues.length / 5)), [
    linkTokenValues.length,
  ]);

  return !results ? (
    <ActionContainer
      bundleCost={bundleCost}
      containerName={CONTAINER_NAMES.LINK}
      name={name}
      onActionButtonClick={() => {}} // todo: set action
      remaining={remaining}
    >
      <div className={classes.container}>
        <div className={classes.actionContainer}>
          <h5 className={classes.subTitle}>Address Linking Information</h5>
          <Button className={classes.button} onClick={addField}>
            <FontAwesomeIcon icon="plus-circle" className={classes.icon} />
            Add Token
          </Button>
        </div>
        <h5 className={classnames(classes.subTitle, classes.infoSubtitle)}>
          <span className="boldText">Hint:</span> Type an{' '}
          <span className={classes.asterisk}>*</span> to map all tokens on a
          chain
        </h5>
        <form onSubmit={handleSubmit}>
          <FieldArray name="token" component={LinkTokenInput} />
        </form>
      </div>
    </ActionContainer>
  ) : (
    <ConfirmContainer></ConfirmContainer>
  );
};

export default LinkToken;
