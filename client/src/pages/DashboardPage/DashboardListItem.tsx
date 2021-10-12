import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import Badge, { BADGE_TYPES } from '../../components/Badge/Badge';

import { copyToClipboard } from '../../util/general';
import { useCheckIfDesktop } from '../../screenType';

import classes from './DashboardPage.module.scss';

const TOOLTIP_TEXT = {
  default: 'Click to copy',
  copied: 'Copied!',
};

type Props = {
  listItem: string;
  title: string;
};

const DashboardListItem: React.FC<Props> = props => {
  const { listItem, title } = props;
  const [copyText, changeText] = useState(TOOLTIP_TEXT.default);
  const isDesktop = useCheckIfDesktop();

  const setDefaultTooltipText = () => changeText(TOOLTIP_TEXT.default);

  const onClick = () => {
    copyToClipboard(listItem);
    changeText(TOOLTIP_TEXT.copied);
  };

  return (
    <div className={classes.badgeContainer}>
      <Badge type={BADGE_TYPES.BORDERED} show={true}>
        <div className={classes.badgeItem}>
          {isDesktop && <span>{title}</span>}
          <span className={classes.listItem}>{listItem}</span>
          <OverlayTrigger
            placement="top-start"
            overlay={
              <Tooltip className={classes.tooltip} id="copy">
                <span>{copyText}</span>
              </Tooltip>
            }
          >
            <FontAwesomeIcon
              icon={{ prefix: 'far', iconName: 'copy' }}
              className={classes.copyButton}
              onClick={onClick}
              onMouseLeave={setDefaultTooltipText}
            />
          </OverlayTrigger>
        </div>
      </Badge>
    </div>
  );
};

export default DashboardListItem;
