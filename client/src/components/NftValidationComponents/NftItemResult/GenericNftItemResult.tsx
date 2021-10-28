import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import NftValidationItemModal from '../NftValidationItemModal';
import { nftId } from '../../../util/nft';

import { NftValidationFormValues } from '../types';
import classes from './GenericNftItemResult.module.scss';

type Props = {
  titles: { name: string; id: string }[];
  resultItem: any; // todo: set proper types
  searchParams: NftValidationFormValues;
};

const GenericNftItemResult: React.FC<Props> = props => {
  const { titles, resultItem, searchParams } = props;
  const [showModal, toggleModal] = useState(false);

  const openModal = () => toggleModal(true);
  const closeModal = () => toggleModal(false);

  return (
    <>
      <div className={classes.container} onClick={openModal}>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <div className={classes.resultsContainer}>
              {titles.map(title => (
                <div
                  className={classes.titleContainer}
                  key={nftId(
                    resultItem.chainCode,
                    resultItem.tokenId,
                    resultItem.contractAddress,
                  )}
                >
                  <div className={classes.title}>{title.name}:</div>
                  <div className={classes.resultValue}>
                    {resultItem[title.id]}
                  </div>
                </div>
              ))}
            </div>
            <FontAwesomeIcon
              icon="chevron-right"
              className={classes.actionIcon}
            />
          </div>
        </Badge>
      </div>
      <NftValidationItemModal
        show={showModal}
        resultItem={resultItem}
        onClose={closeModal}
        searchParams={searchParams}
      />
    </>
  );
};

export default GenericNftItemResult;
