import React, { ReactNode } from 'react';

import classes from '../AddressWidget.module.scss';

type Props = {
  subtitle: string | ReactNode | null;
};

const SubtitleComponent: React.FC<Props> = props => {
  const { subtitle } = props;
  return (
    <p className={classes.subtitle}>
      {subtitle ||
        'Registering a FIO Crypto Handle is fast and easy. Simply add a username and select a domain.'}
    </p>
  );
};

export default SubtitleComponent;
