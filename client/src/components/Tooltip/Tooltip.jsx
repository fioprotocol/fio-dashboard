import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './Tooltip.module.scss';

const TooltipComponent = props => {
  const { children } = props;

  return (
    <OverlayTrigger
      placement="bottom-start"
      overlay={<Tooltip className={classes.tooltip}>{children}</Tooltip>}
    >
      <FontAwesomeIcon icon="info-circle" className={classes.icon} />
    </OverlayTrigger>
  );
};

export default TooltipComponent;
