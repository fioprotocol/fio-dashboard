import React from 'react';

import Results from '../index';
import FioName from '../../FioName/FioName';

import { ResultsProps } from '../types';

import { ResultDetails } from '../../../ResultDetails/ResultDetails';

import classes from '../styles/Results.module.scss';

const SignResults: React.FC<ResultsProps> = props => {
  const {
    results: {
      name,
      other: { chainCode, contractAddress, tokenId, url, hash, creatorUrl },
    },
  } = props;
  const dashSign = ' - ';

  return (
    <Results {...props}>
      <FioName name={name || ''} />
      <h5 className={classes.label}>Signed NFT Details</h5>
      <div className={classes.badges}>
        <div className={classes.halfWidth}>
          <ResultDetails label="Chain Code" value={chainCode} />
        </div>
        <div className={classes.halfWidth}>
          <ResultDetails label="Token ID" value={tokenId || dashSign} />
        </div>
      </div>

      <ResultDetails label="Contract Address" value={contractAddress} />
      <ResultDetails label="URL" value={url || dashSign} />
      <ResultDetails label="Hash" value={hash || dashSign} />
      <ResultDetails label="Creator URL" value={creatorUrl || dashSign} />
    </Results>
  );
};

export default SignResults;
