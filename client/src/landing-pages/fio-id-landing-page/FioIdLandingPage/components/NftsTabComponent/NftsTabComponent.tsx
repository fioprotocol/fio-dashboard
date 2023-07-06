import React from 'react';

import Loader from '../../../../../components/Loader/Loader';
import Modal from '../../../../../components/Modal/Modal';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';

import { TabUIContainer } from '../TabUIContainer';
import { NftItemComponent } from './components/NftItemComponent';
import { NftItemImageComponent } from './components/NftItemImageComponent';

import { useContext } from './NftsTabComponentContext';

import classes from './NftsTabComponent.module.scss';

const content = {
  title: 'signed these NFTs',
  subtitle:
    'The following NFT Signatures are associated with this FIO Crypto Handle.',
  emptyState: {
    title: 'No NFT SIgnatures',
    message: 'There are no NFT signatures for this FIO Handle.',
  },
};

type Props = {
  fch: string;
};

export const NftsTabComponent: React.FC<Props> = props => {
  const { fch } = props;
  const {
    activeNftItem,
    hasMore,
    loading,
    nftsList,
    showModal,
    loadMore,
    onItemClick,
    onModalClose,
  } = useContext({ fch });

  return (
    <>
      <TabUIContainer
        {...content}
        title={`${fch} ${content.title}`}
        showEmptyState={!nftsList.length && !loading}
      >
        <div className={classes.container}>
          <div className={classes.nftsContainer}>
            {nftsList.map(nftItem => {
              const { tokenId, contractAddress } = nftItem;
              return (
                <div
                  key={tokenId + contractAddress}
                  onClick={() => onItemClick(nftItem)}
                >
                  <NftItemImageComponent {...nftItem} />
                </div>
              );
            })}
          </div>
          {loading && (
            <div className={classes.loader}>
              <Loader />
            </div>
          )}
          {!!hasMore && !loading && (
            <SubmitButton onClick={loadMore} text="Load more" />
          )}
        </div>
      </TabUIContainer>
      <Modal
        show={showModal}
        onClose={onModalClose}
        closeButton
        isSimple
        hasDefaultCloseColor
        title={<div>NFT Signature Information</div>}
        isWide
        headerClass={classes.modalTitle}
      >
        <NftItemComponent {...activeNftItem} fch={fch} />
      </Modal>
    </>
  );
};
