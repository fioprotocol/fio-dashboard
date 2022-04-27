import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './Tooltip.module.scss';

type Props = {
  id: string;
  children: React.ReactNode | React.ReactNode[];
};

const TooltipComponent: React.FC<Props> = props => {
  const { id, children } = props;

  return (
    <OverlayTrigger
      placement="bottom-start"
      overlay={
        <Tooltip id={id} className={classes.tooltip}>
          {children}
        </Tooltip>
      }
    >
      <FontAwesomeIcon icon="info-circle" className={classes.icon} />
    </OverlayTrigger>
  );
};

export default TooltipComponent;
