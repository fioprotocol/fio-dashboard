import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

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
            <div className={classes.subtitle}>
              Token ID: <span className="boldText">{tokenId}</span>
            </div>
            <div
              className={classnames(classes.subtitle, classes.contractAddress)}
            >
              Contract Address:{' '}
              <span className="boldText">{contractAddress}</span>
            </div>
          </div>
          <FontAwesomeIcon
            icon="chevron-right"
            className={classes.actionIcon}
          />
        </div>
      </Badge>
    </Link>
  );
};

export default NFTTokenBadge;
