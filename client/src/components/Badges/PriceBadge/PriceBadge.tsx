import React from 'react';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { PriceComponent } from '../../PriceComponent';

import classes from './PriceBadge.module.scss';

export type Props = {
  costFree?: string;
  type: string;
  title: string;
  costFio: string;
  costUsdc: string;
};

const PriceBadge: React.FC<Props> = props => {
  const { costFio, costFree, costUsdc, title, type } = props;

  const hasWhiteText = type === BADGE_TYPES.BLACK || type === BADGE_TYPES.ERROR;

  return (
    <Badge type={type} show>
      <div
        className={classnames(
          classes.item,
          hasWhiteText && classes.hasWhiteText,
        )}
      >
        {title && (
          <span className={classnames(classes.name, 'boldText')}>{title}</span>
        )}
        <div className={classes.totalPrice}>
          <PriceComponent
            costFio={costFio}
            costUsdc={costUsdc}
            isFree={!!costFree}
          />
        </div>
      </div>
    </Badge>
  );
};

export default PriceBadge;
