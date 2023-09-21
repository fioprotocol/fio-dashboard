import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import { NFTTokenDoublet } from '../../../types';

import classes from './TokenBadge.module.scss';

type Props = {
  name: string;
  id: string;
} & NFTTokenDoublet;

const NFTTokenBadge: React.FC<Props> = props => {
  const { chainCode, tokenId, contractAddress, name, id } = props;

  return (
    <Link
      to={{
        pathname: ROUTES.FIO_ADDRESS_NFT_EDIT,
        search: `${QUERY_PARAMS_NAMES.ADDRESS}=${name}&${QUERY_PARAMS_NAMES.ID}=${id}`,
      }}
    >
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.container, classes.isNft)}>
          <div className={classes.nftContainer}>
            <div className={classes.subtitle}>
              Chain Code: <span className="boldText">{chainCode}</span>
            </div>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tokenID-${id}`} className={classes.tooltip}>
                  {tokenId}
                </Tooltip>
              }
            >
              <div className={classnames(classes.subtitle, classes.tokenID)}>
                Token ID: <span className="boldText">{tokenId}</span>
              </div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip
                  id={`contractAddress-${id}`}
                  className={classes.tooltip}
                >
                  {contractAddress}
                </Tooltip>
              }
            >
              <div
                className={classnames(
                  classes.subtitle,
                  classes.contractAddress,
                )}
              >
                Contract Address:{' '}
                <span className="boldText">{contractAddress}</span>
              </div>
            </OverlayTrigger>
          </div>
          <ChevronRightIcon className={classes.actionIcon} />
        </div>
      </Badge>
    </Link>
  );
};

export default NFTTokenBadge;
