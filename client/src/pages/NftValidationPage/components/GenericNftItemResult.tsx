import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import NftValidationItemModal from './NftValidationItemModal';

import { NFTTokenDoublet } from '../../../types';
import { RenderItem, ResultTitleId } from './types';

import classes from '../styles/GenericNftItemResult.module.scss';
import { TITLE_NAME, NFT_ITEMS_TITLE_NAMES } from '../constant';

type Props = {
  titles: {
    name: string;
    id: ResultTitleId;
  }[];
  resultItem: NFTTokenDoublet;
  activeItemField: string;
  searchName: string;
  searchValue?: string;
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
              {titles.map(title => (
                <div className={classes.titleContainer} key={title.id}>
                  <div className={classes.title}>{title.name}:</div>
                  <div className={classes.resultValue}>
                    {resultItem[title.id] || '-'}
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
    titles={[NFT_ITEMS_TITLE_NAMES.fioAddress]}
    resultItem={resultItem}
    searchName={NFT_ITEMS_TITLE_NAMES.contractAddress.name}
    searchValue={searchParams[NFT_ITEMS_TITLE_NAMES.contractAddress.id]}
    activeItemField={NFT_ITEMS_TITLE_NAMES.contractAddress.id}
  />
);

export const renderFioAddressItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[NFT_ITEMS_TITLE_NAMES.tokenId]}
    resultItem={resultItem}
    searchName={NFT_ITEMS_TITLE_NAMES.fioAddress.name}
    searchValue={searchParams[NFT_ITEMS_TITLE_NAMES.fioAddress.id]}
    activeItemField={NFT_ITEMS_TITLE_NAMES.fioAddress.id}
  />
);

export const renderHashItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[
      NFT_ITEMS_TITLE_NAMES.fioAddress,
      NFT_ITEMS_TITLE_NAMES.contractAddress,
    ]}
    resultItem={resultItem}
    searchName={NFT_ITEMS_TITLE_NAMES.hash.name}
    searchValue={searchParams[NFT_ITEMS_TITLE_NAMES.hash.id]}
    activeItemField={NFT_ITEMS_TITLE_NAMES.hash.id}
  />
);

export const renderImageItem: RenderItem = (resultItem, searchParams) => (
  <GenericNftItemResult
    titles={[
      NFT_ITEMS_TITLE_NAMES.fioAddress,
      NFT_ITEMS_TITLE_NAMES.contractAddress,
    ]}
    resultItem={resultItem}
    searchName={TITLE_NAME.image.name}
    searchValue={searchParams[TITLE_NAME.imageName.id]}
    activeItemField={TITLE_NAME.hash.id}
    imageUrl={searchParams[TITLE_NAME.imageUrl.id]}
  />
);
