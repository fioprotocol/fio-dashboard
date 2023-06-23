import React from 'react';
import classnames from 'classnames';

import { NftItem } from '../../NftsTabComponentContext';

import classes from './NftItemImageComponent.module.scss';

export const NftItemImageComponent: React.FC<NftItem & {
  hasSmallIconSize?: boolean;
}> = props => {
  const {
    contractAddress,
    hasMultipleSignatures,
    imageUrl,
    isImage,
    tokenId,
    hasSmallIconSize,
  } = props;
  return (
    <div
      className={classnames(
        classes.nftItem,
        hasSmallIconSize && classes.hasSmallIconSize,
      )}
    >
      <div
        className={classnames(
          classes.imageContainer,
          (!isImage || hasMultipleSignatures) && classes.notImage,
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
};
