import React from 'react';

import { nftId } from '../../../util/nft';

import { NftValidationFormValues, ValidationOption } from './types';
import { NFTTokenDoublet } from '../../../types';

import classes from '../styles/NftListResults.module.scss';

type Props = {
  activeOption?: ValidationOption;
  searchParams?: NftValidationFormValues;
  results: NFTTokenDoublet[];
};

const NftListResults: React.FC<Props> = props => {
  const { activeOption, searchParams, results } = props;
  if (
    activeOption != null &&
    searchParams != null &&
    results != null &&
    results.length > 0
  )
    return (
      <div className={classes.container}>
        <h3 className={classes.title}>NFT Signature Information</h3>
        <div className={classes.resultsContainer}>
          <h3 className={classes.resultsTitle}>Results</h3>
          {activeOption.resultsTitle(searchParams)}
          {results.map(item => (
            <div
              key={nftId(item.chainCode, item.tokenId, item.contractAddress)}
            >
              {activeOption.resultsItem(item, searchParams)}
            </div>
          ))}
        </div>
      </div>
    );
  return null;
};

export default NftListResults;
