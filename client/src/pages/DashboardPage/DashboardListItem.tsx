import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../components/Badge/Badge';
import CopyTooltip from '../../components/CopyTooltip';

import { copyToClipboard } from '../../util/general';

import classes from './DashboardPage.module.scss';

type Props = {
  hideTitle?: boolean;
  listItem: string;
  title: string;
};

const DashboardListItem: React.FC<Props> = props => {
  const { hideTitle, listItem, title } = props;

  const onClick = () => {
    copyToClipboard(listItem);
  };

  return (
    <div className={classes.badgeContainer}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          {!hideTitle && <span className={classes.title}>{title}</span>}
          <span className={classes.listItem}>{listItem}</span>
          <div className={classes.copyButtonContainer}>
            <CopyTooltip>
              <FontAwesomeIcon
                icon={{ prefix: 'far', iconName: 'copy' }}
                className={classes.copyButton}
                onClick={onClick}
              />
            </CopyTooltip>
          </div>
        </div>
      </Badge>
    </div>
  );
};

export default DashboardListItem;
