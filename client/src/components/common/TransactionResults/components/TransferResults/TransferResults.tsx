import React from 'react';

import Results from '../../';

import { fioNameLabels } from '../../../../../constants/labels';

import { ResultsProps } from '../../types';

import { ResultDetails } from '../../../../ResultDetails/ResultDetails';

import classes from '../../styles/Results.module.scss';

type TransferResultsProps = {
  resetFioNames: () => void;
};

const TransferResults: React.FC<ResultsProps &
  TransferResultsProps> = props => {
  const {
    pageName,
    results: { name, publicKey },
    resetFioNames,
  } = props;
  const fioNameLabel = fioNameLabels[pageName || ''];
  const onClose = () => {
    resetFioNames();
    props.onClose();
  };

  return (
    <Results {...props} onClose={onClose}>
      <p className={classes.label}>Transfer Information</p>

      <ResultDetails label={fioNameLabel} value={name} />

      <ResultDetails label="Public Key" value={publicKey} />
    </Results>
  );
};

export default TransferResults;
