import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import NftValidationItemModal from '../NftValidationItemModal';

import { NFTTokenDoublet, CommonObjectProps } from '../../../../types';
import { NftValidationFormValues } from '../types';

import classes from './GenericNftItemResult.module.scss';

type Props = {
  titles: { name: string; id: string }[];
  resultItem: NFTTokenDoublet;
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
              {titles.map(title => {
                const resultValue: CommonObjectProps = { ...resultItem };
                return (
                  <div className={classes.titleContainer} key={title.id}>
                    <div className={classes.title}>{title.name}:</div>
                    <div className={classes.resultValue}>
                      {resultValue[title.id]}
                    </div>
                  </div>
                );
              })}
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
