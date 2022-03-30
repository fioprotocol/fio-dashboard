import React from 'react';

import { BADGE_TYPES } from '../../../components/Badge/Badge';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';

import { genericTokenId } from '../../../util/fio';

import { NftValidationFormValues, ValidationOption } from './types';
import { NFTTokenDoublet } from '../../../types';

import classes from '../styles/NftListResults.module.scss';

type Props = {
  activeOption?: ValidationOption | null;
  searchParams?: NftValidationFormValues | null;
  results: NFTTokenDoublet[] | null;
  showWarningBadge?: boolean;
};

const NftListResults: React.FC<Props> = props => {
  const {
    activeOption,
    searchParams,
    results,
    showWarningBadge = false,
  } = props;
  if (
    activeOption != null &&
    searchParams != null &&
    results != null &&
    results.length > 0
  ) {
    const renderResultItem = (resultItem: NFTTokenDoublet) => (
      <div
        key={genericTokenId(
          resultItem.chainCode,
          resultItem.tokenId,
          resultItem.contractAddress,
        )}
      >
        {activeOption.resultsItem(resultItem, searchParams)}
      </div>
    );

    const renderGroupedResult = () => {
      const groupedByChainCode = results.reduce(
        (acc: { [key: string]: NFTTokenDoublet[] }, obj) => {
          const key = obj.chainCode;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        },
        {},
      );

      return Object.keys(groupedByChainCode).map(chainCode => (
        <div key={chainCode}>
          <div className={classes.groupedItem}>{chainCode}</div>
          {groupedByChainCode[chainCode].map(resultItem =>
            renderResultItem(resultItem),
          )}
        </div>
      ));
    };

    const renderResult = () =>
      results.map(resultItem => renderResultItem(resultItem));

    return (
      <div className={classes.container}>
        <h3 className={classes.title}>NFT Signature Information</h3>
        <div className={classes.resultsContainer}>
          <h3 className={classes.resultsTitle}>Results</h3>
          {activeOption.resultsTitle(searchParams)}
          <InfoBadge
            show={showWarningBadge}
            type={BADGE_TYPES.WARNING}
            title="Multiple Signatures"
            message="There are multiple signatures that match contract address and token ID, please review carefully when validating an NFT signature."
          />
          {activeOption.showGroupResults
            ? renderGroupedResult()
            : renderResult()}
        </div>
      </div>
    );
  }

  return null;
};

export default NftListResults;
