import React from 'react';
import isEmpty from 'lodash/isEmpty';

import { nftId } from '../../util/nft';
import classes from './NftListResults.module.scss';

import { NftValidationFormValues } from './types';
import { NFTTokenDoublet } from '../../types';

type Props = {
  activeOption?: {
    id: string;
    name: string;
    field: React.ReactNode;
    resultsTitle: (searchParams: NftValidationFormValues) => React.ReactNode;
    resultsItem: (item: NFTTokenDoublet) => React.ReactNode;
  };
  searchParams: NftValidationFormValues;
  nftSignatures: NFTTokenDoublet[];
};

const NftListResults: React.FC<Props> = props => {
  const { activeOption, searchParams, nftSignatures } = props;
  if (!isEmpty(activeOption) && nftSignatures.length > 0)
    return (
      <div className={classes.container}>
        <h3 className={classes.title}>NFT Signature Information</h3>
        <div className={classes.resultsContainer}>
          <h3 className={classes.resultsTitle}>Results</h3>
          {activeOption && activeOption.resultsTitle(searchParams)}
          {nftSignatures.map(item => (
            <div
              key={nftId(item.chainCode, item.tokenId, item.contractAddress)}
            >
              {activeOption && activeOption.resultsItem(item)}
            </div>
          ))}
        </div>
      </div>
    );
  return null;
};

export default NftListResults;
