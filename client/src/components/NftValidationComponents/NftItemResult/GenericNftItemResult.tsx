import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import classes from './GenericNftItemResult.module.scss';
import { nftId } from '../../../util/nft';

type Props = {
  titles: { name: string; id: string }[];
  resultItem: any; // todo: set proper types
};

const GenericNftItemResult: React.FC<Props> = props => {
  const { titles, resultItem } = props;
  return (
    <div className={classes.container} onClick={() => {}}>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <div className={classes.resultsContainer}>
            {titles.map(title => (
              <div
                className={classes.titleContainer}
                key={nftId(
                  resultItem.chainCode,
                  resultItem.tokenId,
                  resultItem.contractAddress,
                )}
              >
                <div className={classes.title}>{title.name}:</div>
                <div className={classes.resultValue}>
                  {resultItem[title.id]}
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
  );
};

export default GenericNftItemResult;
