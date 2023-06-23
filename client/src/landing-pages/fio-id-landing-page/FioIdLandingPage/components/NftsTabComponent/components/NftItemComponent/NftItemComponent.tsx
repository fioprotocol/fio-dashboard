import React from 'react';

import classnames from 'classnames';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { NftItem } from '../../NftsTabComponentContext';
import { BADGE_TYPES } from '../../../../../../../components/Badge/Badge';
import { NftItemImageComponent } from '../NftItemImageComponent';
import InfoBadge from '../../../../../../../components/InfoBadge/InfoBadge';

import { useCheckIfDesktop } from '../../../../../../../screenType';

import classes from './NftItemComponent.module.scss';

const BADGE_TITLE = {
  ALTERED: {
    title: 'Image Altered Since Signed',
    type: BADGE_TYPES.WARNING,
  },
  IS_NOT_ALTERED: {
    title: 'Image Not Altered Since Signed',
    type: BADGE_TYPES.INFO,
  },
};

type Props = { fch: string } & NftItem;

type ContentItemProps = {
  title: string;
  value: string;
  valueClass?: string;
};

const ConentItem: React.FC<ContentItemProps> = ({
  title,
  value,
  valueClass,
}) => (
  <div className={classes.contentItem}>
    <p className={classes.contentTitle}>{title}</p>
    <p className={classnames(classes.contentValue, valueClass)}>{value}</p>
  </div>
);

const DescriptionListComponent: React.FC<{ items: (string | string[])[] }> = ({
  items,
}) => {
  return (
    <ul>
      {items.map(item => (
        <li key={Array.isArray(item) ? item[0] : item}>
          {Array.isArray(item) ? (
            <React.Fragment>
              <p>{item[0]}:</p>
              <DescriptionListComponent items={item.slice(1)} />
            </React.Fragment>
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );
};

export const NftItemComponent: React.FC<Props> = props => {
  const {
    contractAddress,
    creatorUrl,
    fch,
    hasMultipleSignatures,
    infuraMetadata,
    isImage,
    isAlteredImage,
    tokenId,
  } = props;

  const { description, externalUrl, name } = infuraMetadata || {};

  const isDesktop = useCheckIfDesktop();

  return (
    <div className={classes.container}>
      <p className={classes.text}>
        This NFT was signed by &nbsp;
        <span className={classes.fch}>{fch}</span>
      </p>
      <ConentItem
        title="Contract Address"
        value={contractAddress}
        valueClass={classes.contractAddress}
      />
      {hasMultipleSignatures ? (
        <InfoBadge
          show={true}
          title="NFT Signature"
          message="This signature applies to all images within this contract."
          type={BADGE_TYPES.INFO}
        />
      ) : (
        <>
          <div className={classes.contentContainer}>
            <div className={classes.imageContainer}>
              <NftItemImageComponent {...props} hasSmallIconSize={isDesktop} />
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  View NFT
                </a>
              )}
            </div>
            <div className={classes.otherContentContainer}>
              <InfoBadge
                show={isImage}
                title={
                  isAlteredImage
                    ? BADGE_TITLE.ALTERED.title
                    : BADGE_TITLE.IS_NOT_ALTERED.title
                }
                type={
                  isAlteredImage
                    ? BADGE_TITLE.ALTERED.type
                    : BADGE_TITLE.IS_NOT_ALTERED.type
                }
                message=""
                hideDash
                className={classnames(
                  classes.badge,
                  isImage && classes.isImage,
                )}
                icon={isAlteredImage ? ReportProblemIcon : CheckCircleIcon}
              />
              {name && <ConentItem title="Name" value={name} />}
              <ConentItem title="Token ID" value={tokenId} />
              {creatorUrl && (
                <ConentItem title="Creator URL" value={creatorUrl} />
              )}
            </div>
          </div>
          {description && (
            <div
              className={classnames(classes.contentItem, classes.description)}
            >
              <p className={classes.contentTitle}>Description</p>
              <ul className={classes.ulList}>
                {description.map(descriptionItem => (
                  <li
                    key={
                      Array.isArray(descriptionItem)
                        ? descriptionItem[0]
                        : descriptionItem
                    }
                  >
                    {Array.isArray(descriptionItem) ? (
                      <React.Fragment>
                        <p>{descriptionItem[0]}</p>
                        <DescriptionListComponent
                          items={descriptionItem.slice(1)}
                        />
                      </React.Fragment>
                    ) : (
                      descriptionItem
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};
