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
  withoutTopMargin?: boolean;
};

const ConentItem: React.FC<ContentItemProps> = ({
  title,
  value,
  valueClass,
  withoutTopMargin,
}) => (
  <div
    className={classnames(
      classes.contentItem,
      withoutTopMargin && classes.withoutTopMargin,
    )}
  >
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
    // hash,
    externalProviderMetadata,
    // isImage,
    isAlteredImage,
    tokenId,
    viewNftLink,
  } = props;

  const { description, name } = externalProviderMetadata || {};

  const isDesktop = useCheckIfDesktop();

  // TODO: show badge false due to DASH-711 task. We hide it until figure out with hash
  const showBage = false; //isImage && !!hash;

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
              {viewNftLink && (
                <a
                  href={viewNftLink}
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
                show={showBage}
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
                  showBage && classes.isImage,
                )}
                icon={isAlteredImage ? ReportProblemIcon : CheckCircleIcon}
              />
              {name && (
                <ConentItem
                  title="Name"
                  value={name}
                  withoutTopMargin={!showBage}
                />
              )}
              <ConentItem
                title="Token ID"
                value={tokenId}
                withoutTopMargin={!showBage && !name}
              />
              {creatorUrl && (
                <ConentItem title="Creator URL" value={creatorUrl} />
              )}
            </div>
          </div>
          {description?.length > 0 && (
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
