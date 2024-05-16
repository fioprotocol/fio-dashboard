import React from 'react';

import Results from '../index';

import { ResultsProps } from '../types';

import { ResultDetails } from '../../../ResultDetails/ResultDetails';

import classes from '../styles/Results.module.scss';

const SetVisibilityResults: React.FC<ResultsProps> = props => {
  const {
    results: { name, changedStatus },
  } = props;

  return (
    <Results {...props}>
      <h5 className={classes.label}>Status Change Information</h5>
      <div className={classes.badges}>
        <div className={classes.halfWidth}>
          <ResultDetails label="Domain" value={name} />
        </div>
        <div className={classes.halfWidth}>
          <ResultDetails label="New Status" value={changedStatus || ''} />
        </div>
      </div>
    </Results>
  );
};

export default SetVisibilityResults;
