import React from 'react';
import classnames from 'classnames';

import { FIO_ADDRESS_DELIMITER } from '../../../../utils';

import classes from './FCHItem.module.scss';

type Props = {
  address: string;
  domain: string;
  hasCenteredText?: boolean;
  hasSmallFont?: boolean;
};

export const FCHItem: React.FC<Props> = props => {
  const { address, domain, hasCenteredText, hasSmallFont } = props;
  return (
    <p
      className={classnames(
        classes.container,
        hasSmallFont && classes.hasSmallFont,
        hasCenteredText && classes.hasCenteredText,
      )}
    >
      <span className={classes.address}>{address}</span>
      <span className={classes.delimiter}>{FIO_ADDRESS_DELIMITER}</span>
      <span className={classes.domain}>{domain}</span>
    </p>
  );
};
