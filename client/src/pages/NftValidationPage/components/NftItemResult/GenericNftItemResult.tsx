import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import NftValidationItemModal from '../NftValidationItemModal';

import { NFTTokenDoublet, CommonObjectProps } from '../../../../types';
import { RenderItem } from '../types';

import classes from './GenericNftItemResult.module.scss';
import { TITLE_NAME } from '../../constant';

type Props = {
  titles: { name: string; id: string }[];
  resultItem: NFTTokenDoublet;
  activeItemField: string;
  searchName: string;
  searchValue: string;
  imageUrl?: string;
};

const GenericNftItemResult: React.FC<Props> = props => {
  const {
    titles,
    resultItem,
    searchName,
    searchValue,
    activeItemField,
    imageUrl,
  } = props;
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
                      {resultValue[title.id] || '-'}
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
        activeItemField={activeItemField}
        searchName={searchName}
        searchValue={searchValue}
        imageUrl={imageUrl}
      />
    </>
  );
};

export default GenericNftItemResult;

export const renderContractAddressItem: RenderItem = (
  resultItem,
  searchParams,
) => (
  <GenericNftItemResult
    titles={[TITLE_NAME.fioAddress]}
    resultItem={resultItem}
    searchName={TITLE_NAME.contractAddress.name}
    searchValue={searchParams[TITLE_NAME.contractAddress.id]}
    activeItemField={TITLE_NAME.contractAddress.id}
  />
);

export const renderFioAddressItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[TITLE_NAME.chainCode, TITLE_NAME.tokenId]}
    resultItem={resultItem}
    searchName={TITLE_NAME.fioAddress.name}
    searchValue={searchParams[TITLE_NAME.fioAddress.id]}
    activeItemField={TITLE_NAME.fioAddress.id}
  />
);

export const renderHashItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[
      TITLE_NAME.fioAddress,
      TITLE_NAME.chainCode,
      TITLE_NAME.contractAddress,
    ]}
    resultItem={resultItem}
    searchName={TITLE_NAME.hash.name}
    searchValue={searchParams[TITLE_NAME.hash.id]}
    activeItemField={TITLE_NAME.hash.id}
  />
);

export const renderImageItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[
      TITLE_NAME.fioAddress,
      TITLE_NAME.chainCode,
      TITLE_NAME.contractAddress,
    ]}
    resultItem={resultItem}
    searchName={TITLE_NAME.image.name}
    searchValue={searchParams[TITLE_NAME.imageName.id]}
    activeItemField={TITLE_NAME.hash.id}
    imageUrl={searchParams[TITLE_NAME.imageUrl.id]}
  />
);
