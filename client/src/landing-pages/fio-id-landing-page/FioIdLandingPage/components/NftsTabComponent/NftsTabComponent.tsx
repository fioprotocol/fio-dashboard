import React from 'react';
import classnames from 'classnames';

import Loader from '../../../../../components/Loader/Loader';

import { TabUIContainer } from '../TabUIContainer';

import classes from './NftsTabComponent.module.scss';
import { useContext } from './NftsTabComponentContext';
import SubmitButton from '../../../../../components/common/SubmitButton/SubmitButton';

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
  const { hasMore, loading, nftsList, loadMore } = useContext({ fch });

  return (
    <TabUIContainer
      {...content}
      title={`${fch} ${content.title}`}
      showEmptyState={!nftsList.length && !loading}
    >
      <div className={classes.container}>
        <div className={classes.nftsContainer}>
          {nftsList.map(nftItem => {
            const {
              imageUrl,
              isImage,
              hasMultipleSignatures,
              tokenId,
              contractAddress,
            } = nftItem;
            return (
              <div className={classes.nftItem} key={tokenId + contractAddress}>
                <div
                  className={classnames(
                    classes.imageContainer,
                    !isImage && classes.notImage,
                  )}
                >
                  <img
                    src={imageUrl}
                    alt={tokenId + contractAddress}
                    className={classnames(
                      classes.image,
                      !isImage && classes.notImage,
                      hasMultipleSignatures && classes.hasMultipleSignatures,
                    )}
                  />
                </div>
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
  );
};
