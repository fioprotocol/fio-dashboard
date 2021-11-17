import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../components/Badge/Badge';
import CopyTooltip from '../../components/CopyTooltip';

import { copyToClipboard } from '../../util/general';
import { useCheckIfDesktop } from '../../screenType';

import classes from './DashboardPage.module.scss';

type Props = {
  listItem: string;
  title: string;
};

const DashboardListItem: React.FC<Props> = props => {
  const { listItem, title } = props;
  const isDesktop = useCheckIfDesktop();

  const onClick = () => {
    copyToClipboard(listItem);
  };

  return (
    <div className={classes.badgeContainer}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          {isDesktop && <span>{title}</span>}
          <span className={classes.listItem}>{listItem}</span>
          <CopyTooltip>
            <FontAwesomeIcon
              icon={{ prefix: 'far', iconName: 'copy' }}
              className={classes.copyButton}
              onClick={onClick}
            />
          </CopyTooltip>
        </div>
      </Badge>
    </div>
  );
};

export default DashboardListItem;
